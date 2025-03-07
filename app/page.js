"use client";
import { useRouter } from "next/navigation";
import {
  Building2,
  ShoppingBag,
  Utensils,
  Hotel,
  Car,
  Camera,
  Briefcase,
} from "lucide-react";

const categories = [
  {
    id: "brand-shop",
    name: "Brand Shops",
    icon: ShoppingBag,
    color: "#2563eb",
    description: "Luxury brands and retail stores",
  },
  {
    id: "restaurant",
    name: "Restaurants",
    icon: Utensils,
    color: "#dc2626",
    description: "Fine dining and casual restaurants",
  },
  {
    id: "hotel",
    name: "Hotels",
    icon: Hotel,
    color: "#059669",
    description: "Luxury and boutique hotels",
  },
  {
    id: "car-showroom",
    name: "Car Showrooms",
    icon: Car,
    color: "#7c3aed",
    description: "Luxury and sports car dealers",
  },
  {
    id: "tourist-spot",
    name: "Tourist Spots",
    icon: Camera,
    color: "#db2777",
    description: "Popular attractions and landmarks",
  },
  {
    id: "business",
    name: "Businesses",
    icon: Briefcase,
    color: "#ea580c",
    description: "Corporate and commercial services",
  },
];

const Page = () => {
  const router = useRouter();

  return (
    <div
      style={{
        backgroundColor: "#f8fafc",
        minHeight: "100vh",
        paddingTop: "80px",
      }}
    >
      {/* Hero Section */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <h1
            style={{
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              color: "#1e293b",
              marginBottom: "1rem",
            }}
          >
            Discover Dubai&apos;s Finest
          </h1>
          <p
            style={{
              fontSize: "clamp(1rem, 2vw, 1.2rem)",
              color: "#64748b",
              maxWidth: "800px",
              margin: "0 auto",
            }}
          >
            Your gateway to luxury, entertainment, and world-class services
          </p>
        </div>

        {/* Categories Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "2rem",
            padding: "0 1rem",
          }}
        >
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => router.push(`/${category.id}`)}
              style={{
                backgroundColor: "white",
                borderRadius: "1rem",
                padding: "2rem",
                cursor: "pointer",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                transition: "transform 0.2s, box-shadow 0.2s",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                gap: "1rem",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 10px 15px rgba(0,0,0,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
              }}
            >
              <div style={{ color: category.color }}>
                <category.icon size={40} />
              </div>
              <h2
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "600",
                  color: "#1e293b",
                  margin: "0",
                }}
              >
                {category.name}
              </h2>
              <p
                style={{
                  fontSize: "1rem",
                  color: "#64748b",
                  margin: "0",
                }}
              >
                {category.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
