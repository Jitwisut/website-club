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
    // เปลี่ยน filename เป็น ":memory:" เพื่อให้ SQLite สร้างฐานข้อมูลใน RAM
    filename: ":memory:",
    driver: sqlite3.Database,
  });
  // Create table if it doesn't exist
  // Note: For 'stuid' and 'email', added UNIQUE constraint.
  // 'interested' is TEXT, assuming comma-separated string.
  await db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      aka TEXT,
      name TEXT,
      stuid TEXT UNIQUE,       -- Changed to TEXT and UNIQUE
      faculty TEXT,
      email TEXT UNIQUE,      -- Added UNIQUE
      disname TEXT,
      level TEXT,
      interested TEXT,
      experience TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log("Success: Database table 'users' ensured to exist at:", dbPath);
  return db;
}

// POST handler for form submission
export async function POST(request) {
  let db; // Declare db outside try-catch to ensure it's accessible in finally
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
    // Check if all required fields are present and not just empty strings after trimming
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
      !interested // Check if 'interested' property exists
    ) {
      console.error("Validation Error: Missing or empty required fields.");
      return NextResponse.json(
        { error: "Please complete all required fields." },
        { status: 400 }
      );
    }

    // Specific validation for 'interested' (assuming it's a comma-separated string)
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

    // Basic email format validation (more robust validation should use a library)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      console.error("Validation Error: Invalid email format.");
      return NextResponse.json(
        { error: "Invalid email format." },
        { status: 400 }
      );
    }

    // Open database connection
    db = await openDB();
    const queriescheck = `SELECT stuid,email FROM users WHERE stuid=? OR email=?`;
    const query = `
      INSERT INTO users (aka, name, stuid, faculty, email, disname, level, interested, experience)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const existingUser = await db.get(queriescheck, [stuid, email]);
    if (existingUser) {
      return NextResponse.json(
        {
          error: "อีเมลหรือรหัสนักศึกษามีคนใช้งานไปแล้ว",
        },
        { status: 400 }
      );
    }

    // Use parameterized queries to prevent SQL Injection
    // FIX: Correctly pass the 'values' array directly, not wrapped in another array.
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

    await db.run(query, values); // Corrected: passing values directly

    console.log("Successfully inserted user:", { aka, email });
    return NextResponse.json(
      { message: "Success: Welcome to the club!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Form submission error:", error);

    // Generic error for other cases
    return NextResponse.json(
      {
        error: "An unexpected error occurred. Please try again.",
        details: error.message,
      },
      { status: 500 }
    );
  } finally {
    // Ensure the database connection is closed after every request
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
      "Access-Control-Allow-Origin": "*", // Be specific in production, e.g., 'https://yourfrontenddomain.com'
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400", // Cache preflight for 24 hours
    },
  });
}
