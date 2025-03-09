import { pool } from "@/src/lib/db";

export async function GET(req) {
  try {
    const query = "SELECT * FROM `industries` WHERE 1";
    const [rows] = await pool.query(query);
    return Response.json({ data: rows });
  } catch (error) {
    console.error(error);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
