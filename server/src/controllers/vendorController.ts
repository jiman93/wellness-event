import { Request, Response } from "express";
import User from "../models/User";

export const getVendors = async (_req: Request, res: Response) => {
  try {
    const vendors = await User.find({ role: "vendor" }).select("name email");
    res.json({ data: vendors });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
