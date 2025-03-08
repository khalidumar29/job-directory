import { pool } from "@/src/lib/db";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const industry_type = searchParams.get("industry_type");
    const status = searchParams.get("status");
    const businessName = searchParams.get("business_name");
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const offset = (page - 1) * limit;

    let query = "SELECT * FROM `businesses` WHERE 1";
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

    query += " LIMIT ? OFFSET ?";
    values.push(limit, offset);

    const [rows] = await pool.query(query, values);

    let countQuery = "SELECT COUNT(*) AS total FROM `businesses` WHERE 1";
    let countValues = [];

    if (businessName) {
      countQuery += " AND name LIKE ?";
      countValues.push(`%${businessName}%`);
    }
    if (industry_type) {
      countQuery += " AND industry_type = ?";
      countValues.push(industry_type);
    }
    if (status) {
      countQuery += " AND status = ?";
      countValues.push(status);
    }

    const [[{ total }]] = await pool.query(countQuery, countValues);
    console.log(query);

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

export async function PATCH(req) {
  try {
    const { id, status } = await req.json();

    if (!id || !status) {
      return Response.json(
        { message: "ID and status are required" },
        { status: 400 }
      );
    }

    const [result] = await pool.query(
      "UPDATE `businesses` SET status = ? WHERE id = ?",
      [status, id]
    );

    if (result.affectedRows === 0) {
      return Response.json({ message: "Business not found" }, { status: 404 });
    }

    return Response.json({ message: "Status updated successfully" });
  } catch (error) {
    console.error(error);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

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
      images_folder,
      status,
      industry_type,
    } = await req.json();

    if (!name || !category || !status) {
      return Response.json(
        { message: "Name, category, and status are required" },
        { status: 400 }
      );
    }

    const [result] = await pool.query(
      "INSERT INTO `businesses` (name, mobile_number, review_count, rating, category, address, website, email_id, plus_code, closing_hours, latitude, longitude, instagram_profile, facebook_profile, linkedin_profile, twitter_profile, images_folder, status, industry_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
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
        images_folder,
        status,
        industry_type,
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

// Delete a business
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

    // Changed 'business' to 'businesses'
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
