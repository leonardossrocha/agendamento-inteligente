# 🏥 Medical Rep Smart Scheduler & CRM

A lightweight, serverless web application designed to optimize the daily scheduling and routing routines of pharmaceutical/medical representatives.

This project bridges the gap between academic database concepts and practical business needs by transforming static Google Sheets into a fully functional, dynamic relational database system accessed via a responsive web interface.

## 🎯 The Problem

Medical representatives manage extensive portfolios of doctors (often thousands of records) and must schedule visits based on specific business rules (e.g., prescribing potential). Standard form tools (like Google Forms) lack the dynamic capabilities to fetch real-time data, apply visual business rules on the fly, or handle multiple complex entries (like selecting several distinct dates and times in a single submission).

## 💡 The Solution

This application provides a **Single Page Application (SPA)** front-end that communicates with a custom-built API. It implements a strict **CQRS (Command and Query Responsibility Segregation)** inspired pattern using Google Apps Script:

* **Read Database:** Fetches doctor profiles, specialties, and categories from a master spreadsheet (`RelacaoAlfa`).

* **Write Database:** Records the confirmed schedules into a separate, structured destination spreadsheet (`agenda`).

### Key Features

* **Dynamic Data Fetching:** Asynchronously loads thousands of client records without locking the UI.

* **Visual Business Rules:** Automatically evaluates the doctor's category (Cat RX). Categories 1-3 trigger a "High Potential" UI alert, while 4-5 trigger a "Maintenance" alert.

* **Complex Data Handling:** Allows users to dynamically add/remove multiple date and time slots in a single form submission.

* **Zero Backend Infrastructure:** Fully powered by Google Apps Script acting as a REST API.

## 🏗️ Technical Architecture

This project is built using a **Serverless JAMstack** architecture, making it highly scalable and free to host.

1. **Front-End (GitHub Pages):** HTML5, Vanilla JavaScript (ES6+), and [Tailwind CSS](https://tailwindcss.com/) for a mobile-first UI.
   * [Lucide Icons](https://lucide.dev/) for lightweight iconography.

2. **Back-End API (Google Apps Script):** Two endpoints (`doGet` and `doPost`) deployed as a Web App.
   * Handles JSON parsing and Google Sheets manipulation (`SpreadsheetApp`).

3. **Database:** Google Workspace (Google Sheets) acting as the NoSQL document store.

## 🔒 Security Approach (Public Repo Context)

Since this front-end is hosted publicly on GitHub Pages, the endpoint URL is inherently exposed to the client. To prevent unauthorized POST requests (spam/bot abuse), the API implements a **Token-Based Authorization** layer.

The front-end injects a specific secret token into the JSON payload:

```javascript
const payload = {
    token: "CLIENT_SECRET_TOKEN",
    medico: "Dr. John Doe",
    // ...
};
```

The Google Apps Script verifies this token before executing any write operations (HTTP 401 Unauthorized if invalid).

## 🚀 How to Run / Setup

### 1. Backend Setup (Google Workspace)

1. Create two Google Sheets: `MasterList` (Source) and `Schedule` (Destination).
2. Open `Extensions > Apps Script` in one of them.
3. Deploy the `codigo.gs` file (ensure you set execution as *Yourself* and access to *Anyone*).
4. Copy the generated Web App URL.

### 2. Frontend Setup

1. Clone this repository.
2. Open `index.html`.
3. Replace the `API_URL` constant with your generated Google Apps Script URL.
4. Host the file on any static server (e.g., GitHub Pages, Vercel, Netlify).

## 👨‍🏫 About the Author

Developed by **Leonardo Rocha**
Professor and Computer Science Researcher (MSc, PhD Student).*

Based in Londrina, PR - Brazil, Leonardo specializes in bridging the gap between deep theoretical academic knowledge (Computer Science, AI, and Databases) and practical, high-impact market solutions. He is a higher education professor at Unicesumar and SENAC, teaching programming logic, IT fundamentals, and networking.

> *"This project serves as a practical study case for IT students on how to overcome the limitations of rigid tools using custom APIs, asynchronous JavaScript, and serverless computing."*
