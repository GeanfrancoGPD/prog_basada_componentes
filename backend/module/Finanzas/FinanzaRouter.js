import express from "express";

import { authMiddleware } from "./FinanzaMiddleware.js";

import { FinanceBO } from "./FinanzaBO.js";

const router = express.Router();

const financeBO = new FinanceBO();
router.post("/register", async (req, res) => {
  await financeBO.register(req, res);
});

router.post("/login", async (req, res) => {
  await financeBO.login(req, res);
});

router.get("/usuarios", async (req, res) => {
  await financeBO.getUsers(req, res);
});
// ==========================
// DASHBOARD
// ==========================

router.get("/dashboard", authMiddleware, async (req, res) => {
  await financeBO.getDashboard(req, res);
});

router.get("/statistics/categories", authMiddleware, async (req, res) => {
  await financeBO.getExpensesByCategory(req, res);
});

router.get(
  "/statistics/income-vs-expenses",
  authMiddleware,
  async (req, res) => {
    await financeBO.getIncomeVsExpenses(req, res);
  },
);

// ==========================
// TRANSACTIONS
// ==========================

router.get("/transactions", authMiddleware, async (req, res) => {
  await financeBO.getTransactions(req, res);
});

router.post("/transactions", authMiddleware, async (req, res) => {
  await financeBO.createTransaction(req, res);
});

router.put("/transactions/:id", authMiddleware, async (req, res) => {
  await financeBO.updateTransaction(req, res);
});

router.delete("/transactions/:id", authMiddleware, async (req, res) => {
  await financeBO.deleteTransaction(req, res);
});

// ==========================
// GOALS
// ==========================

router.get("/goals", authMiddleware, async (req, res) => {
  await financeBO.getGoals(req, res);
});

router.post("/goals", authMiddleware, async (req, res) => {
  await financeBO.createGoal(req, res);
});

router.put("/goals/:id", authMiddleware, async (req, res) => {
  await financeBO.updateGoal(req, res);
});

router.delete("/goals/:id", authMiddleware, async (req, res) => {
  await financeBO.deleteGoal(req, res);
});

router.get("/goals/progress", authMiddleware, async (req, res) => {
  await financeBO.getGoalProgress(req, res);
});

// ==========================
// CATEGORIES
// ==========================

router.get("/categories", authMiddleware, async (req, res) => {
  await financeBO.getCategories(req, res);
});

// ==========================
// USER PROFILE
// ==========================

router.put("/profile/password", authMiddleware, async (req, res) => {
  await financeBO.updateUserPassword(req, res);
});

export default router;
