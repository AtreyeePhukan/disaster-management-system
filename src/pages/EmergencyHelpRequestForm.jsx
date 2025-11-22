import React, { useState, useEffect } from 'react';
import { MapPin, AlertTriangle, Camera, Flame, Droplet, Info, Users, Video } from 'lucide-react';

export default function EmergencyHelpRequestForm() {

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  const [formData, setFormData] = useState({
    priorityLevel: 'urgent',
    dangerType: 'immediate',
    peopleAffected: false,
    locationAddress: '',
    nearbyLandmark: '',
    landmarkDescription: '',
    floor: '',
    situationDescription: '',
    specificNeeds: {
      medical: false,
      water: false,
      food: false,
      shelter: false,
      rescue: false,
      evacuation: false,
    },
    medicalEmergency: false,
    injuries: false,
    roofing: false,
    structuralDamage: false,
    fire: false,
    blankets: false,
    foodSupplies: false,
    waterBottles: false,
    name: '',
    phone: '',
    alternativeContact: '',
    bestTimeToContact: 'anytime',
    specialNeeds: '',
    latitude: null,
    longitude: null,
    numberOfPeople: 0,
    photoUrl: "",
    videoUrl: "",
  });

  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState(null);
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState(null);

  // AUTO GET LOCATION ---------------------------------------------------------
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }));
        },
        () => alert("⚠️ Please enable location to submit a help request."),
        { enableHighAccuracy: true }
      );
    }
  }, []);

  // INPUT HANDLERS ------------------------------------------------------------
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "numberOfPeople") {
      return setFormData(prev => ({
        ...prev,
        numberOfPeople: value === "" ? 0 : Number(value),
      }));
    }

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSpecificNeedToggle = (need) => {
    setFormData(prev => ({
      ...prev,
      specificNeeds: {
        ...prev.specificNeeds,
        [need]: !prev.specificNeeds[need],
      },
    }));
  };

  // FILE UPLOADER -------------------------------------------------------------
  const handleUploadFile = async (event, type) => {
    try {
      const file = event.target.files[0];
      if (!file) return;

      const res = await fetch(`${API_BASE}/getUploadUrl`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName: file.name, fileType: file.type }),
      });

      const data = await res.json();

      await fetch(data.uploadUrl, {
        method: "PUT",
        body: file,
      });

      if (type === "photo") {
        setUploadedPhotoUrl(data.fileUrl);
        setFormData(prev => ({ ...prev, photoUrl: data.fileUrl }));
      } else {
        setUploadedVideoUrl(data.fileUrl);
        setFormData(prev => ({ ...prev, videoUrl: data.fileUrl }));
      }

      alert(`${type.toUpperCase()} uploaded successfully!`);
    } catch (err) {
      alert("Upload failed.");
    }
  };

  // SUBMIT --------------------------------------------------------------------
  const handleSubmit = async () => {
    try {
      const {
  latitude,
  longitude,
  ...rest
} = formData;

const payload = {
  ...rest,
  lat: latitude ? String(latitude) : "0",
  lng: longitude ? String(longitude) : "0",
};

      const response = await fetch(
        "https://545ntpsjvb.execute-api.eu-north-1.amazonaws.com/dev/submitHelpRequest",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (response.ok) {
        alert("Request Submitted! ID: " + result.requestId);
      } else {
        alert("Submit Failed: " + result.details);
      }
    } catch (err) {
      alert("Network / Server Error: " + err.message);
    }
  };

  
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <input
  type="file"
  accept="image/*"
  className="hidden"
  id="hiddenPhotoInput"
  onChange={(e) => handleUploadFile(e, "photo")}
/>

<input
  type="file"
  accept="video/*"
  className="hidden"
  id="hiddenVideoInput"
  onChange={(e) => handleUploadFile(e, "video")}
/>

      <div className="w-full max-w-3xl bg-gray-900 rounded-lg border border-gray-800 p-8 relative">
        {/* Corner decorations */}
        <div className="absolute top-4 left-4 w-4 h-4 border-l-2 border-t-2 border-red-600"></div>
        <div className="absolute top-4 right-4 w-4 h-4 border-r-2 border-t-2 border-red-600"></div>
        <div className="absolute bottom-4 left-4 w-4 h-4 border-l-2 border-b-2 border-red-600"></div>
        <div className="absolute bottom-4 right-4 w-4 h-4 border-r-2 border-b-2 border-red-600"></div>

        {/* Header with Priority Badge */}
        <div className="flex items-start justify-between mb-6">
          <h1 className="text-3xl font-bold text-white">Emergency Help Request</h1>
          <div className="relative flex flex-col items-center">
            {/* Outer circle with double border effect */}
            <div className="relative w-28 h-28">
              <div className="absolute inset-0 rounded-full border-2 border-red-600"></div>
              <div className="absolute inset-2 rounded-full border-2 border-red-600"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-[10px] text-gray-400 font-semibold tracking-wide">PRIORITY LEVEL</div>
                  <div className="text-xl font-bold text-white mt-1">{formData.priorityLevel.toUpperCase()}</div>
                </div>
              </div>
            </div>            
          </div>
        </div>
        <div className="w-full h-px bg-gradient-to-r from-transparent via-red-600 to-transparent mb-6"></div>

        {/* Emergency Priority Level */}
        <div className="mb-6">
          <h2 className="text-white font-semibold mb-4">Emergency Priority Level</h2>
          <div className="flex space-x-3 mb-4">
            {['critical', 'urgent', 'important'].map((level) => (
              <button
                key={level}
                onClick={() => setFormData(prev => ({ ...prev, priorityLevel: level }))}
                className={`px-6 py-2 rounded-full font-semibold transition-all ${
                  formData.priorityLevel === level
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {level.toUpperCase()}
              </button>
            ))}
            <button className="px-4 py-2 rounded-full bg-gray-800 text-gray-400 text-sm">RESPONSE TIME</button>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
            <span>Immediate Danger</span>
            <span>Stable But Needs Help</span>
            <span>Monitoring Situation</span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-gray-800 px-4 py-2 rounded">
              <input
                type="radio"
                name="dangerType"
                value="immediate"
                checked={formData.dangerType === 'immediate'}
                onChange={handleInputChange}
                className="text-red-600"
              />
              <span className="text-gray-300 text-sm">Immediate / People Affected</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="peopleAffected"
                checked={formData.peopleAffected}
                onChange={handleInputChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>
        </div>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent mb-6"></div>

        {/* Location & Situation */}
        <div className="mb-6">
          <h2 className="text-white font-semibold mb-4">Location & Situation</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-5 h-5 text-red-600" />
              <input
                type="text"
                name="locationAddress"
                placeholder="123 Oak St, Springfield"
                value={formData.locationAddress}
                onChange={handleInputChange}
                className="w-full bg-gray-800 text-white pl-10 pr-4 py-2 rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
              />
            </div>

            <input
              type="text"
              name="nearbyLandmark"
              placeholder="123 Oak St, Springfield"
              value={formData.nearbyLandmark}
              onChange={handleInputChange}
              className="bg-gray-800 text-white px-4 py-2 rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
            />

            <input
              type="text"
              name="landmarkDescription"
              placeholder="Landmark Description"
              value={formData.landmarkDescription}
              onChange={handleInputChange}
              className="w-full bg-gray-800 text-white pl-10 pr-4 py-2 rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
            />

            <input
              type="text"
              name="floor"
              placeholder="Near old clock tower"
              value={formData.floor}
              onChange={handleInputChange}
              className="bg-gray-800 text-white px-4 py-2 rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
            />
          </div>
        </div>

        {/* Situation Description */}
        <div className="mb-6">
          <h2 className="text-white font-semibold mb-4">Situation Description</h2>
          <div className="relative">
            <AlertTriangle className="absolute left-3 top-3 w-5 h-5 text-red-600" />
            <textarea
              name="situationDescription"
              placeholder="House collapsed due flood, water rising, trapped upstairs with family."
              value={formData.situationDescription}
              onChange={handleInputChange}
              rows="3"
              className="w-full bg-gray-800 text-white pl-10 pr-4 py-2 rounded border border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
            ></textarea>
          </div>

          <div className="flex space-x-2 mt-3">
            <button className="p-2 bg-gray-800 rounded hover:bg-gray-700">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </button>
            <button className="p-2 bg-gray-800 rounded hover:bg-gray-700">
              <Flame className="w-5 h-5 text-orange-600" />
            </button>
            <button className="p-2 bg-gray-800 rounded hover:bg-gray-700">
              <Droplet className="w-5 h-5 text-blue-600" />
            </button>
            <button className="p-2 bg-gray-800 rounded hover:bg-gray-700">
              <Info className="w-5 h-5 text-gray-400" />
            </button>
            <button className="p-2 bg-gray-800 rounded hover:bg-gray-700">
              <Users className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Specific Needs */}
        <div className="mb-6">
          <h2 className="text-white font-semibold mb-4">Specific Needs</h2>
          <div className="grid grid-cols-3 gap-2 mb-3">
            {Object.keys(formData.specificNeeds).map((need) => (
              <button
                key={need}
                onClick={() => handleSpecificNeedToggle(need)}
                className={`px-4 py-2 rounded-full text-sm transition-all ${
                  formData.specificNeeds[need]
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {need.charAt(0).toUpperCase() + need.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2 bg-red-900 bg-opacity-30 border border-red-600 px-4 py-2 rounded">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span className="text-red-400 text-sm">Medical Emergency</span>
          </div>
        </div>

        {/* Additional Specific Needs */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <div className="flex items-center space-x-2 mb-3 bg-red-900 bg-opacity-20 px-3 py-2 rounded">
              <input
                type="checkbox"
                name="injuries"
                checked={formData.injuries}
                onChange={handleInputChange}
                className="rounded"
              />
              <span className="text-red-400 text-sm">Medical: Injuries, others</span>
            </div>

            <h3 className="text-white font-semibold mb-3">Additional Information</h3>
            <input
              type="text"
              name="name"
              placeholder="Jane Doe"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full bg-gray-800 text-white px-4 py-2 rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent mb-3"
            />

            <input
              type="tel"
              name="phone"
              placeholder="+91 12345 67890"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full bg-gray-800 text-white px-4 py-2 rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent mb-3"
            />

            <input
              type="tel"
              name="alternativeContact"
              placeholder="Alternative Contact"
              value={formData.alternativeContact}
              onChange={handleInputChange}
              className="w-full bg-gray-800 text-white px-4 py-2 rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent mb-3"
            />

            <select
              name="bestTimeToContact"
              value={formData.bestTimeToContact}
              onChange={handleInputChange}
              className="w-full bg-gray-800 text-white px-4 py-2 rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent mb-3"
            >
              <option value="morning">Morning (6AM - 12PM)</option>
              <option value="afternoon">Afternoon (12PM - 6PM)</option>
              <option value="evening">Evening (6PM - 12AM)</option>
              <option value="anytime">Anytime</option>
            </select>

            <div className="text-sm text-gray-400 mb-2">Number of People Affected</div>
                <input
  type="number"
  name="numberOfPeople"
  className="w-full bg-gray-800 text-white px-4 py-2 rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
  placeholder="Enter number"
  value={formData.numberOfPeople}
  onChange={(e) => setFormData(prev => ({
      ...prev,
      numberOfPeople: e.target.value === "" ? 0 : Number(e.target.value)
  }))}
/>

            <button
  className="w-full mt-3 flex items-center justify-center space-x-2 bg-gray-800 text-white px-4 py-2 rounded border border-red-600 hover:bg-gray-700"
  onClick={() => document.getElementById("hiddenPhotoInput").click()}
>
  <Camera className="w-5 h-5 text-red-600" />
  <span>Upload Photo</span>
</button>

          </div>

          <div>
            <h3 className="text-white font-semibold mb-3">Specific Needs</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-gray-800 px-4 py-2 rounded">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="roofing"
                    checked={formData.roofing}
                    onChange={handleInputChange}
                    className="rounded"
                  />
                  <span className="text-gray-300 text-sm">Roofing</span>
                </label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="roofing"
                    checked={formData.roofing}
                    onChange={handleInputChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between bg-gray-800 px-4 py-2 rounded">
                <span className="text-gray-300 text-sm">Structural Damage</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="structuralDamage"
                    checked={formData.structuralDamage}
                    onChange={handleInputChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between bg-gray-800 px-4 py-2 rounded">
                <span className="text-gray-300 text-sm">Fire</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="fire"
                    checked={formData.fire}
                    onChange={handleInputChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between bg-gray-800 px-4 py-2 rounded">
                <span className="text-gray-300 text-sm">Blankets</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="blankets"
                    checked={formData.blankets}
                    onChange={handleInputChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between bg-gray-800 px-4 py-2 rounded">
                <span className="text-gray-300 text-sm">Food Supplies</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="foodSupplies"
                    checked={formData.foodSupplies}
                    onChange={handleInputChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between bg-gray-800 px-4 py-2 rounded">
                <span className="text-gray-300 text-sm">Water Bottles</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="waterBottles"
                    checked={formData.waterBottles}
                    onChange={handleInputChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                </label>
              </div>
            </div>

            <div className="mt-3 text-xs text-gray-400">
              Special Needs (Elderly, Children, Disabilities)
            </div>

            <button
  className="w-full mt-2 flex items-center justify-center space-x-2 bg-gray-800 text-white px-4 py-2 rounded border border-gray-700 hover:bg-gray-700"
  onClick={() => document.getElementById("hiddenVideoInput").click()}
>
  <Video className="w-5 h-5 text-red-600" />
  <span>Upload Video</span>
</button>

          </div>
        </div>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent mb-6"></div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-lg transition-all text-lg"
        >
          SUBMIT REQUEST
        </button>

        <p className="text-center text-gray-400 text-sm mt-4">
          Your donation will help provide: 🍽️ 🏠 💧
        </p>
      </div>
    </div>
  );
}