const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { authMiddleware } = require("../middleware/auth");
const router = express.Router();

// 🔹 Регистрация пользователя
router.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "Email уже используется" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });

        await newUser.save();
        res.status(201).json({ message: "Пользователь зарегистрирован" });
    } catch (error) {
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

// 🔹 Логин пользователя
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Неверный email или пароль" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Неверный email или пароль" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ token, userId: user._id, role: user.role });
    } catch (error) {
        res.status(500).json({ message: "Ошибка сервера" });
    }
});
// 🔹 Обновление профиля пользователя (email, username)
router.put("/profile", authMiddleware, async (req, res) => {
  try {
      const { username, email } = req.body;
      const userId = req.user.id;

      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "Пользователь не найден" });

      // Проверяем, занят ли email другим пользователем
      if (email && email !== user.email) {
          const emailExists = await User.findOne({ email });
          if (emailExists) return res.status(400).json({ message: "Email уже используется" });
          user.email = email;
      }

      // Обновляем username, если он указан
      if (username) user.username = username;

      await user.save();
      res.json({ message: "Профиль обновлен", user });

  } catch (error) {
      console.error("Ошибка обновления профиля:", error);
      res.status(500).json({ message: "Ошибка сервера" });
  }
});
module.exports = router;
