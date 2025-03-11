"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import BusinessCard from "./components/BusinessCard";
import FilterSection from "./components/FilterSection";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import CreateBusiness from "./components/CreateBusinesses";

// Create a client
const queryClient = new QueryClient();

// Wrap the main component with QueryClientProvider
export default function BusinessDirectory() {
  return (
    <QueryClientProvider client={queryClient}>
      <BusinessPage />
    </QueryClientProvider>
  );
}

// Main page component
const BusinessPage = () => {
  const params = useParams();
  const industry_type = params.industry_type;
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    business_name: "",
    location: "",
    priceRange: "",
    sortBy: "newest",
  });
  const [showForm, setShowForm] = useState(false);

  // Query for industries
  const { data: industries = [] } = useQuery({
    queryKey: ["industries"],
    queryFn: async () => {
      const response = await fetch("/api/industries");
      if (!response.ok) {
        throw new Error("Failed to fetch industries");
      }
      const data = await response.json();
      return data.data;
    },
  });

  // Query for businesses with dependencies
  const {
    data: businessData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["businesses", industry_type, currentPage, filters, industries],
    queryFn: async () => {
      // Build query parameters
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
      });

      if (filters.business_name)
        params.append("business_name", filters.business_name);
      if (filters.location) params.append("location", filters.location);
      if (filters.priceRange) params.append("priceRange", filters.priceRange);
      if (filters.sortBy) params.append("sortBy", filters.sortBy);

      // Get industry ID from industry_type slug
      const selectedIndustry = industries.find(
        (ind) => ind.name.toLowerCase().replace(/\s+/g, "-") === industry_type
      );

      // Only add industry_type if it's not "all" and we found a matching industry
      if (industry_type && industry_type !== "all" && selectedIndustry) {
        params.append("industry_type", selectedIndustry.id);
      }

      const url = `/api/business?status=active&${params.toString()}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    },
    enabled: industries.length > 0, // Only run this query when industries are available
  });

  const businesses = businessData?.data || [];
  const pagination = businessData?.pagination || {
    total: 0,
    totalPages: 0,
    page: 1,
    limit: 10,
  };

  const handleReset = () => {
    setFilters({
      business_name: "",
      location: "",
      priceRange: "",
      sortBy: "newest",
    });
  };

  if (isLoading) {
    return (
      <div
        style={{ marginTop: "100px" }}
        className='container-fluid py-5 text-center'
      >
        <div className='spinner-border text-primary' role='status'>
          <span className='visually-hidden'></span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='container-fluid py-5 text-center'>
        <div className='alert alert-danger' role='alert'>
          {error.message}
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginTop: "120px" }} className='container'>
      {/* Create Business section */}
      <div className='row mb-4'>
        <div className='col-12 text-center'>
          <button
            className='btn btn-primary px-4 py-2'
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Hide Create Business" : "Create New Business"}
          </button>
        </div>
      </div>
      {showForm && (
        <div className='row'>
          <div className='col-12 col-lg-6 mx-auto'>
            <div className='card shadow-lg border-0 p-4'>
              <CreateBusiness />
            </div>
          </div>
        </div>
      )}
      <div>
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
      <div className='row g-4'>
        <FilterSection
          filters={filters}
          setFilters={setFilters}
          handleReset={handleReset}
        />
        {businesses.map((business) => (
          <div key={business.id} className='col-12 col-md-6 col-lg-4'>
            <BusinessCard business={business} />
          </div>
        ))}
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
