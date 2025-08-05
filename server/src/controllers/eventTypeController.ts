import { Request, Response } from "express";
import EventType from "../models/EventType";

export const getEventTypes = async (_req: Request, res: Response) => {
  const eventTypes = await EventType.find();
  res.json({ data: eventTypes });
};
