import { Router } from "express";
import { getAIAnalysis } from "../controllers/aiController";

const router = Router();

router.post("/", getAIAnalysis);

export default router;
