import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import VolunteerFormPage from "./pages/VolunteerFormPage"; 
import DonationFormPage from "./pages/DonationFormPage"; 
import EmergencyHelpRequestForm from "./pages/EmergencyHelpRequestForm"; 

function App() {
  return (
    <Router>
      <Routes>
        {/* Dashboard page */}
        <Route path="/" element={<Dashboard />} />

        {/* Volunteer form page */}
        <Route path="/volunteer" element={<VolunteerFormPage />} />
        <Route path="/donation" element={<DonationFormPage />} />
        <Route path="/help" element={<EmergencyHelpRequestForm />} />
      </Routes>
    </Router>
  );
}

export default App;
