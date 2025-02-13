import express from "express";
import { purchaseStock, sellStock, getStockForUser, resetAccount } from "../controllers/stockController.js";
import { checkAuth } from "../controllers/authMiddleware.js";

const router = express.Router();

router.route("/").post(checkAuth, purchaseStock);
router.route("/").patch(checkAuth, sellStock);
router.route("/:userId").get(checkAuth, getStockForUser);
router.route("/:userId").delete(checkAuth, resetAccount);

export default router;
