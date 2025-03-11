"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import "bootstrap/dist/css/bootstrap.min.css";
import IndustryForm from "./IndustryForm";
import IndustriesList from "./IndustriesList";

// API functions
const fetchIndustries = async () => {
  const response = await fetch("/api/industries");
  if (!response.ok) throw new Error("Failed to fetch industries");
  const result = await response.json();
  return result.data || [];
};

const addIndustry = async (formData) => {
  const response = await fetch("/api/industries", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });
import IndustriesList from "./IndustriesList";
import IndustriesList from "./IndustriesList";

// API functions
const fetchIndustries = async () => {
  const response = await fetch("/api/industries");
  if (!response.ok) throw new Error("Failed to fetch industries");
  const result = await response.json();
  return result.data || [];
};

const addIndustry = async (formData) => {
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

  return response.json();
};

const updateIndustry = async (formData) => {
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

  return response.json();
};

const deleteIndustry = async (id) => {
  const response = await fetch("/api/industries", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });

  if (!response.ok) throw new Error("Failed to delete industry");
  return response.json();
};

export default function IndustriesPage() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({ name: "", industry_type: "" });
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState(null);

  // Fetch industries using TanStack Query
  const { data: industries = [], isLoading } = useQuery({
    queryKey: ["industries"],
    queryFn: fetchIndustries,
    onError: (err) => {
      console.error("Error fetching industries:", err);
      setError("Failed to load industries. Please try again.");
    },
  });

  // Mutations
  const addMutation = useMutation({
    mutationFn: addIndustry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["industries"] });
      setFormData({ name: "", industry_type: "" });
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateIndustry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["industries"] });
      setFormData({ name: "", industry_type: "" });
      setEditMode(false);
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteIndustry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["industries"] });
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Add new industry
  const handleAdd = (e) => {
    e.preventDefault();
    addMutation.mutate(formData);
  };

  // Delete industry
  const handleDelete = (id) => {
    if (!confirm("Are you sure you want to delete this industry?")) return;
    deleteMutation.mutate(id);
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
  const handleUpdate = (e) => {
    e.preventDefault();
    updateMutation.mutate(formData);
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
            isSubmitting={addMutation.isPending || updateMutation.isPending}
          />
        </div>

        {/* Table */}
        <div className='col-md-8'>
          <IndustriesList
            industries={industries}
            loading={isLoading}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            isDeleting={deleteMutation.isPending}
          />
        </div>
      </div>
    </div>
  );
}
