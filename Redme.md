# Online Voting System (HTML + CSS + JS + Google Apps Script)

A complete **Online Voting System** where users can register, log in, and vote only once. Admin can view vote counts, percentages, and a bar graph visualization.

---

## 🚀 Features

### 👤 User Features

* User Registration (Auto-Generated Voter ID)
* User Login
* Beautiful Glassmorphism Dashboard
* Candidate Cards with:

  * Party Logo
  * Candidate Name
  * Party Name
  * Description
* Secure Voting (One Vote Per User)
* Already Voted Detection
* Dashboard Updates Automatically

### 🛠 Admin Features

* Live Vote Count
* Percentage Calculation
* Winner Prediction
* Bar Graph Visualization (Chart.js)
* Modern Glass UI

### 📦 Technology Stack

* **Frontend**: HTML, CSS, JavaScript
* **Backend**: Google Apps Script
* **Database**: Google Sheets
* **Charts**: Chart.js

---

## 📁 Project Structure

```
online-voting/
│── index.html           (Login Page)
│── register.html        (User Registration)
│── dashboard.html       (User Dashboard & Voting)
│── admin.html           (Admin Dashboard)
│── style.css            (User & Login Styling)
│── dashboard.css        (User Dashboard Styling)
│── admin.css            (Admin Dashboard Styling)
│── script.js            (Frontend Logic)
│── script.gs            (Backend API)
│── README.md            (Project Documentation)
```

---

## 🗂 Google Sheet Setup

Create **3 Sheets**:

### 1️⃣ Users Sheet

```
Timestamp | Name | Email | VoterID | Password | HasVoted
```

### 2️⃣ Candidates Sheet

```
CandidateName | Party | LogoURL | Description | Votes
```

Example:

```
Narendra Deshmukh | BJP       | <LogoURL> | Development focused...   | 0
Sahil Patil       | Congress  | <LogoURL> | Social welfare focused... | 0
Aniket Pawar      | NCP       | <LogoURL> | Farmer-centric leader... | 0
```

### 3️⃣ Votes Sheet

```
Timestamp | VoterID | Candidate
```

---

## 🧠 Backend (Google Apps Script)

### 📌 Deploy Script as Web App

* Apps Script → Deploy → New Deployment → Web App
* Access: **Anyone**
* Copy the Web App URL → paste into `script.js`

Main functionality:

* Auto-generate Voter ID
* Register User
* Login Validation
* Prevent double voting
* Store votes
* Update vote count in Candidates Sheet
* Admin result API

---

## 🎨 Frontend

### Login Page

* Clean neon + glass UI

### Registration Page

* Auto-generated Voter ID displayed after registration

### Dashboard

* Sidebar
* User info cards
* Candidate selection cards
* Vote lock after one submission

---

## 📊 Admin Dashboard

Includes:

* Vote counts
* Percentage calculation
* Winner prediction
* Bar chart visualization using Chart.js

Example chart:

```
BJP: 45%
Congress: 32%
NCP: 23%
```

---

## 🔐 Security

* One vote per user
* User voting status stored in sheet
* Double vote prevention both backend and frontend
* LocalStorage-based session

---

## ▶ How to Run

### 1️⃣ Upload all HTML, CSS & JS files to your hosting or local server

### 2️⃣ Connect Google Apps Script Web App URL inside `script.js`

### 3️⃣ Prepare Google Sheets with correct structure

### 4️⃣ Start using system

---

## 📌 Future Enhancements (Optional)

* OTP Login
* Admin Authentication
* Live auto-refresh dashboard
* Pie chart visualization
* Candidate video / manifesto modal
* Export results to PDF / Excel

---

## 👤 Author

Created with ❤️ for a complete, professional voting system.

---

If you need ZIP file or want me to add more features → just tell me!
: test
