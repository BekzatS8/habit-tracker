require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth");  // ✅ Оставляем ОДИН раз!
const habitRoutes = require("./routes/habits");
const adminRoutes = require("./routes/admin");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 5000;

// 🔹 Подключение к MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ MongoDB connection error:", err));

// 🔹 Подключаем middleware
app.use(cors());
app.use(express.json());

// 🔹 Подключаем маршруты API
app.use("/api/auth", authRoutes);
app.use("/api/habits", habitRoutes);
app.use("/api/admin", adminRoutes);

// 🔹 Подключаем статические файлы (Frontend)
app.use(express.static(path.join(__dirname, "public")));

// 🔹 Перенаправляем корень на `index.html`
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 🔹 Обработчик ошибок (должен быть последним!)
app.use(errorHandler);

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
