"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Phone, MapPin, Star, Globe } from "lucide-react";

// Business Card Component
const BusinessCard = ({ business }) => {
  return (
    <div className='card h-100 shadow-sm border-0'>
      <div className='card-body d-flex flex-column'>
        {/* Header Section */}
        <div className='d-flex justify-content-between align-items-start mb-3'>
          <div>
            <h5 className='card-title h4 mb-1 text-primary'>{business.name}</h5>
            <h6 className='card-subtitle text-muted mb-2'>
              {business.industry_type}
            </h6>
          </div>
          <div className='d-flex align-items-center text-warning'>
            <Star className='me-2' size={22} />
            <span className='h5 mb-0 fw-bold'>{business.rating || "N/A"}</span>
          </div>
        </div>

        {/* Business Details */}
        <div className='flex-grow-1 mb-3'>
          <div className='d-flex align-items-center mb-2'>
            <Phone className='me-3 text-primary' size={20} />
            <span className='ms-1'>{business.phone || "No Contact"}</span>
          </div>

          <div
            className='d-flex align-items-start mb-2'
            style={{ height: "60px" }}
          >
            <MapPin
              className='me-3 text-danger'
              style={{ flexShrink: 0 }}
              size={20}
            />
            <span
              className='ms-1'
              style={{
                marginLeft: "10px",
                wordBreak: "break-word",
                flexGrow: 1,
              }}
            >
              {business.location || "No Address"}
            </span>
          </div>

          {/* Status and Reviews */}
          <div className='d-flex justify-content-between align-items-center mb-3'>
            <span
              className={`badge bg-${
                business.status === "active" ? "success" : "warning"
              }`}
            >
              {business.status}
            </span>
            <div className='d-flex align-items-center'>
              <Star className='me-2 text-warning' size={20} />
              <span>{business.reviews || "0"} Reviews</span>
            </div>
          </div>
        </div>

        {/* Action Links */}
        <div className='border-top pt-3 d-flex justify-content-between'>
          <Link
            href={`/business/${business.id}`}
            className='btn btn-outline-primary btn-sm'
          >
            View Details
          </Link>
          {business.website && (
            <a
              href={business.website}
              target='_blank'
              rel='noopener noreferrer'
              className='btn btn-outline-secondary btn-sm'
            >
              <Globe size={16} className='me-1' />
              Website
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

// Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className='d-flex justify-content-center mt-5'>
      <nav aria-label='Page navigation'>
        <ul className='pagination pagination-lg'>
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              className='page-link'
              onClick={() => onPageChange(currentPage - 1)}
            >
              Previous
            </button>
          </li>
          {Array.from({ length: totalPages }, (_, i) => (
            <li
              key={i + 1}
              className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
            >
              <button className='page-link' onClick={() => onPageChange(i + 1)}>
                {i + 1}
              </button>
            </li>
          ))}
          <li
            className={`page-item ${
              currentPage === totalPages ? "disabled" : ""
            }`}
          >
            <button
              className='page-link'
              onClick={() => onPageChange(currentPage + 1)}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

// Main Industry Page Component
const IndustryPage = () => {
  const params = useParams();
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 0 });

  // Format industry type for display
  const formattedIndustryType = params.industry_type
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `/api/businesses?industry_type=${encodeURIComponent(
            params.industry_type
          )}&page=${currentPage}&limit=12`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setBusinesses(data.data);
        setPagination(data.pagination);
      } catch (error) {
        console.error("Error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (params.industry_type) {
      fetchBusinesses();
    }
  }, [params.industry_type, currentPage]);

  if (loading) {
    return (
      <div className='container-fluid py-5 text-center'>
        <div className='spinner-border text-primary' role='status'>
          <span className='visually-hidden'>Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='container-fluid py-5 text-center'>
        <div className='alert alert-danger' role='alert'>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className='container-fluid py-5 px-4 px-md-5'>
      <h1 className='text-center mb-5 display-5'>
        {formattedIndustryType} Businesses
        <small className='text-muted ms-2'>({businesses.length} Total)</small>
      </h1>

      {businesses.length === 0 ? (
        <div className='text-center py-5'>
          <p className='h4 text-muted'>No businesses found in this industry.</p>
        </div>
      ) : (
        <>
          <div className='row g-4'>
            {businesses.map((business) => (
              <div
                key={business.id}
                className='col-12 col-md-6 col-lg-4 col-xl-3'
              >
                <BusinessCard business={business} />
              </div>
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={pagination.totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}
    </div>
  );
};

export default IndustryPage;
