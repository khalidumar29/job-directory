import React from "react";

const IndustriesList = ({ industries, loading, handleEdit, handleDelete }) => {
  return (
    <div className='card'>
      <div className='card-header'>Industries List</div>
      <div className='card-body'>
        {loading ? (
          <p>Loading industries...</p>
        ) : industries.length === 0 ? (
          <p>No industries found. Add one to get started.</p>
        ) : (
          <div className='table-responsive'>
            <table className='table table-striped table-hover'>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Industry Type</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {industries.map((industry, i) => (
                  <tr key={industry.id}>
                    <td>{i + 1}</td>
                    <td>{industry.name}</td>
                    <td>{industry.industry_type}</td>
                    <td>
                      <div className='d-flex gap-2'>
                        <button
                          className='btn btn-sm btn-outline-primary'
                          onClick={() => handleEdit(industry)}
                        >
                          Edit
                        </button>
                        <button
                          className='btn btn-sm btn-outline-danger'
                          onClick={() => handleDelete(industry.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default IndustriesList;
