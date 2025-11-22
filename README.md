Sahayataa – Disaster Management and Emergency Response System

Sahayataa is an end-to-end disaster management platform designed to enable fast reporting, efficient volunteer coordination, real-time monitoring, and secure donations.
The system integrates a modern React frontend with an AWS-powered backend for reliability, scalability, and immediate response.

Features
1. Real-Time Disaster Map
-Live heatmap showing active fires, earthquakes, and disaster alerts.
-Uses NASA FIRMS, USGS, and GDACS feeds.
-Auto-refresh every 15 minutes.
-Satellite layers and intensity visualization.

2. Volunteer Registration System
-Volunteers register with location, skills, availability, and experience.
-GPS auto-detection.
-Stored in DynamoDB.
-Used for emergency matching.

3. Emergency Help Request Form
-Citizens can submit:
-Location details (auto GPS)
-Danger severity
-Situation description
-Number of people affected
-Specific needs (food, rescue, medical, water, etc.)
-Optional photo/video uploads via S3
-Saved securely to DynamoDB.

4. Nearby Volunteer Alert System (AWS SNS)
-When a new help request is submitted:
-System scans for volunteers within a nearby radius.
-Sends email notifications through AWS SNS.
-Volunteers receive request details and exact location.
-Greatly accelerates emergency response.

5. Donation System
-Secure donation form with:
-Predefined/custom amounts
-Purpose-based donation (food, medical, general fund)
-Donor info and optional anonymity
-Stored in DynamoDB.

6. Media Upload Support
-Users can upload photos/videos with their emergency requests.
-S3 Signed URLs ensure secure uploads.
-File URLs stored with request.

7. AWS-Powered Backend
-AWS Lambda — serverless backend
-API Gateway — REST endpoints
-DynamoDB — database for volunteers, donations, help requests
-SNS — volunteer alert emails
-S3 — media storage
-IAM Security Policies — for secure access control


Tech Stack
1.Frontend
 -React (Vite)
 -TailwindCSS
 -ShadCN components
 -Lucide icons
 -Leaflet heatmaps and maps

2. Backend
  -Node.js (Lambda)
  -AWS API Gateway
  -DynamoDB
  -SNS
  -S3

Environment Variables
 -Create a .env inside /frontend:
  VITE_API_BASE_URL=https://your-api-url.amazonaws.com/dev

Running Locally
1. Install dependencies
   -npm install
2. Start frontend
   -npm run dev
3. Backend
   -Runs on AWS, no local backend required.
