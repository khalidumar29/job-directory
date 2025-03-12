"use client";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import EditBusinessModal from "./EditBusinessModal";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function BusinessList() {
  const queryClient = useQueryClient();
  const [openDropdown, setOpenDropdown] = useState(null);
  const [editingBusiness, setEditingBusiness] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    business_name: "",
    category: "",
    status: "active",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });

  // Fetch businesses with React Query
  const fetchBusinesses = async () => {
    const queryParams = new URLSearchParams({
      page: pagination.page.toString(),
      limit: pagination.limit.toString(),
      ...(filters.business_name && { business_name: filters.business_name }),
      ...(filters.category && { category: filters.category }),
      ...(filters.status && { status: filters.status }),
    });

    const response = await fetch(`/api/business?${queryParams}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch businesses");
    }

    return data;
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["businesses", pagination.page, pagination.limit, filters],
    queryFn: fetchBusinesses,
    keepPreviousData: true,
    staleTime: 60000, // 1 minute before refetching
  });

  // Update pagination total from query results
  useEffect(() => {
    if (data?.pagination) {
      setPagination((prev) => ({
        ...prev,
        total: data.pagination.total,
        totalPages: data.pagination.totalPages,
      }));
    }
  }, [data]);

  console.log(data);

  // Delete business mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
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

      return data;
    },
    onSuccess: () => {
      toast.success("Business deleted successfully");
      queryClient.invalidateQueries(["businesses"]);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Update status mutation
  const statusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      const response = await fetch("/api/business", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, status }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update status");
      }

      return data;
    },
    onSuccess: () => {
      setOpenDropdown(null); // Close dropdown
      toast.success("Status updated successfully");
      queryClient.invalidateQueries(["businesses"]);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Edit business mutation
  const editMutation = useMutation({
    mutationFn: async (updatedBusiness) => {
      const response = await fetch("/api/business", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedBusiness),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update business");
      }

      return data;
    },
    onSuccess: () => {
      toast.success("Business updated successfully");
      setEditModalOpen(false);
      queryClient.invalidateQueries(["businesses"]);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this business?")) {
      return;
    }
    deleteMutation.mutate(id);
  };

  const handleStatusUpdate = async (id, newStatus) => {
    statusMutation.mutate({ id, newStatus });
  };

  const handleFilter = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

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

  const handleEditClick = (business) => {
    setEditingBusiness(business);
    setEditModalOpen(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    editMutation.mutate(editingBusiness);
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

  if (isError) {
    toast.error(error.message);
  }

  const businesses = data?.data || [];

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
          {isLoading ? (
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

                          {/* Status Dropdown */}
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
                                    disabled={statusMutation.isLoading}
                                  >
                                    {status.charAt(0).toUpperCase() +
                                      status.slice(1)}
                                  </button>
                                )
                              )}
                            </div>
                          )}

                          <button
                            className='btn btn-sm btn-primary ms-2'
                            onClick={() => handleEditClick(business)}
                          >
                            Edit
                          </button>
                          <button
                            className='btn btn-sm btn-danger ms-2'
                            onClick={() => handleDelete(business.id)}
                            disabled={deleteMutation.isLoading}
                          >
                            {deleteMutation.isLoading &&
                            deleteMutation.variables === business.id
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Pagination */}
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
                    disabled={isLoading}
                  >
                    Previous
                  </button>
                </li>

                {Array.from({ length: pagination.totalPages - 1 }).map(
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
                        disabled={isLoading}
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
                    disabled={isLoading}
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
          loading={editMutation.isLoading}
          setEditModalOpen={setEditModalOpen}
        />
      )}
    </div>
  );
}
