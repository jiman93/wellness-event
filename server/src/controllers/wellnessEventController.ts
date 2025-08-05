import { Request, Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import WellnessEvent from "../models/Event";
import mongoose from "mongoose";
import User from "../models/User"; // Added import for User model

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
    // For HR users, get all events for their company
    // First, get the HR user's company name
    const hrUser = await User.findById(userId).select("companyName");
    if (hrUser?.companyName) {
      // Find all HR users in the same company and get their events
      const hrUsersInCompany = await User.find({
        role: "hr",
        companyName: hrUser.companyName,
      }).select("_id");

      const hrUserIds = hrUsersInCompany.map((user) => user._id);
      filter.hr = { $in: hrUserIds };
    }
  } else if (role === "vendor") {
    // For vendors, show only their events
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
