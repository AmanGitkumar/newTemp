const express = require("express");
const Expense = require("../Models/Expense");
const Income = require("../Models/Income");
const ensureAuthenticated = require("../Middlewares/Auth");
const router = express.Router();

// 📊 Get Dashboard Summary
router.get("/summary", ensureAuthenticated, async (req, res) => {
  try {
    const totalIncome = await Income.aggregate([
      { $match: { user: req.user.id } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    const totalExpenses = await Expense.aggregate([
      { $match: { user: req.user.id } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    const incomeTotal = totalIncome.length ? totalIncome[0].total : 0;
    const expenseTotal = totalExpenses.length ? totalExpenses[0].total : 0;
    const balance = incomeTotal - expenseTotal;

    res.json({ totalIncome: incomeTotal, totalExpenses: expenseTotal, balance });
  } catch (error) {
    res.status(500).json({ error: "Error fetching dashboard data" });
  }
});

module.exports = router;
