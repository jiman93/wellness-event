import { Request, Response } from "express";
import { Event } from "../models/Event";
import { CreateEventRequest, UpdateEventRequest } from "../types/event";

// Get all events
export const getEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, isActive } = req.query;

    const filter: any = {};
    if (category) filter.category = category;
    if (isActive !== undefined) filter.isActive = isActive === "true";

    const events = await Event.find(filter).sort({ date: 1 }).select("-__v");

    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get single event
export const getEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const event = await Event.findById(req.params.id).select("-__v");

    if (!event) {
      res.status(404).json({
        success: false,
        message: "Event not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Create new event
export const createEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const eventData: CreateEventRequest = req.body;

    // Convert date string to Date object
    const event = new Event({
      ...eventData,
      date: new Date(eventData.date),
    });

    const savedEvent = await event.save();

    res.status(201).json({
      success: true,
      data: savedEvent,
    });
  } catch (error) {
    if (error instanceof Error && error.name === "ValidationError") {
      res.status(400).json({
        success: false,
        message: "Validation Error",
        error: error.message,
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Server Error",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
};

// Update event
export const updateEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const updateData: UpdateEventRequest = req.body;

    // Convert date string to Date object if provided
    if (updateData.date) {
      (updateData as any).date = new Date(updateData.date);
    }

    const event = await Event.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).select("-__v");

    if (!event) {
      res.status(404).json({
        success: false,
        message: "Event not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    if (error instanceof Error && error.name === "ValidationError") {
      res.status(400).json({
        success: false,
        message: "Validation Error",
        error: error.message,
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Server Error",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
};

// Delete event
export const deleteEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      res.status(404).json({
        success: false,
        message: "Event not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Join event
export const joinEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { attendeeName } = req.body;

    if (!attendeeName) {
      res.status(400).json({
        success: false,
        message: "Attendee name is required",
      });
      return;
    }

    const event = await Event.findById(req.params.id);

    if (!event) {
      res.status(404).json({
        success: false,
        message: "Event not found",
      });
      return;
    }

    if (!event.isActive) {
      res.status(400).json({
        success: false,
        message: "Event is not active",
      });
      return;
    }

    if (event.attendees.includes(attendeeName)) {
      res.status(400).json({
        success: false,
        message: "Already registered for this event",
      });
      return;
    }

    if (event.attendees.length >= event.maxAttendees) {
      res.status(400).json({
        success: false,
        message: "Event is full",
      });
      return;
    }

    event.attendees.push(attendeeName);
    await event.save();

    res.status(200).json({
      success: true,
      message: "Successfully joined event",
      data: event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
