import mongoose, { Schema, Document } from "mongoose";
import { IEvent } from "../types/event";

export interface EventDocument extends Omit<IEvent, "_id">, Document {}

const eventSchema = new Schema<EventDocument>(
  {
    title: {
      type: String,
      required: [true, "Event title is required"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Event description is required"],
      trim: true,
      maxlength: [500, "Description cannot be more than 500 characters"],
    },
    date: {
      type: Date,
      required: [true, "Event date is required"],
      validate: {
        validator: function (value: Date) {
          return value > new Date();
        },
        message: "Event date must be in the future",
      },
    },
    time: {
      type: String,
      required: [true, "Event time is required"],
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Event location is required"],
      trim: true,
    },
    maxAttendees: {
      type: Number,
      required: [true, "Maximum attendees is required"],
      min: [1, "Maximum attendees must be at least 1"],
      max: [1000, "Maximum attendees cannot exceed 1000"],
    },
    attendees: [
      {
        type: String,
        trim: true,
      },
    ],
    category: {
      type: String,
      required: [true, "Event category is required"],
      enum: ["meditation", "yoga", "nutrition", "fitness", "wellness", "other"],
      default: "wellness",
    },
    instructor: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      min: [0, "Price cannot be negative"],
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for current attendee count
eventSchema.virtual("attendeeCount").get(function () {
  return this.attendees.length;
});

// Virtual for available spots
eventSchema.virtual("availableSpots").get(function () {
  return this.maxAttendees - this.attendees.length;
});

// Index for better query performance
eventSchema.index({ date: 1, isActive: 1 });
eventSchema.index({ category: 1, isActive: 1 });

export const Event = mongoose.model<EventDocument>("Event", eventSchema);
