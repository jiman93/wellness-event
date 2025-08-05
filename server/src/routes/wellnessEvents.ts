import { Router } from "express";
import {
  createWellnessEvent,
  getWellnessEvents,
  getWellnessEventById,
  approveWellnessEvent,
  rejectWellnessEvent,
} from "../controllers/wellnessEventController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.use(authMiddleware);

router.post("/", createWellnessEvent);
router.get("/", getWellnessEvents);
router.get("/:id", getWellnessEventById);
router.patch("/:id/approve", approveWellnessEvent);
router.patch("/:id/reject", rejectWellnessEvent);

export default router;
