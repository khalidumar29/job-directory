"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import CreateBusiness from "./components/CreateBusiness";
import BusinessList from "./components/BusinessList";

const AdminDashboard = () => {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const isAuth = sessionStorage.getItem("isAdminLoggedIn");
    if (!isAuth) {
      router.push("/admin/login");
    }
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem("isAdminLoggedIn");
    router.push("/admin/login");
    toast.success("Logged out successfully");
  };

  return (
    <div style={{ marginTop: "60px" }} className='container-fluid py-5 '>
      {/* Header with modern design */}
      <div className='d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4'>
        <h1
          className='text-primary font-weight-bold mb-3 mb-md-0'
          style={{
            fontSize: "2.2rem",
            letterSpacing: "0.5px",
            textTransform: "uppercase",
          }}
        >
          Admin Dashboard
        </h1>
        <button
          className='btn btn-outline-danger rounded-pill px-4 py-2 align-self-start align-self-md-auto mt-3 mt-md-0'
          onClick={handleLogout}
          style={{
            borderWidth: "2px",
            fontSize: "1rem",
            fontWeight: "500",
          }}
        >
          Logout
        </button>
      </div>
      {/* Business Management section */}
      <div className='container-fluid py-4 px-0'>
        <h2
          className='mb-4 text-secondary font-weight-bold'
          style={{
            fontSize: "1.75rem",
            letterSpacing: "0.3px",
            textTransform: "capitalize",
          }}
        >
          Business Management
        </h2>
        <div className='row'>
          <div className='col-12'>
            <BusinessList />
          </div>
        </div>
      </div>
      {/* Create Business section */}
      <div className='row mb-4'>
        <div className='col-12 text-center'>
          <button
            className='btn btn-primary px-4 py-2'
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Hide Create Business" : "Create New Business"}
          </button>
        </div>
      </div>
      {showForm && (
        <div className='row'>
          <div className='col-12 col-lg-6 mx-auto'>
            <div className='card shadow-lg border-0 p-4'>
              <CreateBusiness />
            </div>
          </div>
        </div>
      )}

      {/* Optional: Mobile quick action button */}
      <div
        className='d-block d-md-none position-fixed'
        style={{ bottom: "20px", right: "20px", zIndex: 1000 }}
      >
        <button
          className='btn btn-primary rounded-circle shadow-lg'
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            fontSize: "1.5rem",
          }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          ↑
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
