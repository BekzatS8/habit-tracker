const express = require("express");
const Habit = require("../models/Habit");
const { authMiddleware } = require("../middleware/auth"); // ✅ Убедись, что импорт верный

const router = express.Router();

// ✅ 1. Создание новой привычки
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, description } = req.body;
    const newHabit = new Habit({ user: req.user.id, name, description, weeklyStatus: [false, false, false, false, false, false, false] });
    await newHabit.save();
    res.status(201).json(newHabit);
  } catch (error) {
    res.status(500).json({ message: "Ошибка при создании привычки" });
  }
});

// ✅ 2. Получение всех привычек пользователя
router.get("/", authMiddleware, async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user.id });
    res.json(habits);
  } catch (error) {
    res.status(500).json({ message: "Ошибка при получении привычек" });
  }
});

// ✅ 3. Обновление привычки по ID
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { name, description, weeklyStatusIndex, status } = req.body;
    const habit = await Habit.findById(req.params.id);

    if (!habit || habit.user.toString() !== req.user.id) {
      return res.status(404).json({ message: "Привычка не найдена" });
    }

    if (weeklyStatusIndex !== undefined && status !== undefined) {
      habit.weeklyStatus[weeklyStatusIndex] = status;
    } else {
      habit.name = name || habit.name;
      habit.description = description || habit.description;
    }

    await habit.save();
    res.json(habit);
  } catch (error) {
    res.status(500).json({ message: "Ошибка при обновлении привычки" });
  }
});

// ✅ 4. Удаление привычки по ID
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);

    if (!habit || habit.user.toString() !== req.user.id) {
      return res.status(404).json({ message: "Привычка не найдена" });
    }

    await habit.deleteOne();
    res.json({ message: "Привычка удалена" });
  } catch (error) {
    res.status(500).json({ message: "Ошибка при удалении привычки" });
  }
});

module.exports = router;
