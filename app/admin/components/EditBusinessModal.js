"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function EditBusinessModal({
  editingBusiness,
  setEditingBusiness,
  handleEditSubmit,
  handleEditChange,
  handleImageChange,
  loading,
  setEditModalOpen,
}) {
  const [industries, setIndustries] = useState([]);

  useEffect(() => {
    async function fetchIndustries() {
      try {
        const response = await fetch("/api/industries");
        const result = await response.json();
        setIndustries(result.data);
      } catch (error) {
        console.error("Failed to fetch industries:", error);
      }
    }
    fetchIndustries();
  }, []);

  return (
    <div
      className='modal show d-block'
      style={{
        backgroundColor: "rgba(0,0,0,0.7)",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflowY: "auto",
      }}
    >
      <div
        className='modal-dialog modal-dialog-scrollable modal-lg'
        style={{
          width: "100%",
          maxWidth: "95%",
          margin: "20px auto",
          minHeight: "calc(100vh - 40px)",
        }}
      >
        <div className='modal-content'>
          <div
            className='modal-header py-3'
            style={{
              position: "sticky",
              top: 0,
              backgroundColor: "white",
              zIndex: 1030,
            }}
          >
            <h5 className='modal-title d-flex align-items-center'>
              <i className='fas fa-edit me-2'></i>
              Edit Business
            </h5>
            <button
              type='button'
              className='btn-close'
              onClick={() => setEditModalOpen(false)}
            ></button>
          </div>

          <form onSubmit={handleEditSubmit}>
            <div
              className='modal-body p-4'
              style={{
                maxHeight: "calc(100vh - 200px)", // Limit height for scrollable content
                overflowY: "auto", // Make it scrollable
              }}
            >
              <div className='row g-4'>
                {/* Basic Information */}
                <div className='col-12'>
                  <div className='card border'>
                    <div className='card-header bg-light py-3'>
                      <h6 className='mb-0 text-primary'>
                        <i className='fas fa-info-circle me-2'></i>
                        Basic Information
                      </h6>
                    </div>
                    <div className='card-body'>
                      <div className='row g-3'>
                        <div className='col-12 col-md-6'>
                          <label className='form-label fw-medium'>
                            Business Name <span className='text-danger'>*</span>
                          </label>
                          <input
                            type='text'
                            className='form-control'
                            name='name'
                            value={editingBusiness.name}
                            onChange={handleEditChange}
                            required
                          />
                        </div>
                        <div className='col-12 col-md-6'>
                          <label className='form-label fw-medium'>
                            Category
                          </label>
                          <input
                            type='text'
                            className='form-control'
                            name='category'
                            value={editingBusiness.category || ""}
                            onChange={handleEditChange}
                          />
                        </div>
                        <div className='col-12 col-md-6'>
                          <label className='form-label fw-medium'>
                            Industry Type <span className='text-danger'>*</span>
                          </label>
                          <select
                            className='form-select'
                            name='industry_type'
                            value={editingBusiness.industry_type}
                            onChange={handleEditChange}
                            required
                          >
                            <option value=''>Select Industry Type</option>
                            {industries.map((industry) => (
                              <option key={industry.id} value={industry.id}>
                                {industry.industry_type}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className='col-12 col-md-6'>
                          <label className='form-label fw-medium'>
                            Status <span className='text-danger'>*</span>
                          </label>
                          <select
                            className='form-select'
                            name='status'
                            value={editingBusiness.status}
                            onChange={handleEditChange}
                            required
                          >
                            <option value=''>Select Status</option>
                            <option value='active'>Active</option>
                            <option value='inactive'>Inactive</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className='col-12'>
                  <div className='card border'>
                    <div className='card-header bg-light py-3'>
                      <h6 className='mb-0 text-primary'>
                        <i className='fas fa-address-card me-2'></i>
                        Contact Information
                      </h6>
                    </div>
                    <div className='card-body'>
                      <div className='row g-3'>
                        <div className='col-12 col-md-6'>
                          <label className='form-label fw-medium'>
                            Mobile Number
                          </label>
                          <div className='input-group'>
                            <span className='input-group-text'>
                              <i className='fas fa-phone'></i>
                            </span>
                            <input
                              type='tel'
                              className='form-control'
                              name='mobile_number'
                              value={editingBusiness.mobile_number || ""}
                              onChange={handleEditChange}
                            />
                          </div>
                        </div>
                        <div className='col-12 col-md-6'>
                          <label className='form-label fw-medium'>Email</label>
                          <div className='input-group'>
                            <span className='input-group-text'>
                              <i className='fas fa-envelope'></i>
                            </span>
                            <input
                              type='email'
                              className='form-control'
                              name='email_id'
                              value={editingBusiness.email_id || ""}
                              onChange={handleEditChange}
                            />
                          </div>
                        </div>
                        <div className='col-12'>
                          <label className='form-label fw-medium'>
                            Website
                          </label>
                          <div className='input-group'>
                            <span className='input-group-text'>
                              <i className='fas fa-globe'></i>
                            </span>
                            <input
                              type='url'
                              className='form-control'
                              name='website'
                              value={editingBusiness.website || ""}
                              onChange={handleEditChange}
                              placeholder='https://example.com'
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location Details */}
                <div className='col-12'>
                  <div className='card border'>
                    <div className='card-header bg-light py-3'>
                      <h6 className='mb-0 text-primary'>
                        <i className='fas fa-map-marker-alt me-2'></i>
                        Location Details
                      </h6>
                    </div>
                    <div className='card-body'>
                      <div className='row g-3'>
                        <div className='col-12 col-md-6'>
                          <label className='form-label fw-medium'>
                            Location
                          </label>
                          <input
                            type='text'
                            className='form-control'
                            name='location'
                            value={editingBusiness.location || ""}
                            onChange={handleEditChange}
                          />
                        </div>
                        <div className='col-12 col-md-6'>
                          <label className='form-label fw-medium'>
                            Address
                          </label>
                          <input
                            type='text'
                            className='form-control'
                            name='address'
                            value={editingBusiness.address || ""}
                            onChange={handleEditChange}
                          />
                        </div>
                        <div className='col-12 col-md-6'>
                          <label className='form-label fw-medium'>
                            Plus Code
                          </label>
                          <input
                            type='text'
                            className='form-control'
                            name='plus_code'
                            value={editingBusiness.plus_code || ""}
                            onChange={handleEditChange}
                          />
                        </div>
                        <div className='col-12 col-md-3'>
                          <label className='form-label fw-medium'>
                            Latitude
                          </label>
                          <input
                            type='number'
                            className='form-control'
                            name='latitude'
                            value={editingBusiness.latitude || ""}
                            onChange={handleEditChange}
                            step='any'
                          />
                        </div>
                        <div className='col-12 col-md-3'>
                          <label className='form-label fw-medium'>
                            Longitude
                          </label>
                          <input
                            type='number'
                            className='form-control'
                            name='longitude'
                            value={editingBusiness.longitude || ""}
                            onChange={handleEditChange}
                            step='any'
                          />
                        </div>
                        <div className='col-12 col-md-3'>
                          <label className='form-label fw-medium'>
                            Min Price
                          </label>
                          <div className='input-group'>
                            <span className='input-group-text'>
                              <Image
                                src={"/dirham.png"}
                                alt='dirham'
                                width={30}
                                height={20}
                                className='me-2'
                              />
                            </span>
                            <input
                              type='number'
                              className='form-control'
                              name='minPrice'
                              value={editingBusiness.minPrice || ""}
                              onChange={handleEditChange}
                            />
                          </div>
                        </div>
                        <div className='col-12 col-md-3'>
                          <label className='form-label fw-medium'>
                            Max Price
                          </label>
                          <div className='input-group'>
                            <span className='input-group-text'>
                              {" "}
                              <Image
                                src={"/dirham.png"}
                                alt='dirham'
                                width={30}
                                height={20}
                                className='me-2'
                              />
                            </span>
                            <input
                              type='number'
                              className='form-control'
                              name='maxPrice'
                              value={editingBusiness.maxPrice || ""}
                              onChange={handleEditChange}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Operating Hours */}
                <div className='col-12'>
                  <div className='card border'>
                    <div className='card-header bg-light py-3'>
                      <h6 className='mb-0 text-primary'>
                        <i className='fas fa-clock me-2'></i>
                        Operating Hours
                      </h6>
                    </div>
                    <div className='card-body'>
                      <div className='row g-3'>
                        <div className='col-12'>
                          <label className='form-label fw-medium'>
                            Operating Hours
                          </label>
                          <input
                            type='text'
                            className='form-control'
                            name='closing_hours'
                            value={editingBusiness.closing_hours || ""}
                            onChange={handleEditChange}
                            placeholder='e.g., Mon-Fri: 9AM-5PM'
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reviews & Ratings */}
                <div className='col-12'>
                  <div className='card border'>
                    <div className='card-header bg-light py-3'>
                      <h6 className='mb-0 text-primary'>
                        <i className='fas fa-star me-2'></i>
                        Reviews & Ratings
                      </h6>
                    </div>
                    <div className='card-body'>
                      <div className='row g-3'>
                        <div className='col-md-6'>
                          <label className='form-label fw-medium'>
                            Review Count
                          </label>
                          <input
                            type='number'
                            className='form-control'
                            name='review_count'
                            value={editingBusiness.review_count || ""}
                            onChange={handleEditChange}
                            min='0'
                          />
                        </div>
                        <div className='col-md-6'>
                          <label className='form-label fw-medium'>Rating</label>
                          <input
                            type='number'
                            className='form-control'
                            name='rating'
                            value={editingBusiness.rating || ""}
                            onChange={handleEditChange}
                            min='0'
                            max='5'
                            step='0.1'
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Social Media Links */}
                <div className='col-12'>
                  <div className='card border'>
                    <div className='card-header bg-light py-3'>
                      <h6 className='mb-0 text-primary'>
                        <i className='fas fa-share-alt me-2'></i>
                        Social Media Links
                      </h6>
                    </div>
                    <div className='card-body'>
                      <div className='row g-3'>
                        <div className='col-md-6'>
                          <label className='form-label fw-medium'>
                            Facebook Profile
                          </label>
                          <div className='input-group'>
                            <span className='input-group-text'>
                              <i className='fab fa-facebook'></i>
                            </span>
                            <input
                              type='url'
                              className='form-control'
                              name='facebook_profile'
                              value={editingBusiness.facebook_profile || ""}
                              onChange={handleEditChange}
                              placeholder='https://facebook.com/profile'
                            />
                          </div>
                        </div>
                        <div className='col-md-6'>
                          <label className='form-label fw-medium'>
                            Instagram Profile
                          </label>
                          <div className='input-group'>
                            <span className='input-group-text'>
                              <i className='fab fa-instagram'></i>
                            </span>
                            <input
                              type='url'
                              className='form-control'
                              name='instagram_profile'
                              value={editingBusiness.instagram_profile || ""}
                              onChange={handleEditChange}
                              placeholder='https://instagram.com/profile'
                            />
                          </div>
                        </div>
                        <div className='col-md-6'>
                          <label className='form-label fw-medium'>
                            Twitter Profile
                          </label>
                          <div className='input-group'>
                            <span className='input-group-text'>
                              <i className='fab fa-twitter'></i>
                            </span>
                            <input
                              type='url'
                              className='form-control'
                              name='twitter_profile'
                              value={editingBusiness.twitter_profile || ""}
                              onChange={handleEditChange}
                              placeholder='https://twitter.com/profile'
                            />
                          </div>
                        </div>
                        <div className='col-md-6'>
                          <label className='form-label fw-medium'>
                            LinkedIn Profile
                          </label>
                          <div className='input-group'>
                            <span className='input-group-text'>
                              <i className='fab fa-linkedin'></i>
                            </span>
                            <input
                              type='url'
                              className='form-control'
                              name='linkedin_profile'
                              value={editingBusiness.linkedin_profile || ""}
                              onChange={handleEditChange}
                              placeholder='https://linkedin.com/in/profile'
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Business Image - Keep existing code */}
                <div className='col-12'>
                  <div className='card border'>
                    <div className='card-header bg-light py-3'>
                      <h6 className='mb-0 text-primary'>
                        <i className='fas fa-image me-2'></i>
                        Business Image
                      </h6>
                    </div>
                    <div className='card-body'>
                      <div className='row g-3'>
                        <div className='col-12'>
                          <label className='form-label fw-medium'>
                            Upload Thumbnail
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
                        {editingBusiness.thumbnail && (
                          <div className='col-12'>
                            <div className='position-relative d-inline-block'>
                              <img
                                src={editingBusiness.thumbnail}
                                alt='Business thumbnail'
                                className='img-fluid rounded'
                                style={{
                                  maxHeight: "200px",
                                  objectFit: "contain",
                                }}
                              />
                              <button
                                type='button'
                                className='btn btn-sm btn-danger position-absolute top-0 end-0 m-2'
                                onClick={() =>
                                  setEditingBusiness((prev) => ({
                                    ...prev,
                                    thumbnail: "",
                                  }))
                                }
                              >
                                <i className='fas fa-times'>X</i>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {/* ...existing image upload section... */}
              </div>
              {/* ...existing modal footer... */}
            </div>

            <div
              className='modal-footer'
              style={{
                position: "sticky",
                bottom: 0,
                backgroundColor: "white",
                zIndex: 1030,
              }}
            >
              <div className='w-100 row g-2'>
                <div className='col-6'>
                  <button
                    type='button'
                    className='btn btn-secondary w-100'
                    onClick={() => setEditModalOpen(false)}
                  >
                    <i className='fas fa-times me-2'></i>
                    Cancel
                  </button>
                </div>
                <div className='col-6'>
                  <button
                    type='submit'
                    className='btn btn-primary w-100'
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className='spinner-border spinner-border-sm me-2'></span>
                        Saving...
                      </>
                    ) : (
                      <>
                        <i className='fas fa-save me-2'></i>
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
