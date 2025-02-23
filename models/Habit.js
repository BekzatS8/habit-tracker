const mongoose = require("mongoose");

const HabitSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
  weeklyStatus: { type: [Boolean], default: [false, false, false, false, false, false, false] },
});

module.exports = mongoose.model("Habit", HabitSchema);
