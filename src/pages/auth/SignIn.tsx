import React, { useState, useEffect, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "@/components/LoadingSpinner";
import axios from "axios";

interface SignInResponse {
  status: string;
  message: string;
  statusCode: number;
  data: {
    accessToken: string;
    refreshToken: string;
  };
}

// Simple Carousel Component for Auto-Scrolling Images (Left Side Only)
const ImageCarousel: React.FC<{ images: string[] }> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000); // Auto-scroll every 3 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="hidden lg:block lg:w-3/5 h-screen relative overflow-hidden order-1">
      <div className="absolute inset-0">
        {images.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`Premium property ${idx + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              idx === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
      </div>
      {/* Dark overlay at bottom, like your screenshot */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent" />
      {/* Pagination dots at bottom */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, idx) => (
          <div
            key={idx}
            className={`w-2 h-2 rounded-full transition-colors ${
              idx === currentIndex ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

const SignIn: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // 4 Premium property images from Unsplash (matching your screenshot's modern house vibe)
  const propertyImages = [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80", // Modern luxury home
    "https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80", // Villa with pool
    "https://images.unsplash.com/photo-1600566752355-35792bedcfea?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80", // Contemporary house at dusk
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80", // Mansion exterior
  ];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in both email and password.");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const response = await axios.post<SignInResponse>(
        " http://localhost:3001/api/admin/login",
        { email, password }
      );
      localStorage.setItem("accessToken", response.data.data.accessToken);
      localStorage.setItem("refreshToken", response.data.data.refreshToken);
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Sign in failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-gradient-to-br from-gray-100 to-gray-200 p-4">
      {/* Left: Auto-scrolling Image Carousel (hidden on mobile) */}
      <ImageCarousel images={propertyImages} />
      
      {/* Right: Login Form - Full Height Coverage */}
      <div className="lg:w-2/5 h-full lg:h-screen flex flex-col items-center justify-center order-2 lg:order-2 p-4 lg:p-0">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg flex flex-col justify-between h-[80vh] lg:h-full p-6 lg:p-8 mx-auto">
          {/* Top Content: Logo and Title */}
          <div className="flex flex-col items-center mb-6 lg:mb-8">
            <img src="/proplex.png" alt="Proplex Logo" className="h-16 w-auto mb-4" />
            <h1 className="text-3xl font-semibold text-center text-gray-800">
              Sign In
            </h1>
          </div>

          {/* Form Content - Centered in Remaining Space */}
          <div className="flex-1 flex flex-col justify-center">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div>
                <label htmlFor="email" className="text-sm text-gray-600 block mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                  autoComplete="email"
                />
              </div>

              <div>
                <label htmlFor="password" className="text-sm text-gray-600 block mb-1">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                  autoComplete="current-password"
                />
              </div>

              {error && (
                <p className="text-sm text-red-600 text-center">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 text-white p-3 rounded-lg font-medium hover:bg-blue-700 flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
                disabled={isLoading}
              >
                {isLoading && <LoadingSpinner size="h-4 w-4" color="text-white" />}
                {isLoading ? "Signing In..." : "Sign In"}
              </button>
            </form>
          </div>

          {/* Bottom Spacer for Full Height Feel */}
          <div className="flex-1" />
        </div>
      </div>
    </div>
  );
};

export default SignIn;