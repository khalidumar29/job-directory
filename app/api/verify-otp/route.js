import { pool } from "@/src/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { email, otp } = await req.json();
    console.log("User Input:", { email, otp });

    const [rows] = await pool.query(
      "SELECT email, otp, created_at FROM email_verification WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: "Email not found" }, { status: 400 });
    }

    const record = rows[0];
    const dbOtp = record.otp;

    const createdAtUTC = new Date(record.created_at);

    const nowUTC = new Date();

    const diffMinutes = (nowUTC - createdAtUTC) / (1000 * 60);

    console.log("Created At (UTC):", createdAtUTC.toISOString());
    console.log("Now (UTC):", nowUTC.toISOString());
    console.log("Time Difference (minutes):", diffMinutes);
    console.log("Is OTP Valid (<= 5 min)?", diffMinutes <= 5);

    if (dbOtp === otp && diffMinutes <= 5) {
      return NextResponse.json(
        { verified: true, message: "Email verified successfully" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { verified: false, message: "Invalid or expired OTP" },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
