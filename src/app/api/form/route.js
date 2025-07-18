import { NextResponse } from "next/server";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

export async function openDB() {
  const db = await open({
    filename: "./user.sqlite",
    driver: sqlite3.Database,
  });
  await db.run(
    "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT,aka TEXT,name TEXT,stuid INTEGER,faculty TEXT,email TEXT,disname TEXT,level TEXT,interested TEXt,experience TEXT)"
  );
  console.log("Success create table");
  return db;
}

export async function POST(request) {
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

  const db = await openDB();

  if (
    !aka ||
    !name ||
    !stuid ||
    !faculty ||
    !email ||
    !disname ||
    !level ||
    !interested ||
    !experience
  ) {
    return NextResponse.json(
      { error: "Please complete all input" },
      { status: 400 }
    );
  }
  const query =
    "INSERT INTO users (aka,name,stuid,faculty,email,disname,level,interested,experience) VALUES (?,?,?,?,?,?,?,?,?)";
  await db.run(query, [
    aka,
    name,
    stuid,
    faculty,
    email,
    disname,
    level,
    interested,
    experience,
  ]);
  return NextResponse.json(
    { message: "Success ยินดีต้อนรับเข้าสู่ชมรม" },
    { status: 201 }
  );
}
