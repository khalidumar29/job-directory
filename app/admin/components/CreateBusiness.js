"use client";
import { useState, useCallback, useEffect } from "react";
import { toast } from "react-hot-toast";

const INITIAL_STATE = {
  // Basic Information
  name: "",
  category: "",
  industry_type: "",
  status: "active",
  location: "",
  minPrice: "",
  maxPrice: "",

  // Contact Information
  mobile_number: "",
  email_id: "",
  website: "",

  // Location Details
  address: "",
  plus_code: "",
  latitude: "",
  longitude: "",

  // Operating Information
  closing_hours: "",

  // Reviews & Ratings
  review_count: 0,
  rating: 0,

  // Social Media Links
  facebook_profile: "",
  instagram_profile: "",
  twitter_profile: "",
  linkedin_profile: "",

  // Image/Thumbnail
  thumbnail: "", // Base64 string
};

const CATEGORIES = [
  { value: "Retail", label: "Retail" },
  { value: "Restaurant", label: "Restaurant" },
  { value: "Service", label: "Service" },
  { value: "Technology", label: "Technology" },
];

const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "pending", label: "Pending" },
];

export default function CreateBusiness() {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [imagePreview, setImagePreview] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [industries, setIndustries] = useState([]);

  const validateForm = (data) => {
    const errors = {};

    // Required fields
    if (!data.name?.trim()) errors.name = "Business name is required";
    if (!data.industry_type) errors.industry_type = "Industry Type is required";
    if (!data.status) errors.status = "Status is required";

    // Number validations
    if (data.rating && (Number(data.rating) < 0 || Number(data.rating) > 5)) {
      errors.rating = "Rating must be between 0 and 5";
    }
    if (data.review_count && Number(data.review_count) < 0) {
      errors.review_count = "Review count cannot be negative";
    }
    if (data.minPrice && Number(data.minPrice) < 0) {
      errors.minPrice = "Minimum price cannot be negative";
    }
    if (data.maxPrice && Number(data.maxPrice) < 0) {
      errors.maxPrice = "Maximum price cannot be negative";
    }
    if (
      data.minPrice &&
      data.maxPrice &&
      Number(data.minPrice) > Number(data.maxPrice)
    ) {
      errors.maxPrice = "Maximum price must be greater than minimum price";
    }

    // Email validation
    if (data.email_id && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email_id)) {
      errors.email_id = "Invalid email format";
    }

    // URL validations
    const urlFields = [
      "website",
      "facebook_profile",
      "instagram_profile",
      "twitter_profile",
      "linkedin_profile",
    ];
    urlFields.forEach((field) => {
      if (data[field] && !data[field].startsWith("http")) {
        errors[field] = "URL must start with http:// or https://";
      }
    });

    return errors;
  };

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear validation error when field is modified
    setValidationErrors((prev) => ({ ...prev, [name]: "" }));
  }, []);

  // Add this handler function after other handlers
  const handleImageChange = useCallback((e) => {
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
      setFormData((prev) => ({
        ...prev,
        thumbnail: reader.result, // This will be the base64 string
      }));
    };
    reader.readAsDataURL(file);
  }, []);

  const removeImage = useCallback(
    (index) => {
      setFormData((prev) => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index),
      }));

      // Clean up removed preview URL
      URL.revokeObjectURL(imagePreview[index]);
      setImagePreview((prev) => prev.filter((_, i) => i !== index));
    },
    [imagePreview]
  );

  const resetForm = useCallback(() => {
    // Clean up all preview URLs
    imagePreview.forEach((url) => URL.revokeObjectURL(url));

    setFormData(INITIAL_STATE);
    setImagePreview([]);
    setError("");
    setSuccess("");
    setValidationErrors({});
  }, [imagePreview]);

  // Update the handleSubmit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    setValidationErrors({});

    try {
      const errors = validateForm(formData);
      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);
        const firstError = Object.values(errors)[0];
        setError(firstError);
        toast.error(firstError);
        setLoading(false);
        return;
      }

      // Prepare data for submission
      const dataToSend = {
        ...formData,
        review_count: Number(formData.review_count) || 0,
        rating: Number(formData.rating) || 0,
        latitude: formData.latitude ? Number(formData.latitude) : null,
        longitude: formData.longitude ? Number(formData.longitude) : null,
        minPrice: formData.minPrice ? Number(formData.minPrice) : null,
        maxPrice: formData.maxPrice ? Number(formData.maxPrice) : null,
        mobile_number: formData.mobile_number?.trim() || null,
        address: formData.address?.trim() || null,
        website: formData.website?.trim() || null,
        email_id: formData.email_id?.trim() || null,
        plus_code: formData.plus_code?.trim() || null,
        closing_hours: formData.closing_hours?.trim() || null,
        instagram_profile: formData.instagram_profile?.trim() || null,
        facebook_profile: formData.facebook_profile?.trim() || null,
        linkedin_profile: formData.linkedin_profile?.trim() || null,
        twitter_profile: formData.twitter_profile?.trim() || null,
        industry_type: formData.industry_type?.trim() || null,
        location: formData.location?.trim() || null,
        thumbnail: formData.thumbnail || null, // Add this line for the thumbnail
      };

      const response = await fetch("/api/business", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create business");
      }

      toast.success("Business created successfully!");
      setSuccess("Business created successfully!");
      resetForm();
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Clean up URLs when component unmounts
  useEffect(() => {
    return () => {
      imagePreview.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreview]);

  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        const response = await fetch("/api/industries");
        const result = await response.json();
        setIndustries(result.data);
      } catch (error) {
        console.error("Failed to fetch industries:", error);
        toast.error("Failed to load industries");
      }
    };

    fetchIndustries();
  }, []);

  return (
    <div className='container-fluid py-4'>
      <div className='card shadow-lg border-0'>
        <div className='card-header bg-gradient-primary text-white py-3'>
          <h5 className='mb-0'>
            <i className='fas fa-building me-2'></i>
            Create New Business
          </h5>
        </div>

        <div className='card-body p-4'>
          {error && (
            <div
              className='alert alert-danger alert-dismissible fade show'
              role='alert'
            >
              <i className='fas fa-exclamation-circle me-2'></i>
              {error}
              <button
                type='button'
                className='btn-close'
                onClick={() => setError("")}
                aria-label='Close'
              />
            </div>
          )}

          {/* Success Alert */}
          {success && (
            <div
              className='alert alert-success alert-dismissible fade show'
              role='alert'
            >
              <i className='fas fa-check-circle me-2'></i>
              {success}
              <button
                type='button'
                className='btn-close'
                onClick={() => setSuccess("")}
                aria-label='Close'
              />
            </div>
          )}

          <form onSubmit={handleSubmit} className='needs-validation' noValidate>
            <div className='row g-4'>
              {/* Basic Information */}
              <div className='col-12'>
                <div className='card border bg-light'>
                  <div className='card-header bg-light py-3'>
                    <h6 className='mb-0 text-primary'>
                      <i className='fas fa-info-circle me-2'></i>
                      Basic Information
                    </h6>
                  </div>
                  <div className='card-body'>
                    <div className='row g-3'>
                      <div className='col-md-6'>
                        <label className='form-label'>
                          Business Name <span className='text-danger'>*</span>
                        </label>
                        <input
                          type='text'
                          className={`form-control ${
                            formData.name ? "is-valid" : "is-invalid"
                          }`}
                          name='name'
                          value={formData.name}
                          onChange={handleChange}
                          placeholder='Enter business name'
                          required
                        />
                        {!formData.name && (
                          <div className='invalid-feedback'>
                            Business name is required
                          </div>
                        )}
                      </div>
                      <div className='col-md-6'>
                        <label className='form-label'>Category</label>
                        <input
                          type='text'
                          className='form-control'
                          name='category'
                          value={formData.category}
                          onChange={handleChange}
                          placeholder='Enter category'
                        />
                      </div>
                      <div className='col-md-6'>
                        <label className='form-label'>
                          Industry Type <span className='text-danger'>*</span>
                        </label>
                        <select
                          className={`form-select ${
                            formData.industry_type ? "is-valid" : "is-invalid"
                          }`}
                          name='industry_type'
                          value={formData.industry_type}
                          onChange={handleChange}
                          required
                        >
                          <option value=''>Select Industry Type</option>
                          {industries.map((industry) => (
                            <option key={industry.id} value={industry.id}>
                              {industry.industry_type}
                            </option>
                          ))}
                        </select>
                        {!formData.industry_type && (
                          <div className='invalid-feedback'>
                            Industry Type is required
                          </div>
                        )}
                      </div>
                      <div className='col-md-6'>
                        <label className='form-label'>
                          Status <span className='text-danger'>*</span>
                        </label>
                        <select
                          className={`form-select ${
                            formData.status ? "is-valid" : "is-invalid"
                          }`}
                          name='status'
                          value={formData.status}
                          onChange={handleChange}
                          required
                        >
                          {STATUS_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        {!formData.status && (
                          <div className='invalid-feedback'>
                            Status is required
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className='col-12'>
                <div className='card border bg-light'>
                  <div className='card-header bg-light py-3'>
                    <h6 className='mb-0 text-primary'>
                      <i className='fas fa-address-card me-2'></i>
                      Contact Information
                    </h6>
                  </div>
                  <div className='card-body'>
                    <div className='row g-3'>
                      <div className='col-md-6'>
                        <label className='form-label'>Mobile Number</label>
                        <input
                          type='tel'
                          className='form-control'
                          name='mobile_number'
                          value={formData.mobile_number}
                          onChange={handleChange}
                          pattern='[0-9]*'
                          placeholder='Enter mobile number'
                        />
                      </div>
                      <div className='col-md-6'>
                        <label className='form-label'>Email</label>
                        <input
                          type='email'
                          className='form-control'
                          name='email_id'
                          value={formData.email_id}
                          onChange={handleChange}
                          placeholder='Enter email address'
                        />
                      </div>
                      <div className='col-md-12'>
                        <label className='form-label'>Website</label>
                        <input
                          type='url'
                          className='form-control'
                          name='website'
                          value={formData.website}
                          onChange={handleChange}
                          placeholder='https://example.com'
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location Details */}
              <div className='col-md-6'>
                <label className='form-label'>Location</label>
                <input
                  type='text'
                  className='form-control'
                  name='location'
                  value={formData.location}
                  onChange={handleChange}
                  placeholder='Enter location'
                />
              </div>

              <div className='col-md-6'>
                <label className='form-label'>Minimum Price</label>
                <input
                  type='number'
                  className='form-control'
                  name='minPrice'
                  value={formData.minPrice}
                  onChange={handleChange}
                  min='0'
                  placeholder='Enter minimum price'
                />
              </div>

              <div className='col-md-6'>
                <label className='form-label'>Maximum Price</label>
                <input
                  type='number'
                  className='form-control'
                  name='maxPrice'
                  value={formData.maxPrice}
                  onChange={handleChange}
                  min='0'
                  placeholder='Enter maximum price'
                />
              </div>
              {/* Operating Information */}
              <div className='col-12'>
                <div className='card border bg-light'>
                  <div className='card-header bg-light py-3'>
                    <h6 className='mb-0 text-primary'>
                      <i className='fas fa-clock me-2'></i>
                      Operating Information
                    </h6>
                  </div>
                  <div className='card-body'>
                    <div className='row g-3'>
                      <div className='col-12'>
                        <label className='form-label'>Operating Hours</label>
                        <input
                          type='text'
                          className='form-control'
                          name='closing_hours'
                          value={formData.closing_hours}
                          onChange={handleChange}
                          placeholder='e.g., Mon-Fri: 9AM-5PM'
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reviews & Ratings */}
              <div className='col-12'>
                <div className='card border bg-light'>
                  <div className='card-header bg-light py-3'>
                    <h6 className='mb-0 text-primary'>
                      <i className='fas fa-star me-2'></i>
                      Reviews & Ratings
                    </h6>
                  </div>
                  <div className='card-body'>
                    <div className='row g-3'>
                      <div className='col-md-6'>
                        <label className='form-label'>Review Count</label>
                        <input
                          type='number'
                          className='form-control'
                          name='review_count'
                          value={formData.review_count}
                          onChange={handleChange}
                          min='0'
                          placeholder='0'
                        />
                      </div>
                      <div className='col-md-6'>
                        <label className='form-label'>Rating</label>
                        <input
                          type='number'
                          className='form-control'
                          name='rating'
                          value={formData.rating}
                          onChange={handleChange}
                          min='0'
                          max='5'
                          step='0.1'
                          placeholder='0.0'
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media Links */}
              <div className='col-12'>
                <div className='card border bg-light'>
                  <div className='card-header bg-light py-3'>
                    <h6 className='mb-0 text-primary'>
                      <i className='fas fa-share-alt me-2'></i>
                      Social Media Links
                    </h6>
                  </div>
                  <div className='card-body'>
                    <div className='row g-3'>
                      <div className='col-md-6'>
                        <label className='form-label'>Facebook Profile</label>
                        <input
                          type='url'
                          className='form-control'
                          name='facebook_profile'
                          value={formData.facebook_profile}
                          onChange={handleChange}
                          placeholder='https://facebook.com/profile'
                        />
                      </div>
                      <div className='col-md-6'>
                        <label className='form-label'>Instagram Profile</label>
                        <input
                          type='url'
                          className='form-control'
                          name='instagram_profile'
                          value={formData.instagram_profile}
                          onChange={handleChange}
                          placeholder='https://instagram.com/profile'
                        />
                      </div>
                      <div className='col-md-6'>
                        <label className='form-label'>Twitter Profile</label>
                        <input
                          type='url'
                          className='form-control'
                          name='twitter_profile'
                          value={formData.twitter_profile}
                          onChange={handleChange}
                          placeholder='https://twitter.com/profile'
                        />
                      </div>
                      <div className='col-md-6'>
                        <label className='form-label'>LinkedIn Profile</label>
                        <input
                          type='url'
                          className='form-control'
                          name='linkedin_profile'
                          value={formData.linkedin_profile}
                          onChange={handleChange}
                          placeholder='https://linkedin.com/in/profile'
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Image Upload */}
              <div className='col-12'>
                <div className='card border bg-light'>
                  <div className='card-header bg-light py-3'>
                    <h6 className='mb-0 text-primary'>
                      <i className='fas fa-image me-2'></i>
                      Business Thumbnail
                    </h6>
                  </div>
                  <div className='card-body'>
                    <div className='row g-3'>
                      <div className='col-12'>
                        <label className='form-label'>
                          Upload Thumbnail Image
                        </label>
                        <input
                          type='file'
                          className='form-control'
                          onChange={handleImageChange}
                          accept='image/*'
                        />
                        <small className='text-muted d-block mt-1'>
                          Maximum size: 5MB. Supported formats: JPG, PNG, GIF
                        </small>
                      </div>
                      {formData.thumbnail && (
                        <div className='col-12 mt-3'>
                          <div
                            className='position-relative'
                            style={{ width: "200px" }}
                          >
                            <img
                              src={formData.thumbnail}
                              alt='Business thumbnail'
                              className='img-thumbnail'
                              style={{
                                width: "100%",
                                height: "200px",
                                objectFit: "cover",
                              }}
                            />
                            <button
                              type='button'
                              className='btn btn-danger btn-sm position-absolute top-0 end-0 m-1'
                              onClick={() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  thumbnail: "",
                                }));
                              }}
                              aria-label='Remove image'
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {/* Continue with other sections using the same pattern... */}
            </div>
            <div
              style={{ marginTop: "20px" }}
              className='d-flex justify-content-end gap-2'
            >
              <button
                type='button'
                className='btn btn-secondary px-4'
                onClick={resetForm}
                disabled={loading}
              >
                Reset
              </button>
              <button
                type='submit'
                className='btn btn-primary px-4'
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span
                      className='spinner-border spinner-border-sm me-2'
                      role='status'
                      aria-hidden='true'
                    />
                    Creating...
                  </>
                ) : (
                  "Create Business"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
