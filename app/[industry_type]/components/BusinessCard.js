import { useEffect, useState } from "react";
import {
  Phone,
  MapPin,
  Star,
  Clock,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Mail,
  ExternalLink,
} from "lucide-react";

const BusinessCard = ({ business }) => {
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (business.thumbnail) {
      try {
        // Convert base64 to Blob
        const binaryString = window.atob(business.thumbnail);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: "image/jpeg" });
        const url = URL.createObjectURL(blob);
        setImageUrl(url);

        // Cleanup
        return () => URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Error converting base64 to Blob:", error);
      }
    }
  }, [business.thumbnail]);

  const MapLink =
    business.latitude && business.longitude
      ? `https://www.google.com/maps?q=${business.latitude},${business.longitude}`
      : business.location
      ? `https://www.google.com/maps/search/${encodeURIComponent(
          business.location
        )}`
      : "#";

  return (
    <div className='card h-100 shadow-sm border-0 hover-shadow transition'>
      {/* Thumbnail Image */}
      {imageUrl && (
        <div className='card-img-container' style={{ height: "200px" }}>
          <img
            src={imageUrl}
            alt={business.name || "Business thumbnail"}
            className='card-img-top'
            style={{
              height: "100%",
              width: "100%",
              objectFit: "cover",
              borderTopLeftRadius: "calc(0.375rem - 1px)",
              borderTopRightRadius: "calc(0.375rem - 1px)",
            }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = "none";
              e.target.parentElement.style.display = "none";
            }}
          />
        </div>
      )}

      <div className='card-body d-flex flex-column p-3'>
        {/* Header Section */}
        <div className='d-flex justify-content-between align-items-start mb-3'>
          <div>
            <h5 className='card-title h5 fw-bold text-primary mb-1'>
              {business.name || "Unnamed Business"}
            </h5>
            <div className='d-flex align-items-center gap-2 mb-2'>
              <span className='badge bg-light text-dark rounded-pill'>
                {business.category || business.industry_type || "No Category"}
              </span>
            </div>
          </div>
          {business.rating && (
            <div className='rating-badge bg-warning-soft rounded-3 p-2 text-warning'>
              <div className='d-flex align-items-center'>
                <Star className='me-1' size={16} />
                <span className='fw-bold'>{business.rating}</span>
              </div>
              <div className='text-center small mt-1'>
                <small>{business.review_count || 0} reviews</small>
              </div>
            </div>
          )}
        </div>

        {/* Business Details */}
        <div className='flex-grow-1 mb-3'>
          <div className='info-grid'>
            {/* Contact Info */}
            <div className='info-item d-flex align-items-center mb-2'>
              <Phone className='text-primary' size={16} />
              <span className='ms-2'>
                {business.mobile_number || "No Contact"}
              </span>
            </div>

            {/* Location */}
            <div
              className='d-flex align-items-start mb-2'
              style={{ height: "60px" }}
            >
              <MapPin
                className='text-danger'
                size={20}
                style={{ flexShrink: 0 }}
              />
              <a
                href={MapLink}
                target='_blank'
                rel='noopener noreferrer'
                className='text-decoration-none text-dark ms-2'
                style={{ wordBreak: "break-word", flexGrow: 1 }}
              >
                {business.address || "No Address"}
              </a>
            </div>
          </div>
        </div>

        {/* Closing Hours */}
        {business.closing_hours && (
          <div className='closing-hours-container mb-3'>
            <div className='d-flex align-items-start'>
              <Clock className='text-info flex-shrink-0' size={16} />
              <div className='ms-2 closing-hours-scroll'>
                <span>Closes: {business.closing_hours}</span>
              </div>
            </div>
          </div>
        )}

        {/* Contact and Social Links */}
        <div className='border-top pt-3'>
          {/* Primary Actions */}
          <div className='d-flex gap-2 mb-2'>
            {business.website && (
              <a
                href={business.website}
                target='_blank'
                rel='noopener noreferrer'
                className='btn btn-primary btn-sm flex-grow-1'
              >
                <ExternalLink size={14} className='me-1' />
                Visit Website
              </a>
            )}
            {business.email_id && (
              <a
                href={`mailto:${business.email_id}`}
                className='btn btn-outline-secondary btn-sm flex-grow-1'
              >
                <Mail size={14} className='me-1' />
                Contact
              </a>
            )}
          </div>

          {/* Social Media */}
          <div className='d-flex justify-content-center gap-2'>
            {business.facebook_profile && (
              <a
                href={business.facebook_profile}
                target='_blank'
                rel='noopener noreferrer'
                className='social-link'
              >
                <Facebook size={16} />
              </a>
            )}
            {business.instagram_profile && (
              <a
                href={business.instagram_profile}
                target='_blank'
                rel='noopener noreferrer'
                className='social-link'
              >
                <Instagram size={16} />
              </a>
            )}
            {business.twitter_profile && (
              <a
                href={business.twitter_profile}
                target='_blank'
                rel='noopener noreferrer'
                className='social-link'
              >
                <Twitter size={16} />
              </a>
            )}
            {business.linkedin_profile && (
              <a
                href={business.linkedin_profile}
                target='_blank'
                rel='noopener noreferrer'
                className='social-link'
              >
                <Linkedin size={16} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessCard;
