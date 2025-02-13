import express from "express";
import { getNewsData } from "../controllers/newsController.js";

const router = express.Router();

router.route("/").get(getNewsData);

export default router;
