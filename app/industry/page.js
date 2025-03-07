"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Phone,
  MapPin,
  Star,
  Clock,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Mail,
  ExternalLink,
} from "lucide-react";

const BusinessCard = ({ business }) => {
  const MapLink =
    business.latitude && business.longitude
      ? `https://www.google.com/maps?q=${business.latitude},${business.longitude}`
      : business.location
      ? `https://www.google.com/maps/search/${encodeURIComponent(
          business.location
        )}`
      : "#";

  return (
    <div className='card h-100 shadow-sm border-0 hover-shadow transition'>
      <div className='card-body d-flex flex-column p-3'>
        {/* Header Section */}
        <div className='d-flex justify-content-between align-items-start mb-3'>
          <div>
            <h5 className='card-title h5 fw-bold text-primary mb-1'>
              {business.name || "Unnamed Business"}
            </h5>
            <div className='d-flex align-items-center gap-2 mb-2'>
              {/* <span
                className={`badge bg-${
                  business.status === "active" ? "success" : "warning"
                } rounded-pill`}
              >
                {business.status || "Unknown"}
              </span> */}
              <span className='badge bg-light text-dark rounded-pill'>
                {business.category || business.industry_type || "No Category"}
              </span>
            </div>
          </div>
          {business.rating && (
            <div className='rating-badge bg-warning-soft rounded-3 p-2 text-warning'>
              <div className='d-flex align-items-center'>
                <Star className='me-1' size={16} />
                <span className='fw-bold'>{business.rating}</span>
              </div>
              <div className='text-center small mt-1'>
                <small>{business.review_count || 0} reviews</small>
              </div>
            </div>
          )}
        </div>

        {/* Business Details */}
        <div className='flex-grow-1 mb-3'>
          <div className='info-grid'>
            {/* Contact Info */}
            <div
              style={{
                marginBottom: "10px",
              }}
              className='info-item d-flex align-items-center'
            >
              <Phone className='text-primary' size={16} />
              <span
                style={{
                  marginLeft: "10px",
                }}
                className='ms-2'
              >
                {business.mobile_number || "No Contact"}
              </span>
            </div>

            {/* Location */}
            <div
              className='d-flex align-items-start mb-2'
              style={{ height: "60px" }}
            >
              <MapPin
                className='me-3 text-danger'
                style={{ flexShrink: 0 }}
                size={20}
              />
              <a
                href={MapLink}
                target='_blank'
                rel='noopener noreferrer'
                className='text-decoration-none text-dark ms-1'
                style={{
                  marginLeft: "10px",
                  wordBreak: "break-word",
                  flexGrow: 1,
                }}
              >
                {business.address || "No Address"}
              </a>
            </div>
          </div>
        </div>

        {/* Closing Hours */}
        <div
          className='d-flex align-items-start mb-2'
          style={{
            height: "40px", // Set height for Closes
            maxHeight: "40px", // Limit max height
            overflowY: "scroll", // Make content scrollable
            scrollbarWidth: "none", // For Firefox (Hide scrollbar)
            msOverflowStyle: "none", // For IE/Edge (Hide scrollbar)
          }}
        >
          <Clock
            className='me-3 text-info'
            style={{ flexShrink: 0 }}
            size={20}
          />
          <span
            style={{
              marginLeft: "10px",
              flexGrow: 1,
              wordBreak: "break-word",
              maxHeight: "40px", // Limit height for Closes
              overflowY: "scroll", // Make content scrollable
              paddingRight: "15px", // Prevent hiding text due to scroll bar
            }}
            className='ms-1'
          >
            {business.closing_hours && (
              <div className='info-item d-flex align-items-center mb-3'>
                <Clock className='text-info' size={16} />
                <span className='ms-2'>Closes: {business.closing_hours}</span>
              </div>
            )}
          </span>
        </div>

        {/* Contact and Social Links */}
        <div className='border-top pt-3'>
          {/* Primary Actions */}
          <div className='d-flex gap-2 mb-2'>
            {business.website && (
              <a
                href={business.website}
                target='_blank'
                rel='noopener noreferrer'
                className='btn btn-primary btn-sm flex-grow-1'
              >
                <ExternalLink size={14} className='me-1' />
                Visit Website
              </a>
            )}
            {business.email_id && (
              <a
                href={`mailto:${business.email_id}`}
                className='btn btn-outline-secondary btn-sm flex-grow-1'
              >
                <Mail size={14} className='me-1' />
                Contact
              </a>
            )}
          </div>

          {/* Social Media */}
          <div
            style={{ gap: "10px" }}
            className='d-flex justify-content-center gap-2'
          >
            {business.facebook_profile && (
              <a
                href={business.facebook_profile}
                target='_blank'
                rel='noopener noreferrer'
                className='social-link'
              >
                <Facebook size={16} />
              </a>
            )}
            {business.instagram_profile && (
              <a
                href={business.instagram_profile}
                target='_blank'
                rel='noopener noreferrer'
                className='social-link'
              >
                <Instagram size={16} />
              </a>
            )}
            {business.twitter_profile && (
              <a
                href={business.twitter_profile}
                target='_blank'
                rel='noopener noreferrer'
                className='social-link'
              >
                <Twitter size={16} />
              </a>
            )}
            {business.linkedin_profile && (
              <a
                href={business.linkedin_profile}
                target='_blank'
                rel='noopener noreferrer'
                className='social-link'
              >
                <Linkedin size={16} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Page Component
const Page = () => {
  const searchParams = useSearchParams();
  const industry_type = searchParams.get("industry_type");
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    page: 1,
    limit: 10,
  });

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        setLoading(true);

        // Construct URL with all possible parameters
        const params = new URLSearchParams({
          page: currentPage,
          limit: 10,
        });

        // Only add industry_type if it exists
        if (industry_type) {
          params.append("industry_type", industry_type);
        }

        const url = `/api/business?${params.toString()}`;
        console.log("Fetching URL:", url); // Debug URL

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("API Response:", data); // Debug response

        if (data.data) {
          setBusinesses(data.data);
          setPagination({
            total: data.pagination.total,
            totalPages: data.pagination.totalPages,
            page: data.pagination.page,
            limit: data.pagination.limit,
          });
        } else {
          throw new Error("Invalid data format received");
        }
      } catch (error) {
        console.error("Error fetching businesses:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, [industry_type, currentPage]);

  if (loading) {
    return (
      <div className='container-fluid py-5 text-center'>
        <div className='spinner-border text-primary' role='status'>
          <span className='visually-hidden'>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "3rem 1rem",
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
        marginTop: "70px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1400px",
          margin: "0 auto",
          marginBottom: "3rem",
          padding: "0 1rem",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <h1
            style={{
              fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
              fontWeight: "700",
              textAlign: "center",
              color: "#2d3748",
              margin: 0,
              lineHeight: 1.2,
              wordBreak: "break-word",
              maxWidth: "100%",
            }}
          >
            {industry_type
              ? industry_type
                  .split("-")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")
              : "All"}{" "}
            Businesses
          </h1>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: "0.5rem",
            }}
          >
            <small
              style={{
                fontSize: "clamp(0.875rem, 2.5vw, 1.125rem)",
                color: "#718096",
                fontWeight: "500",
                padding: "0.25rem 0.75rem",
                backgroundColor: "#f1f5f9",
                borderRadius: "9999px",
                whiteSpace: "nowrap",
              }}
            >
              {pagination.total || 0} Total Businesses
            </small>
          </div>
        </div>
      </div>

      {/* Grid Container */}
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "0 1rem",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
            gap: "2rem",
            alignItems: "stretch",
            marginBottom: "4rem",
          }}
        >
          {businesses.map((business) => (
            <div
              key={business.id}
              style={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                backgroundColor: "#ffffff",
                borderRadius: "1rem",
                boxShadow:
                  "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                transition:
                  "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                ":hover": {
                  transform: "translateY(-4px)",
                  boxShadow:
                    "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                },
              }}
            >
              <BusinessCard business={business} />
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "2rem 1rem",
            marginTop: "2rem",
          }}
        >
          <nav>
            <ul
              style={{
                display: "flex",
                gap: "0.5rem",
                flexWrap: "wrap",
                justifyContent: "center",
                listStyle: "none",
                padding: 0,
                margin: 0,
              }}
            >
              <li>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                  style={{
                    padding: "0.75rem 1.25rem",
                    borderRadius: "0.5rem",
                    border: "1px solid #e2e8f0",
                    backgroundColor: currentPage === 1 ? "#f7fafc" : "#ffffff",
                    color: currentPage === 1 ? "#a0aec0" : "#2d3748",
                    cursor: currentPage === 1 ? "not-allowed" : "pointer",
                    transition: "all 0.2s ease-in-out",
                  }}
                >
                  Previous
                </button>
              </li>
              {[...Array(pagination.totalPages)].map((_, i) => (
                <li key={i + 1}>
                  <button
                    onClick={() => setCurrentPage(i + 1)}
                    style={{
                      padding: "0.75rem 1.25rem",
                      borderRadius: "0.5rem",
                      border: "1px solid #e2e8f0",
                      backgroundColor:
                        currentPage === i + 1 ? "#4299e1" : "#ffffff",
                      color: currentPage === i + 1 ? "#ffffff" : "#2d3748",
                      cursor: "pointer",
                      transition: "all 0.2s ease-in-out",
                      minWidth: "3rem",
                    }}
                  >
                    {i + 1}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(pagination.totalPages, prev + 1)
                    )
                  }
                  disabled={currentPage === pagination.totalPages}
                  style={{
                    padding: "0.75rem 1.25rem",
                    borderRadius: "0.5rem",
                    border: "1px solid #e2e8f0",
                    backgroundColor:
                      currentPage === pagination.totalPages
                        ? "#f7fafc"
                        : "#ffffff",
                    color:
                      currentPage === pagination.totalPages
                        ? "#a0aec0"
                        : "#2d3748",
                    cursor:
                      currentPage === pagination.totalPages
                        ? "not-allowed"
                        : "pointer",
                    transition: "all 0.2s ease-in-out",
                  }}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
};

export default Page;
