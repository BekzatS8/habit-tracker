# 🚀 Habit Tracker

**Habit Tracker** is a web application that helps users build and track daily habits. Users can register, log in, and manage their habits with an interactive dashboard. The project includes authentication, role-based access control (RBAC), analytics, and an admin panel.

## 🌟 Features

👉 **User Authentication** (Register/Login with JWT)  
👉 **Create, Edit, Delete Habits**  
👉 **Track Weekly Habit Progress**  
👉 **Habit Completion Statistics & Charts**  
👉 **Role-Based Access Control (Admin & User)**  
👉 **Admin Panel for Managing Users**  
👉 **MongoDB Atlas for Database Storage**  
👉 **Deployed on Render**  

---

## 📌 Live Demo  
🔗 **[Check the live app](https://habit-tracker-s8j1.onrender.com)**  

---

## 🛠️ Installation Guide  

### 1️⃣ **Clone the Repository**  
```bash
git clone https://github.com/BekzatS8/habit-tracker.git
cd habit-tracker
```

### 2️⃣ **Install Dependencies**  
```bash
npm install
```

### 3️⃣ **Set Up Environment Variables**  
Create a `.env` file and add the following variables:  
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
BASE_URL=https://habit-tracker-s8j1.onrender.com
```

### 4️⃣ **Run the App Locally**  
```bash
npm run dev
```
**Local Server:** `http://localhost:5000`  

---

## 🔗 API Endpoints  

### **Authentication**  
| Method | Endpoint          | Description |
|--------|------------------|-------------|
| POST   | `/api/auth/register` | Register a new user |
| POST   | `/api/auth/login`    | Authenticate and return JWT |

### **User Management**  
| Method | Endpoint             | Description |
|--------|---------------------|-------------|
| GET    | `/api/users/profile`  | Get the logged-in user profile |
| PUT    | `/api/users/profile`  | Update user profile (username/email) |

### **Habit Management**  
| Method | Endpoint         | Description |
|--------|-----------------|-------------|
| POST   | `/api/habits`    | Create a new habit |
| GET    | `/api/habits`    | Get all user habits |
| PUT    | `/api/habits/:id` | Update a habit |
| DELETE | `/api/habits/:id` | Delete a habit |

---

## 🚀 Deployment on Render  

### 1️⃣ **Push Changes to GitHub**  
```bash
git add .
git commit -m "Deploy update"
git push origin main
```
### 2️⃣ **Deploy to Render**  
- Go to **[Render](https://render.com/)**  
- Select **"New Web Service"**  
- Connect GitHub Repository  
- Set environment variables in **"Environment"** section  
- Deploy 🚀  

---

## 🛠 Tech Stack  
- **Frontend:** Vanilla JavaScript, HTML, CSS  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB Atlas  
- **Authentication:** JWT, bcryptjs  
- **Deployment:** Render  

---

## 👤 Author  
Developed by **Bekzat Sapargali** 💡  

📧 **Contact:** [Your Email or LinkedIn]  
🌎 **GitHub:** [BekzatS8](https://github.com/BekzatS8)  

---

## 🎯 Future Improvements  
- 📌 Habit reminders & notifications  
- 📌 Monthly & yearly progress reports  
- 📌 Mobile-friendly UI  

🚀 **Happy Tracking!** 🎯  
