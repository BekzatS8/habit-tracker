const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Регистрация пользователя
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Проверка, существует ли пользователь
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email уже используется" });

    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });

    await newUser.save();
    res.status(201).json({ message: "Пользователь зарегистрирован" });
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// Вход пользователя
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Неверный email или пароль" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Неверный email или пароль" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token, userId: user._id });
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

module.exports = router;
