import express from "express";
import { checkAdminAuth, checkAuth, getUser } from "../controllers/auth.controller";
import { getUserFromToken, manageDeposit, manageWithdrawal } from "../controllers/user.controller";
import { requireAuth } from "../middleware/auth";
import { getAllTransactions, getTransactions } from "../controllers/transaction.controller";
import { createUser, deleteUser, editUser, getAdmin, getCustomers } from "../controllers/admin.controller";

const router = express.Router();

router.post("/login", getUser);
router.get("/user", requireAuth, getUserFromToken);
router.get("/check-auth", requireAuth, checkAuth);

router.post("/admin/login", getAdmin);
router.get("/admin/customers", requireAuth, getCustomers);
router.post("/admin/createUser", requireAuth, createUser);
router.post("/admin/editUser", requireAuth, editUser);
router.delete("/admin/deleteUser", requireAuth, deleteUser);
router.get("/admin/allTransactions", requireAuth, getAllTransactions);
router.get("/admin/check-auth", requireAuth, checkAdminAuth);


router.post("/withdraw", requireAuth, manageWithdrawal);
router.post("/deposit", requireAuth, manageDeposit);

router.get("/transaction", requireAuth, getTransactions);

export default router;
