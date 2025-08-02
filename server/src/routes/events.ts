import express from "express";
import {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  joinEvent,
} from "../controllers/eventController";

const router = express.Router();

// GET /api/events - Get all events
router.get("/", getEvents);

// GET /api/events/:id - Get single event
router.get("/:id", getEvent);

// POST /api/events - Create new event
router.post("/", createEvent);

// PUT /api/events/:id - Update event
router.put("/:id", updateEvent);

// DELETE /api/events/:id - Delete event
router.delete("/:id", deleteEvent);

// POST /api/events/:id/join - Join event
router.post("/:id/join", joinEvent);

export default router;
