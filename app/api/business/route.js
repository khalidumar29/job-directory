import { pool } from "@/src/lib/db";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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
    if (location) {
      query += " AND location = ?";
      values.push(location);
    }
    query += " AND minPrice >= ? AND maxPrice <= ?";
    values.push(minPrice, maxPrice);
    query += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
    values.push(limit, offset);

    const [rows] = await pool.query(query, values);

    const [[{ total }]] = await pool.query(
      "SELECT COUNT(*) AS total FROM businesses WHERE 1 AND status = ?",
      [status]
    );

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
    const { id, thumbnail, ...fieldsToUpdate } = data;
    console.log(data);

    if (!id) {
      return Response.json(
        { message: "ID is required for updating" },
        { status: 400 }
      );
    }
    if (thumbnail) {
      try {
        const uploadResponse = await cloudinary.uploader.upload(thumbnail, {
          folder: "business_thumbnails",
          resource_type: "image",
        });

        fieldsToUpdate.thumbnail = uploadResponse.secure_url;
      } catch (cloudinaryError) {
        console.error("Cloudinary Upload Error:", cloudinaryError);
        return Response.json(
          { message: "Failed to upload image" },
          { status: 500 }
        );
      }
    }

    // Prepare query
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
    let {
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
      thumbnail,
      status,
      industry_type,
      minPrice,
      maxPrice,
      location,
    } = await req.json();
    console.log(location);

    if (!name || !category || !status) {
      return Response.json(
        { message: "Name, category, and status are required" },
        { status: 400 }
      );
    }

    if (thumbnail) {
      const uploadResponse = await cloudinary.uploader.upload(thumbnail, {
        folder: "business_thumbnails", // Optional: Define a Cloudinary folder
        resource_type: "image",
      });

      thumbnail = uploadResponse.secure_url;
    }

    const [result] = await pool.query(
      "INSERT INTO `businesses` (name, mobile_number, review_count, rating, category, address, location, website, email_id, plus_code, closing_hours, latitude, longitude, instagram_profile, facebook_profile, linkedin_profile, twitter_profile, thumbnail, status, industry_type, minPrice, maxPrice, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())",
      [
        name,
        mobile_number,
        review_count,
        rating,
        category,
        address,
        location,
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
        thumbnail, // Store Cloudinary URL instead of base64
        status,
        industry_type,
        minPrice,
        maxPrice, // 🔥 Ensure maxPrice is included here
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
        { success: false, message: "ID is required" },
        { status: 400 }
      );
    }

    connection = await pool.getConnection();

    // Fetch the business details to check if it has a Cloudinary thumbnail
    const [business] = await connection.query(
      "SELECT thumbnail FROM `businesses` WHERE id = ?",
      [id]
    );

    if (business.length === 0) {
      return Response.json(
        { success: false, message: "Business not found" },
        { status: 404 }
      );
    }

    const imageUrl = business[0].thumbnail;

    // If there's a Cloudinary image URL, delete it
    if (imageUrl) {
      try {
        const publicId = imageUrl.split("/").pop().split(".")[0]; // Extract public ID
        await cloudinary.uploader.destroy(`business_thumbnails/${publicId}`);
      } catch (cloudinaryError) {
        console.error("Cloudinary Delete Error:", cloudinaryError);
      }
    }

    // Delete the business record from the database
    const [result] = await connection.query(
      "DELETE FROM `businesses` WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return Response.json(
        { success: false, message: "Business not found" },
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
      { success: false, message: error.message || "Internal Server Error" },
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
