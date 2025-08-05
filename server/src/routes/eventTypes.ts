import { Router } from "express";
import { getEventTypes } from "../controllers/eventTypeController";

const router = Router();

router.get("/", getEventTypes);

export default router;
