import mongoose, { Schema, Document } from "mongoose";

export interface IEventType extends Document {
  name: string;
}

const EventTypeSchema = new Schema<IEventType>(
  {
    name: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export default mongoose.model<IEventType>("EventType", EventTypeSchema);
