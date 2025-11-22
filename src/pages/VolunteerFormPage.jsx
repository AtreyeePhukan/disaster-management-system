import React, { useState, useEffect } from 'react';
import { Mail, MapPin, Link2, User } from 'lucide-react';

export default function VolunteerFormPage() {

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    currentLocation: '',
    primarySkill: '',
    selectedSkills: [],
    availability: '',
    yearsOfExperience: '',
    weekends: false,
    nights: false,
    briefExperience: false,
    healthLimitations: false,
    emergencyContactName: '',
    emergencyContactRelationship: '',
    latitude: "",
    longitude: ""
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setFormData((prev) => ({
            ...prev,
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          }));
        },
        (err) => {
          console.error("Location error:", err);
        },
        { enableHighAccuracy: true }
      );
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSkillToggle = (skill) => {
    setFormData((prev) => ({
      ...prev,
      selectedSkills: prev.selectedSkills.includes(skill)
        ? prev.selectedSkills.filter((s) => s !== skill)
        : [...prev.selectedSkills, skill],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        lat: formData.latitude,   
        lng: formData.longitude, 
      };

      console.log("Submitting volunteer data:", payload);

      const response = await fetch(`${API_BASE}/volunteer`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload),
});


      const data = await response.json();

      if (response.ok) {
        alert(`Volunteer registered! ID: ${data.volunteerId}`);
        setFormData({
          fullName: "",
          email: "",
          phoneNumber: "",
          currentLocation: "",
          primarySkill: "",
          selectedSkills: [],
          availability: "",
          yearsOfExperience: "",
          weekends: false,
          nights: false,
          briefExperience: false,
          healthLimitations: false,
          emergencyContactName: "",
          emergencyContactRelationship: "",
          latitude: "",
          longitude: ""
        });
      } else {
        alert(`Error: ${data.error || "Something went wrong"}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Something went wrong submitting the volunteer form.");
    }
  };



  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-4xl bg-gray-900 rounded-lg border border-gray-800 p-8 relative">
        {/* Corner decorations */}
        <div className="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-red-600"></div>
        <div className="absolute top-4 right-4 w-6 h-6 border-r-2 border-t-2 border-red-600"></div>
        <div className="absolute bottom-4 left-4 w-6 h-6 border-l-2 border-b-2 border-red-600"></div>
        <div className="absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-red-600"></div>

        {/* Floating dots decoration */}
        <div className="absolute top-12 left-8 w-2 h-2 bg-red-600 rounded-full opacity-50"></div>
        <div className="absolute top-16 left-12 w-1.5 h-1.5 bg-red-600 rounded-full opacity-30"></div>

        <h1 className="text-3xl font-bold text-white text-center mb-8">Volunteer Registration</h1>
        
        <div className="w-full h-px bg-gradient-to-r from-transparent via-red-600 to-transparent mb-8"></div>

        <div className="grid grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Personal Information */}
            <div>
              <h2 className="text-white font-semibold mb-4">Personal Information</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-red-600" />
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="flex-1 bg-white text-black px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>
                <div className="pl-8">
                  <label className="text-gray-400 text-sm">Full Name</label>
                </div>
              </div>
            </div>

            {/* Skills and Qualifications */}
            <div>
              <h2 className="text-white font-semibold mb-4">Skills and Qualifications</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-red-600" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="flex-1 bg-white text-black px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>
                
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-red-600" />
                  <input
                    type="tel"
                    name="phoneNumber"
                    placeholder="Phone Number"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="flex-1 bg-white text-black px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>
              </div>
            </div>

            {/* Availability */}
            <div>
              <h2 className="text-white font-semibold mb-4">Availability</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Link2 className="w-5 h-5 text-red-600" />
                  <select
                    name="availability"
                    value={formData.availability}
                    onChange={handleInputChange}
                    className="flex-1 bg-white text-black px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
                  >
                    <option value="">Select Availability</option>
                    <option value="full-time">Full Time</option>
                    <option value="part-time">Part Time</option>
                    <option value="flexible">Flexible</option>
                  </select>
                </div>

                <select
                  name="yearsOfExperience"
                  value={formData.yearsOfExperience}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 text-gray-400 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
                >
                  <option value="">Years of Experience</option>
                  <option value="0-1">0-1 years</option>
                  <option value="1-3">1-3 years</option>
                  <option value="3-5">3-5 years</option>
                  <option value="5+">5+ years</option>
                </select>
              </div>
            </div>

            {/* Emergency Contact */}
            <div>
              <h2 className="text-white font-semibold mb-4">Emergency Contact</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Link2 className="w-5 h-5 text-red-600" />
                  <input
                    type="text"
                    name="emergencyContactName"
                    placeholder="Full Name"
                    value={formData.emergencyContactName}
                    onChange={handleInputChange}
                    className="flex-1 bg-white text-black px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>
                <div className="pl-8">
                  <label className="text-gray-400 text-sm">Available for Emergency Deployment</label>
                </div>

                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-red-600" />
                  <input
                    type="text"
                    name="emergencyContactRelationship"
                    placeholder="Relationship"
                    value={formData.emergencyContactRelationship}
                    onChange={handleInputChange}
                    className="flex-1 bg-white text-black px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Primary Skill */}
            <div>
              <h2 className="text-white font-semibold mb-4">Primary Skill</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  name="primarySkill"
                  placeholder="Primary Skill"
                  value={formData.primarySkill}
                  onChange={handleInputChange}
                  className="w-full bg-white text-black px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
                />
                <input
                  type="text"
                  placeholder="Response Time Availability"
                  className="w-full bg-transparent border border-red-600 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
                />

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleSkillToggle('Medical')}
                    className={`px-4 py-2 rounded transition-colors ${
                      formData.selectedSkills.includes('Medical')
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    Medical
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSkillToggle('Search & Rescue')}
                    className={`px-4 py-2 rounded transition-colors ${
                      formData.selectedSkills.includes('Search & Rescue')
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    Search & Rescue
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSkillToggle('Logistics')}
                    className={`px-4 py-2 rounded transition-colors ${
                      formData.selectedSkills.includes('Logistics')
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    Logistics
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSkillToggle('Communication')}
                    className={`px-4 py-2 rounded transition-colors ${
                      formData.selectedSkills.includes('Communication')
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    Communication
                  </button>
                </div>
              </div>
            </div>

            {/* Availability Toggles */}
            <div>
              <h2 className="text-white font-semibold mb-4">Availability</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between bg-gray-800 px-4 py-3 rounded">
                  <span className="text-gray-300 text-sm">Weekends</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="weekends"
                      checked={formData.weekends}
                      onChange={handleInputChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between bg-gray-800 px-4 py-3 rounded">
                  <span className="text-gray-300 text-sm">Nights</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="nights"
                      checked={formData.nights}
                      onChange={handleInputChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between bg-gray-800 px-4 py-3 rounded mt-6">
                  <span className="text-gray-300 text-sm">Brief Experience & Health</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="briefExperience"
                      checked={formData.briefExperience}
                      onChange={handleInputChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between bg-gray-800 px-4 py-3 rounded">
                  <span className="text-gray-300 text-sm">Health Limitations</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="healthLimitations"
                      checked={formData.healthLimitations}
                      onChange={handleInputChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-8 flex flex-col items-center space-y-4">
          <button
            type="button"
            onClick={handleSubmit}
            className="bg-gradient-to-r from-red-700 to-red-800 hover:from-red-700 hover:to-red-800 text-white font-semibold px-16 py-3 rounded-full transition-all transform hover:scale-105 "
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}