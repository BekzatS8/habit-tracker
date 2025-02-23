const express = require("express");
const Habit = require("../models/Habit");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// ✅ 1. Создание новой привычки
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, description } = req.body;
    const newHabit = new Habit({ user: req.user.id, name, description });
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
    const { name, description, weeklyStatus } = req.body;
    const habit = await Habit.findById(req.params.id);

    if (!habit || habit.user.toString() !== req.user.id) {
      return res.status(404).json({ message: "Привычка не найдена" });
    }

    habit.name = name || habit.name;
    habit.description = description || habit.description;
    if (weeklyStatus) habit.weeklyStatus = weeklyStatus;

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
