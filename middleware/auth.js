const jwt = require("jsonwebtoken");
const User = require("../models/User");

// 🔹 Middleware для проверки аутентификации
module.exports.authMiddleware = (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (!token) return res.status(401).json({ message: "Нет доступа" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Неверный токен" });
    }
};

// 🔹 Middleware для проверки роли администратора
module.exports.isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user || user.role !== "admin") {
            return res.status(403).json({ message: "Доступ запрещен. Только для администраторов." });
        }
        next();
    } catch (error) {
        res.status(500).json({ message: "Ошибка проверки роли" });
    }
};
