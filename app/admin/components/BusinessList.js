"use client";
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import EditBusinessModal from "./EditBusinessModal";

export default function BusinessList() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [statusLoading, setStatusLoading] = useState(null);
  const [editingBusiness, setEditingBusiness] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    business_name: "",
    category: "",
    status: "",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const fetchBusinesses = useCallback(async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        ...(filters.business_name && { business_name: filters.business_name }),
        ...(filters.category && { category: filters.category }),
        ...(filters.status && { status: filters.status }),
      });

      const response = await fetch(`/api/business?${queryParams}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch businesses");
      }

      setBusinesses(data.data);
      setPagination((prev) => ({
        ...prev,
        total: data.pagination.total,
        totalPages: data.pagination.totalPages,
      }));
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, filters]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this business?")) {
      return;
    }

    try {
      setDeleteLoading(id);
      const response = await fetch("/api/business", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete business");
      }

      toast.success("Business deleted successfully");
      fetchBusinesses();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      setStatusLoading(id);
      const response = await fetch("/api/business", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, status: newStatus }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update status");
      }

      setOpenDropdown(null); // Close dropdown
      toast.success("Status updated successfully");
      fetchBusinesses();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setStatusLoading(null);
    }
  };

  const handleFilter = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  useEffect(() => {
    fetchBusinesses();
  }, [fetchBusinesses]);

  // Handle clicking outside of dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".status-dropdown")) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  //edit functionality
  const handleEditClick = (business) => {
    setEditingBusiness(business);
    setEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch("/api/business", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingBusiness),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update business");
      }

      toast.success("Business updated successfully");
      setEditModalOpen(false);
      fetchBusinesses();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingBusiness((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setEditingBusiness((prev) => ({
        ...prev,
        thumbnail: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className='container py-4'>
      <div className='card shadow-sm mb-4'>
        <div className='card-body'>
          <div className='row g-2'>
            <div className='col-md-4'>
              <input
                type='text'
                className='form-control'
                placeholder='Search business...'
                name='business_name'
                value={filters.business_name}
                onChange={handleFilter}
              />
            </div>
            <div className='col-md-4'>
              <select
                className='form-select'
                name='status'
                value={filters.status}
                onChange={handleFilter}
              >
                <option value=''>All Status</option>
                <option value='active'>Active</option>
                <option value='inactive'>Inactive</option>
                <option value='pending'>Pending</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      {/* Business List */}
      <div className='card shadow-sm'>
        <div className='card-body'>
          {loading ? (
            <div className='text-center py-5'>
              <div className='spinner-border text-primary'></div>
            </div>
          ) : businesses.length === 0 ? (
            <div className='text-center py-5'>
              <p className='text-muted'>No businesses found</p>
            </div>
          ) : (
            <>
              <div className='table-responsive'>
                <table className='table table-hover'>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {businesses.map((business) => (
                      <tr key={business.id}>
                        <td>{business.name}</td>
                        <td>{business.category}</td>
                        <td>{business.email_id || "-"}</td>
                        <td>{business.mobile_number || "-"}</td>
                        <td>
                          <span
                            className={`badge bg-${
                              business.status === "active"
                                ? "success"
                                : business.status === "inactive"
                                ? "danger"
                                : "warning"
                            }`}
                          >
                            {business.status}
                          </span>
                        </td>
                        <td className='position-relative'>
                          <button
                            className='btn btn-sm btn-outline-secondary'
                            onClick={() =>
                              setOpenDropdown(
                                openDropdown === business.id
                                  ? null
                                  : business.id
                              )
                            }
                          >
                            Change Status
                          </button>

                          {/* Status Dropdown - Fixed for Small Screens */}
                          {openDropdown === business.id && (
                            <div
                              className='status-dropdown position-absolute bg-white shadow-sm p-2 rounded w-100'
                              style={{
                                right: 0,
                                zIndex: 10,
                                minWidth: "150px",
                              }}
                            >
                              {["active", "inactive", "pending"].map(
                                (status) => (
                                  <button
                                    key={status}
                                    className='dropdown-item'
                                    onClick={() =>
                                      handleStatusUpdate(business.id, status)
                                    }
                                  >
                                    {status.charAt(0).toUpperCase() +
                                      status.slice(1)}
                                  </button>
                                )
                              )}
                            </div>
                          )}

                          <button
                            className='btn btn-sm btn-danger ms-2'
                            onClick={() => handleDelete(business.id)}
                          >
                            Delete
                          </button>
                          <button
                            className='btn btn-sm btn-primary me-2'
                            onClick={() => handleEditClick(business)}
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Pagination - Now Responsive */}
          {pagination.totalPages > 1 && (
            <nav className='mt-4'>
              <ul className='pagination d-flex flex-wrap justify-content-center overflow-x-auto'>
                <li
                  className={`page-item ${
                    pagination.page === 1 ? "disabled" : ""
                  }`}
                >
                  <button
                    className='page-link'
                    onClick={() => handlePageChange(pagination.page - 1)}
                  >
                    Previous
                  </button>
                </li>

                {Array.from({ length: pagination.totalPages }).map(
                  (_, index) => (
                    <li
                      key={index}
                      className={`page-item ${
                        pagination.page === index + 1 ? "active" : ""
                      }`}
                    >
                      <button
                        className='page-link'
                        onClick={() => handlePageChange(index + 1)}
                      >
                        {index + 1}
                      </button>
                    </li>
                  )
                )}

                <li
                  className={`page-item ${
                    pagination.page === pagination.totalPages ? "disabled" : ""
                  }`}
                >
                  <button
                    className='page-link'
                    onClick={() => handlePageChange(pagination.page + 1)}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </div>
      {editModalOpen && editingBusiness && (
        <EditBusinessModal
          editingBusiness={editingBusiness}
          setEditingBusiness={setEditingBusiness}
          handleEditSubmit={handleEditSubmit}
          handleEditChange={handleEditChange}
          handleImageChange={handleImageChange}
          loading={loading}
          setEditModalOpen={setEditModalOpen}
        />
      )}
    </div>
  );
}
