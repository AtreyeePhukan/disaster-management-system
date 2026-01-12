# Sahayataa – Disaster Management and Emergency Response System

Sahayataa is an end-to-end disaster management and emergency response platform designed to enable fast incident reporting, efficient volunteer coordination, real-time monitoring, and secure donations. The system integrates a modern React frontend with an AWS-powered serverless backend to support scalability, reliability, and rapid response during disasters.

---

## Project Overview

Sahayataa provides a centralized platform where citizens can report emergencies, volunteers can be coordinated efficiently, and authorities or organizations can monitor disaster situations in near real time. The system emphasizes speed, accessibility, and secure handling of sensitive data.

---

## Key Features

### Real-Time Disaster Map
- Live heatmap showing active disasters such as fires, earthquakes, and alerts
- Integrates external data sources:
  - NASA FIRMS
  - USGS
  - GDACS
- Auto-refreshes every 15 minutes
- Satellite layers and intensity-based visualization

---

### Volunteer Registration System
- Volunteer registration with:
  - Location (GPS auto-detection)
  - Skills and experience
  - Availability
- Volunteer data stored in DynamoDB
- Used for proximity-based emergency matching

---

### Emergency Help Request System
- Citizens can submit emergency requests including:
  - Location details (auto GPS)
  - Severity of danger
  - Situation description
  - Number of people affected
  - Specific needs (food, rescue, medical, water, etc.)
- Optional photo and video uploads
- Requests stored securely in DynamoDB

---

### Nearby Volunteer Alert System (AWS SNS)
- Triggered automatically when a new help request is submitted
- System:
  - Identifies nearby volunteers within a defined radius
  - Sends email notifications using AWS SNS
- Volunteers receive request details and exact location
- Significantly reduces response time during emergencies

---

### Donation System
- Secure donation workflow supporting:
  - Predefined or custom donation amounts
  - Purpose-based donations (food, medical aid, general fund)
  - Optional donor anonymity
- Donation records stored in DynamoDB

---

### Media Upload Support
- Users can upload images and videos with emergency requests
- Secure uploads handled via AWS S3 signed URLs
- Media URLs stored alongside request data

---

## Backend Architecture (AWS)

- **AWS Lambda** – Serverless backend functions
- **API Gateway** – REST API endpoints
- **DynamoDB** – Storage for volunteers, donations, and help requests
- **Amazon SNS** – Volunteer alert and notification emails
- **Amazon S3** – Secure media storage
- **IAM Policies** – Access control and security enforcement

---

## Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- ShadCN UI components
- Lucide icons
- Leaflet maps and heatmaps

### Backend
- Node.js (AWS Lambda)
- AWS API Gateway
- DynamoDB
- Amazon SNS
- Amazon S3

---

## Environment Configuration

Create a `.env` file inside the `frontend/` directory:

```env
VITE_API_BASE_URL=https://your-api-url.amazonaws.com/dev
```
## Running the Project Locally

### Frontend
```bash
npm install
npm run dev
```

## Backend

- The backend is fully deployed on AWS.
- No local backend setup is required.

---

## Known Limitations

- Disaster data depends on third-party APIs and their update intervals.
- Real-time behavior is near real-time and not instantaneous.
- Volunteer matching is based on geographic proximity and declared availability.
- The system is not intended to replace official government emergency services.

---

## Future Improvements

- Mobile application support.
- SMS and push notification integration.
- Advanced volunteer availability scheduling.
- Role-based dashboards for authorities and NGOs.
- Offline-first support for low-connectivity regions.

---

## Author

Atreyee Phukan

