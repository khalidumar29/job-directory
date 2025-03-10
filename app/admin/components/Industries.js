"use client";

import { useState, useEffect } from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import IndustryForm from "./IndustryForm";
import IndustriesList from "./industriesList";

export default function IndustriesPage() {
  const [industries, setIndustries] = useState([]);
  const [formData, setFormData] = useState({ name: "", industry_type: "" });
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all industries
  const fetchIndustries = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/industries");
      if (!response.ok) throw new Error("Failed to fetch industries");

      const result = await response.json();
      setIndustries(result.data || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching industries:", err);
      setError("Failed to load industries. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Load industries on component mount
  useEffect(() => {
    fetchIndustries();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Add new industry
  const handleAdd = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/industries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            errorData.errors?.join(", ") ||
            "Failed to add industry"
        );
      }

      // Reset form and refresh list
      setFormData({ name: "", industry_type: "" });
      fetchIndustries();
    } catch (err) {
      setError(err.message);
    }
  };

  // Delete industry
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this industry?")) return;

    try {
      const response = await fetch("/api/industries", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) throw new Error("Failed to delete industry");

      fetchIndustries();
    } catch (err) {
      setError(err.message);
    }
  };

  // Edit industry - populate form
  const handleEdit = (industry) => {
    setFormData({
      id: industry.id,
      name: industry.name,
      industry_type: industry.industry_type,
    });
    setEditMode(true);
  };

  // Update industry
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/industries", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            errorData.errors?.join(", ") ||
            "Failed to update industry"
        );
      }

      // Reset form and refresh list
      setFormData({ name: "", industry_type: "" });
      setEditMode(false);
      fetchIndustries();
    } catch (err) {
      setError(err.message);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setFormData({ name: "", industry_type: "" });
    setEditMode(false);
  };

  return (
    <div className='container mt-5'>
      <h1 className='mb-4'>Industries Management</h1>

      {error && (
        <div
          className='alert alert-danger alert-dismissible fade show'
          role='alert'
        >
          {error}
          <button
            type='button'
            className='btn-close'
            onClick={() => setError(null)}
          ></button>
        </div>
      )}

      <div className='row'>
        {/* Form */}
        <div className='col-md-4 mb-4'>
          <IndustryForm
            formData={formData}
            editMode={editMode}
            handleChange={handleChange}
            handleAdd={handleAdd}
            handleUpdate={handleUpdate}
            handleCancel={handleCancel}
          />
        </div>

        {/* Table */}
        <div className='col-md-8'>
          <IndustriesList
            industries={industries}
            loading={loading}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
}
