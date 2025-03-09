"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import BusinessCard from "./components/BusinessCard";
import FilterSection from "./components/FilterSection";

const Page = () => {
  const params = useParams();
  const industry_type = params.industry_type;
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    search: "",
    location: "",
    priceRange: "",
    sortBy: "newest",
  });

  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    page: 1,
    limit: 10,
  });
  const [industries, setIndustries] = useState([]); // Add this state

  // Add this new fetch function for industries
  const fetchIndustries = async () => {
    try {
      const response = await fetch("/api/industries");
      const data = await response.json();
      setIndustries(data.data);
    } catch (error) {
      console.error("Error fetching industries:", error);
    }
  };

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        setLoading(true);

        // First, fetch industries if not already loaded
        if (industries.length === 0) {
          await fetchIndustries();
        }

        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: "10",
        });

        if (filters.search) params.append("search", filters.search);
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

        const data = await response.json();

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
  }, [industry_type, currentPage, industries, filters]);

  const handleReset = () => {
    setFilters({
      search: "",
      location: "",
      priceRange: "",
      sortBy: "newest",
    });
  };

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
    <div
      style={{
        padding: "3rem 1rem",
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1400px",
          margin: "0 auto",
          marginBottom: "3rem",
          padding: "0 1rem",
          marginTop: "70px",
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
        <FilterSection
          filters={filters}
          setFilters={setFilters}
          handleReset={handleReset}
        />
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
