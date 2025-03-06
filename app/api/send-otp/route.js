import { pool } from "@/src/lib/db";
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000);
};

export async function POST(req) {
  try {
    const { email } = await req.json();
    const newOtp = generateOTP();

    const createdAtUTC = new Date()
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    const [existing] = await pool.query(
      "SELECT * FROM email_verification WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      // Update OTP and reset the timestamp
      await pool.query(
        "UPDATE email_verification SET otp = ?, created_at = ? WHERE email = ?",
        [newOtp, createdAtUTC, email]
      );
    } else {
      await pool.query(
        "INSERT INTO email_verification (email, otp, created_at) VALUES (?, ?, ?)",
        [email, newOtp, createdAtUTC]
      );
    }

    await transporter.sendMail({
      from: process.env.SMTP_EMAIL,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${newOtp}. It is valid for 5 minutes.`,
    });

    return NextResponse.json(
      { message: "OTP sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
