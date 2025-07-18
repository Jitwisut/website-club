// src/app/form/route.js
import { NextResponse } from "next/server";
import { MongoClient } from "mongodb"; // Import MongoClient from mongodb driver

// Environment variable for MongoDB URI
const MONGODB_URI = process.env.MONGODB_URI;
console.log(MONGODB_URI);
// Check if MONGODB_URI is defined
if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

// Global variable to store the MongoDB client
// This is crucial for re-using the connection in serverless environments
let cachedClient = null;
let cachedDb = null;

// Function to connect to MongoDB and return the database instance
async function connectToDatabase() {
  // If we have a cached connection, use it
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  // If no cached client, create a new one
  const client = await MongoClient.connect(MONGODB_URI);
  const db = client.db(); // Get the default database from the URI

  // Cache the client and database for future use
  cachedClient = client;
  cachedDb = db;

  console.log("Successfully connected to MongoDB.");
  return { client, db };
}

// POST handler for form submission
export async function POST(request) {
  let client; // Declare client here to ensure it's accessible in finally block
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

    const { db } = await connectToDatabase(); // Connect to MongoDB
    const usersCollection = db.collection("users"); // Get the 'users' collection

    // MongoDB handles unique constraints automatically via indexes.
    // We will rely on the insert operation to throw an error if a duplicate is found.
    // First, ensure unique indexes are created (can be done once manually or programmatically)
    // For production, it's better to create indexes on deployment or manually.
    // For this example, we'll try to create it here (it will only create if it doesn't exist)
    try {
      await usersCollection.createIndex({ stuid: 1 }, { unique: true });
      await usersCollection.createIndex({ email: 1 }, { unique: true });
      console.log("Unique indexes for stuid and email ensured.");
    } catch (indexError) {
      // This error is usually fine if index already exists
      console.warn(
        "Could not create index (might already exist):",
        indexError.message
      );
    }

    const newUser = {
      aka: aka.trim(),
      name: name.trim(),
      stuid: String(stuid).trim(),
      faculty: faculty.trim(),
      email: email.trim(),
      disname: disname.trim(),
      level: level.trim(),
      interested: interested.trim(), // Store as comma-separated string
      experience: experience.trim(),
      created_at: new Date(), // Add timestamp
    };

    // Attempt to insert the new user document
    const result = await usersCollection.insertOne(newUser);

    console.log("Successfully inserted user with ID:", result.insertedId);
    return NextResponse.json(
      { message: "Success: Welcome to the club!", userId: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error("Form submission error:", error);

    // Handle MongoDB duplicate key error (code 11000)
    if (error.code === 11000) {
      let field = "ข้อมูล"; // Default message
      // MongoDB error message for duplicate key usually contains the field name
      if (error.message.includes("stuid")) {
        field = "รหัสนักศึกษา";
      } else if (error.message.includes("email")) {
        field = "อีเมล";
      }
      return NextResponse.json(
        { error: `${field} นี้มีผู้ใช้งานไปแล้ว` },
        { status: 409 } // 409 Conflict
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
  }
  // No finally block for client.close() as we are caching the client for re-use
  // The client will stay open across multiple invocations in serverless environments
}

// OPTIONS handler for CORS preflight requests (if needed)
export async function OPTIONS(request) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*", // Be specific in production, e.g., 'https://yourfrontenddomain.com'
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400",
    },
  });
}
