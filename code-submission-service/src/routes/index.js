import { Router } from "express";
import codeController from "../controllers/codeController.js";

const router = Router();

router.post("/submit", codeController.submitCode);
router.get("/result/:submissionId", codeController.checkResult);

export default router;