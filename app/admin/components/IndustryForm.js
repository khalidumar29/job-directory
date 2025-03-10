import React, { useState } from "react";

const IndustryForm = ({
  formData,
  editMode,
  handleChange,
  handleAdd,
  handleUpdate,
  handleCancel,
}) => {
  const [validationErrors, setValidationErrors] = useState({});

  // Format industry type to convert to lowercase and replace spaces with hyphens
  const formatIndustryType = (value) => {
    return value.toLowerCase().replace(/\s+/g, "-");
  };

  // Custom change handler for industry_type field
  const handleIndustryTypeChange = (e) => {
    const rawValue = e.target.value;
    // Only allow lowercase letters and hyphens
    const formattedValue = rawValue.replace(/[^a-z-]/g, "");

    // Use the original handleChange function with the modified event
    const modifiedEvent = {
      ...e,
      target: {
        ...e.target,
        name: "industry_type",
        value: formattedValue,
      },
    };

    handleChange(modifiedEvent);
  };

  // Validate the form before submission
  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Industry name is required";
    }

    if (!formData.industry_type.trim()) {
      errors.industry_type = "Industry type is required";
    } else {
      // Check if industry_type only contains lowercase letters and hyphens
      const industryTypeRegex = /^[a-z-]+$/;
      if (!industryTypeRegex.test(formData.industry_type)) {
        errors.industry_type =
          "Industry type must contain only lowercase letters and hyphens";
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit handler with validation
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      if (editMode) {
        handleUpdate(e);
      } else {
        handleAdd(e);
      }
    }
  };

  return (
    <div className='card'>
      <div className='card-header'>
        {editMode ? "Edit Industry" : "Add New Industry"}
      </div>
      <div className='card-body'>
        <form onSubmit={handleSubmit}>
          <div className='mb-3'>
            <label htmlFor='name' className='form-label'>
              Industry Name
            </label>
            <input
              type='text'
              className={`form-control ${
                validationErrors.name ? "is-invalid" : ""
              }`}
              id='name'
              name='name'
              value={formData.name}
              onChange={handleChange}
              placeholder='Enter industry name'
            />
            {validationErrors.name && (
              <div className='invalid-feedback'>{validationErrors.name}</div>
            )}
          </div>

          <div className='mb-3'>
            <label htmlFor='industry_type' className='form-label'>
              Industry Type
            </label>
            <input
              type='text'
              className={`form-control ${
                validationErrors.industry_type ? "is-invalid" : ""
              }`}
              id='industry_type'
              name='industry_type'
              value={formData.industry_type}
              onChange={handleIndustryTypeChange}
              placeholder='Enter industry type (e.g., mobile-and-it)'
            />
            {validationErrors.industry_type && (
              <div className='invalid-feedback'>
                {validationErrors.industry_type}
              </div>
            )}
            <small className='form-text text-muted'>
              Only lowercase letters and hyphens are allowed (e.g.,
              mobile-and-it)
            </small>
          </div>

          <div className='d-flex gap-2'>
            <button type='submit' className='btn btn-primary'>
              {editMode ? "Update" : "Add"}
            </button>
            {editMode && (
              <button
                type='button'
                className='btn btn-secondary'
                onClick={handleCancel}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default IndustryForm;
