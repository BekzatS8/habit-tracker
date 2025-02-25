const express = require("express");
const User = require("../models/User");
const { authMiddleware, isAdmin } = require("../middleware/auth");

const router = express.Router();

// 🔹 Получение всех пользователей (Только для админов)
router.get("/users", authMiddleware, isAdmin, async (req, res) => {
    try {
        const users = await User.find({}, "-password"); // Не отправляем пароль
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Ошибка при получении пользователей" });
    }
});

// 🔹 Обновление роли пользователя (Только для админов)
router.put("/users/:id", authMiddleware, isAdmin, async (req, res) => {
    try {
        const { role } = req.body;
        if (!["user", "admin"].includes(role)) {
            return res.status(400).json({ message: "Недопустимая роль" });
        }

        const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true, select: "-password" });
        if (!user) return res.status(404).json({ message: "Пользователь не найден" });

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Ошибка при обновлении пользователя" });
    }
});

// 🔹 Удаление пользователя (Только для админов)
router.delete("/users/:id", authMiddleware, isAdmin, async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: "Пользователь не найден" });

        res.json({ message: "Пользователь удален" });
    } catch (error) {
        res.status(500).json({ message: "Ошибка при удалении пользователя" });
    }
});

module.exports = router;
