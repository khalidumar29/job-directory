import { useEffect, useState } from "react";

import Image from "next/image";

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

  useEffect(() => {
    console.log(
      "Thumbnail received:",
      business.thumbnail?.substring(0, 50) + "..."
    );
    console.log("Image URL set:", imageUrl);
  }, [business.thumbnail, imageUrl]);

  const MapLink =
    business.latitude && business.longitude
      ? `https://www.google.com/maps?q=${business.latitude},${business.longitude}`
      : business.location
      ? `https://www.google.com/maps/search/${encodeURIComponent(
          business.location
        )}`
      : "#";

  return (
    <section className=''>
      <div className='listing-item listing-grid-one mb-45 wow fadeInUp'>
        <div className='listing-thumbnail'>
          <img
            src={imageUrl || business.thumbnail}
            alt={business.name || "Business thumbnail"}
            className='card-img-top'
            style={{
              height: "100%",
              width: "100%",
              objectFit: "cover",
              borderTopLeftRadius: "calc(0.375rem - 1px)",
              borderTopRightRadius: "calc(0.375rem - 1px)",
            }}
          />
          <span className='featured-btn'>{business.status}</span>
          <div className='thumbnail-meta d-flex justify-content-between align-items-center'>
            <div className='meta-icon-title d-flex align-items-center'>
              <div className='icon'>
                <i className='flaticon-chef'></i>
              </div>
              <div className='title'>
                <h6>{business.category}</h6>
              </div>
            </div>
            {/* <span className='status st-open'>Open</span> */}
          </div>
        </div>
        <div className='listing-content'>
          <h3 className='title'>{business.name || "Unnamed Business"}</h3>
          <div className='ratings'>
            <ul className='ratings ratings-three'>
              <li className='star'>
                <i className='flaticon-star-1'></i>
              </li>
              <li className='star'>
                <i className='flaticon-star-1'></i>
              </li>
              <li className='star'>
                <i className='flaticon-star-1'></i>
              </li>
              <li className='star'>
                <i className='flaticon-star-1'></i>
              </li>
              <li className='star'>
                <i className='flaticon-star-1'></i>
              </li>
              <li>
                <span>{business.review_count || 0} reviews</span>
              </li>
            </ul>
          </div>
          <span className='price'>
            ${business.minPrice} - ${business.maxPrice}
          </span>
          <span className='phone-meta'>
            <a
              href={`https://wa.me/${business.mobile_number.replace(/\D/g)}`}
              target='_blank'
              rel='noopener noreferrer'
            >
              <Image
                src='https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg'
                alt='WhatsApp'
                width={24}
                height={24}
                style={{ marginRight: "5px", cursor: "pointer" }}
              />

              {business.mobile_number || "No Contact"}
            </a>
          </span>
          <div className='listing-meta'>
            <ul>
              <li>
                <a href={MapLink} target='_blank' rel='noopener noreferrer'>
                  <span>
                    <i className='ti-location-pin'></i>{" "}
                    {business.address || "No Address"}
                  </span>
                </a>
              </li>
              <li>
                {/* <span>
                      <i className='ti-heart'></i>
                      <a href='#'>Save</a>
                    </span> */}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessCard;
