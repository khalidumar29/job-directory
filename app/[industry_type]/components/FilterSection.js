"use client";
import { DollarSign, MapPinIcon, Search, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

const FilterSection = ({ filters, setFilters, handleReset, handleFilter }) => {
  // Add local state to store form values
  const [formValues, setFormValues] = useState({
    business_name: "",
    location: "",
    minPrice: "",
    maxPrice: "",
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle filter submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setFilters(formValues); // Update parent state with form values
  };

  // Update local state when reset is clicked
  useEffect(() => {
    setFormValues(filters);
  }, [filters]);

  return (
    <div className='container mb-4' style={{ maxWidth: "1400px" }}>
      <form onSubmit={handleSubmit}>
        <div className='bg-white p-4 rounded-lg shadow-sm mb-4'>
          <div className='row g-3'>
            {/* Business Name Filter */}
            <div className='col-12 col-md-3'>
              <div className='form-floating'>
                <input
                  type='text'
                  className='form-control'
                  id='business_name'
                  name='business_name'
                  placeholder='Search business name'
                  value={formValues.business_name}
                  onChange={handleInputChange}
                />
                <label htmlFor='business_name'>
                  <Search size={16} className='me-2' />
                  Business Name
                </label>
              </div>
            </div>

            {/* Location Filter */}
            <div className='col-12 col-md-3'>
              <div className='form-floating'>
                <input
                  type='text'
                  className='form-control'
                  id='location'
                  name='location'
                  placeholder='Location'
                  value={formValues.location}
                  onChange={handleInputChange}
                />
                <label htmlFor='location'>
                  <MapPinIcon size={16} className='me-2' />
                  Location
                </label>
              </div>
            </div>

            {/* Price Range Filters */}
            <div className='col-12 col-md-2'>
              <div className='form-floating'>
                <input
                  type='number'
                  className='form-control'
                  id='minPrice'
                  name='minPrice'
                  placeholder='Min Price'
                  value={formValues.minPrice}
                  onChange={handleInputChange}
                />
                <label htmlFor='minPrice'>
                  <Image
                    src={"/dirham.png"}
                    alt='dirham'
                    width={40}
                    height={30}
                    className='me-2'
                  />
                  Min Price
                </label>
              </div>
            </div>

            <div className='col-12 col-md-2'>
              <div className='form-floating'>
                <input
                  type='number'
                  className='form-control'
                  id='maxPrice'
                  name='maxPrice'
                  placeholder='Max Price'
                  value={formValues.maxPrice}
                  onChange={handleInputChange}
                />
                <label htmlFor='maxPrice'>
                  <Image
                    src={"/dirham.png"}
                    alt='dirham'
                    width={40}
                    height={30}
                    className='me-2'
                  />
                  Max Price
                </label>
              </div>
            </div>

            {/* Filter and Reset Buttons */}
            <div className='col-12 col-md-2 d-flex align-items-center gap-2'>
              <button
                type='submit'
                className='btn btn-primary flex-grow-1'
                style={{ height: "58px" }}
              >
                <Search size={16} className='me-2' />
                Filter
              </button>
              <button
                type='button'
                onClick={handleReset}
                className='btn btn-outline-secondary'
                style={{ height: "58px", width: "58px" }}
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default FilterSection;
