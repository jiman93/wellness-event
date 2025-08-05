import { Request, Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import WellnessEvent from "../models/Event";
import mongoose from "mongoose";

// POST /wellness-events
export const createWellnessEvent = async (req: AuthRequest, res: Response) => {
  const { eventType, vendor, proposedDates, proposedLocation } = req.body;
  const hr = req.user?.userId; // set by auth middleware
  if (!eventType || !vendor || !proposedDates || !proposedLocation) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  if (!Array.isArray(proposedDates) || proposedDates.length !== 3) {
    return res.status(400).json({ message: "Must provide exactly 3 proposed dates" });
  }
  const event = await WellnessEvent.create({
    hr,
    vendor,
    eventType,
    proposedDates,
    proposedLocation,
    status: "Pending",
  });
  return res.status(201).json({ data: event });
};

// GET /wellness-events
export const getWellnessEvents = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  const role = req.user?.role;
  let filter: any = {};
  if (role === "hr") {
    filter.hr = userId;
  } else if (role === "vendor") {
    filter.vendor = userId;
  }
  const events = await WellnessEvent.find(filter)
    .populate("hr", "name email companyName")
    .populate("vendor", "name email")
    .populate("eventType", "name");
  return res.json({ data: events });
};

// GET /wellness-events/:id
export const getWellnessEventById = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid event ID" });
  }
  const event = await WellnessEvent.findById(id)
    .populate("hr", "name email companyName")
    .populate("vendor", "name email")
    .populate("eventType", "name");
  if (!event) return res.status(404).json({ message: "Event not found" });
  return res.json({ data: event });
};

// PATCH /wellness-events/:id/approve
export const approveWellnessEvent = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { confirmedDate } = req.body;
  const userId = req.user?.userId;
  const event = await WellnessEvent.findById(id);
  if (!event) return res.status(404).json({ message: "Event not found" });
  if (String(event.vendor) !== String(userId)) {
    return res.status(403).json({ message: "Not authorized" });
  }
  if (
    !confirmedDate ||
    !event.proposedDates.some((d) => new Date(d).getTime() === new Date(confirmedDate).getTime())
  ) {
    return res.status(400).json({ message: "confirmedDate must be one of the proposedDates" });
  }
  event.status = "Approved";
  event.confirmedDate = confirmedDate;
  await event.save();
  return res.json({ data: event });
};

// PATCH /wellness-events/:id/reject
export const rejectWellnessEvent = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { remarks } = req.body;
  const userId = req.user?.userId;
  const event = await WellnessEvent.findById(id);
  if (!event) return res.status(404).json({ message: "Event not found" });
  if (String(event.vendor) !== String(userId)) {
    return res.status(403).json({ message: "Not authorized" });
  }
  if (!remarks) {
    return res.status(400).json({ message: "Remarks are required to reject" });
  }
  event.status = "Rejected";
  event.remarks = remarks;
  await event.save();
  return res.json({ data: event });
};
