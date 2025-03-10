import { pool } from "@/src/lib/db";

// GET: Query businesses based on filters

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const industry_type = searchParams.get("industry_type");
    const status = searchParams.get("status");
    const businessName = searchParams.get("business_name");
    const location = searchParams.get("location");
    const minPrice = parseFloat(searchParams.get("minPrice")) || 0;
    const maxPrice = parseFloat(searchParams.get("maxPrice")) || 9999999;
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const offset = (page - 1) * limit;
    console.log(businessName);

    let query = "SELECT SQL_CALC_FOUND_ROWS * FROM `businesses` WHERE 1";
    let values = [];

    if (businessName) {
      query += " AND name LIKE ?";
      values.push(`%${businessName}%`);
    }
    if (industry_type) {
      query += " AND industry_type = ?";
      values.push(industry_type);
    }
    if (status) {
      query += " AND status = ?";
      values.push(status);
    }
    if (location) {
      query += " AND location = ?";
      values.push(location);
    }
    query += " AND minPrice >= ? AND maxPrice <= ?";
    values.push(minPrice, maxPrice);

    query += " LIMIT ? OFFSET ?";
    values.push(limit, offset);

    const [rows] = await pool.query(query, values);
    const [[{ total }]] = await pool.query("SELECT FOUND_ROWS() AS total");

    return Response.json({
      data: rows,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error(error);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// PATCH: Admin can update any field
export async function PATCH(req) {
  try {
    const data = await req.json();
    const { id, ...fieldsToUpdate } = data;

    if (!id) {
      return Response.json(
        { message: "ID is required for updating" },
        { status: 400 }
      );
    }

    const setFields = Object.keys(fieldsToUpdate)
      .map((field) => `${field} = ?`)
      .join(", ");

    const values = [...Object.values(fieldsToUpdate), id];

    const [result] = await pool.query(
      `UPDATE businesses SET ${setFields} WHERE id = ?`,
      values
    );

    if (result.affectedRows === 0) {
      return Response.json({ message: "Business not found" }, { status: 404 });
    }

    return Response.json({ message: "Business updated successfully" });
  } catch (error) {
    console.error(error);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// POST: Add new business
export async function POST(req) {
  try {
    const {
      name,
      mobile_number,
      review_count,
      rating,
      category,
      address,
      website,
      email_id,
      plus_code,
      closing_hours,
      latitude,
      longitude,
      instagram_profile,
      facebook_profile,
      linkedin_profile,
      twitter_profile,
      thumbnail, // Base64 string directly stored
      status,
      industry_type,
      minPrice,
      maxPrice,
      location,
    } = await req.json();

    if (!name || !category || !status) {
      return Response.json(
        { message: "Name, category, and status are required" },
        { status: 400 }
      );
    }

    const [result] = await pool.query(
      "INSERT INTO `businesses` (name, mobile_number, review_count, rating, category, address, website, email_id, plus_code, closing_hours, latitude, longitude, instagram_profile, facebook_profile, linkedin_profile, twitter_profile, thumbnail, status, industry_type, minPrice, maxPrice, location) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        name,
        mobile_number,
        review_count,
        rating,
        category,
        address,
        website,
        email_id,
        plus_code,
        closing_hours,
        latitude,
        longitude,
        instagram_profile,
        facebook_profile,
        linkedin_profile,
        twitter_profile,
        thumbnail, // Stores the base64 string
        status,
        industry_type,
        minPrice,
        maxPrice,
        location,
      ]
    );

    return Response.json({
      message: "Business created successfully",
      id: result.insertId,
    });
  } catch (error) {
    console.error(error);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE: Remove business
export async function DELETE(req) {
  let connection;
  try {
    const { id } = await req.json();

    if (!id) {
      return Response.json(
        {
          success: false,
          message: "ID is required",
        },
        { status: 400 }
      );
    }

    connection = await pool.getConnection();
    const [result] = await connection.query(
      "DELETE FROM `businesses` WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return Response.json(
        {
          success: false,
          message: "Business not found",
        },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      message: "Business deleted successfully",
    });
  } catch (error) {
    console.error("Delete error:", error);
    return Response.json(
      {
        success: false,
        message: error.message || "Internal Server Error",
      },
      { status: 500 }
    );
  } finally {
    if (connection) {
      try {
        connection.release();
      } catch (releaseError) {
        console.error("Error releasing connection:", releaseError);
      }
    }
  }
}
