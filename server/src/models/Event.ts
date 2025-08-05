import mongoose, { Schema, Document, Types } from "mongoose";

export interface IWellnessEvent extends Document {
  hr: Types.ObjectId;
  vendor: Types.ObjectId;
  eventType: Types.ObjectId;
  proposedDates: Date[];
  proposedLocation: {
    postalCode: string;
    street: string;
  };
  status: "Pending" | "Approved" | "Rejected";
  remarks?: string;
  confirmedDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const WellnessEventSchema = new Schema<IWellnessEvent>(
  {
    hr: { type: Schema.Types.ObjectId, ref: "User", required: true },
    vendor: { type: Schema.Types.ObjectId, ref: "User", required: true },
    eventType: { type: Schema.Types.ObjectId, ref: "EventType", required: true },
    proposedDates: {
      type: [Date],
      required: true,
      validate: [(arr: Date[]) => arr.length === 3, "Must provide exactly 3 dates"],
    },
    proposedLocation: {
      postalCode: { type: String, required: true },
      street: { type: String, required: true },
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      required: true,
      default: "Pending",
    },
    remarks: {
      type: String,
      required: function (this: IWellnessEvent) {
        return this.status === "Rejected";
      },
    },
    confirmedDate: {
      type: Date,
      validate: {
        validator: function (this: IWellnessEvent, value: Date) {
          if (this.status === "Approved" && value) {
            return this.proposedDates.some((d) => d.getTime() === value.getTime());
          }
          return true;
        },
        message: "confirmedDate must be one of the proposedDates",
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model<IWellnessEvent>("WellnessEvent", WellnessEventSchema);
