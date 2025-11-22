import React, { useState, useEffect } from "react";
import { Bell, UserCircle, ChevronDown, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const [dateTime, setDateTime] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="flex items-center justify-between bg-black text-white px-6 py-4">
      {/* Left: Logo + App Name */}
      <div className="flex items-center space-x-3">
    <img
      src="/favicon.png"
      alt="Sahayata Logo"
      className="w-8 h-8 rounded-lg object-cover"
    />
    <span className="text-lg font-semibold">SAHAYATAA</span>
  </div>

      {/* help button */}
      <div className="flex items-center space-x-6">
        <div 
            className="flex items-center space-x-2 text-sm text-gray-300 cursor-pointer hover:text-white"
            onClick={() => navigate("/help")}
            >
          <span>Ask for help</span>
          <ChevronDown className="w-4 h-4" />
        </div>

        {/* Volunteer Button */}
        <div
          className="flex items-center space-x-2 text-sm text-gray-300 cursor-pointer hover:text-white"
          onClick={() => navigate("/volunteer")}
        >
          <span>⚡</span>
          <span>Help As Volunteer</span>
          <ChevronDown className="w-4 h-4" />
        </div>

        <div 
            className="flex items-center space-x-2 text-sm text-gray-300 cursor-pointer hover:text-white"
            onClick={() => navigate("/donation")}
        >
          <span>Donate</span>
          <ChevronDown className="w-4 h-4" />
        </div>

        <div className="text-sm font-medium text-white ml-4">
          {dateTime.toLocaleDateString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })}{" "}
          {dateTime.toLocaleTimeString("en-US", {
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}
        </div>
      </div>

      {/* Right: Global Alerts + User Profile */}
      <div className="flex items-center space-x-4">
      

        <div className="flex items-center space-x-2 cursor-pointer hover:text-gray-300 transition-colors">
          <span className="text-sm">User Profile</span>
          <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center overflow-hidden">
            <UserCircle className="w-6 h-6 text-gray-300" />
          </div>
        </div>
      </div>
    </header>
  );
}
