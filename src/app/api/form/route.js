// src/app/form/route.js
// WARNING: This SQLite implementation is NOT recommended for production environments
// where data persistence and concurrent writes are critical, especially on serverless platforms
// like Vercel/Netlify due to their ephemeral filesystems. Data will be lost.

import { NextResponse } from "next/server";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

// Function to open/create the SQLite database connection
export async function openDB() {
  const db = await open({
    filename: ":memory:", // SQLite in-memory database
    driver: sqlite3.Database,
  });

  await db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      aka TEXT,
      name TEXT,
      stuid TEXT UNIQUE,       
      faculty TEXT,
      email TEXT UNIQUE,      
      disname TEXT,
      level TEXT,
      interested TEXT,
      experience TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  // FIX: Removed dbPath from console.log as it's an in-memory DB
  console.log("Success: In-memory database table 'users' ensured to exist.");
  return db;
}

// POST handler for form submission
export async function POST(request) {
  let db;
  try {
    const body = await request.json();
    const {
      aka,
      name,
      stuid,
      faculty,
      email,
      disname,
      level,
      interested,
      experience,
    } = body;

    // --- Server-side Input Validation ---
    if (
      !aka ||
      aka.trim() === "" ||
      !name ||
      name.trim() === "" ||
      !stuid ||
      String(stuid).trim() === "" ||
      !faculty ||
      faculty.trim() === "" ||
      !email ||
      email.trim() === "" ||
      !disname ||
      disname.trim() === "" ||
      !level ||
      level.trim() === "" ||
      !experience ||
      experience.trim() === "" ||
      !interested
    ) {
      console.error("Validation Error: Missing or empty required fields.");
      return NextResponse.json(
        { error: "Please complete all required fields." },
        { status: 400 }
      );
    }

    const interestedArray = interested
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item !== "");

    if (interestedArray.length === 0) {
      console.error("Validation Error: No interests selected.");
      return NextResponse.json(
        { error: "Please select at least one area of interest." },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      console.error("Validation Error: Invalid email format.");
      return NextResponse.json(
        { error: "Invalid email format." },
        { status: 400 }
      );
    }
    // --- End Validation ---

    db = await openDB(); // Open database connection

    // --- REMOVED DUPLICATE CHECK SELECT QUERY HERE ---
    // Instead, rely on the UNIQUE constraint of the database and handle the error.

    const insertQuery = `
      INSERT INTO users (aka, name, stuid, faculty, email, disname, level, interested, experience)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      aka.trim(),
      name.trim(),
      String(stuid).trim(),
      faculty.trim(),
      email.trim(),
      disname.trim(),
      level.trim(),
      interested.trim(),
      experience.trim(),
    ];

    // Attempt to insert the data. If stuid or email are not unique, db.run will throw an error.
    await db.run(insertQuery, values);

    console.log("Successfully inserted user:", { aka, email });
    return NextResponse.json(
      { message: "Success: Welcome to the club!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Form submission error:", error);

    // Handle UNIQUE constraint error from SQLite
    // The error message for unique constraint violation in sqlite3 typically contains 'SQLITE_CONSTRAINT_UNIQUE'
    if (error.message && error.message.includes("SQLITE_CONSTRAINT_UNIQUE")) {
      let field = "ข้อมูล"; // Default message
      // Try to be more specific based on the error message details
      if (error.message.includes("users.stuid")) {
        field = "รหัสนักศึกษา";
      } else if (error.message.includes("users.email")) {
        field = "อีเมล";
      }
      return NextResponse.json(
        { error: `${field} นี้มีผู้ใช้งานไปแล้ว` }, // More specific error message
        { status: 409 } // Use 409 Conflict for duplicate data
      );
    }

    // Generic error for other unexpected issues
    return NextResponse.json(
      {
        error: "An unexpected error occurred. Please try again.",
        details: error.message,
      },
      { status: 500 }
    );
  } finally {
    if (db) {
      await db.close();
      console.log("Database connection closed.");
    }
  }
}

// OPTIONS handler for CORS preflight requests (if needed)
export async function OPTIONS(request) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400",
    },
  });
}
