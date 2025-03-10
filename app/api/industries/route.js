import { pool } from "@/src/lib/db";

export async function GET() {
  try {
    const [rows] = await pool.query("SELECT * FROM `industries`");
    return Response.json({ data: rows });
  } catch (error) {
    console.error(error);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { name, industry_type } = await request.json();
    const [result] = await pool.query(
      "INSERT INTO `industries` (`name`, `industry_type`) VALUES (?, ?)",
      [name, industry_type]
    );
    return Response.json({ message: "Industry created", id: result.insertId });
  } catch (error) {
    console.error(error);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    const [result] = await pool.query(
      "DELETE FROM `industries` WHERE `id` = ?",
      [id]
    );
    return Response.json({ message: "Industry deleted" });
  } catch (error) {
    console.error(error);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { id, name, industry_type } = await request.json();
    const [result] = await pool.query(
      "UPDATE `industries` SET `name` = ?, `industry_type` = ? WHERE `id` = ?",
      [name, industry_type, id]
    );
    return Response.json({ message: "Industry updated" });
  } catch (error) {
    console.error(error);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
