import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: "hr" | "vendor";
  companyName?: string;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["hr", "vendor"], required: true },
    companyName: {
      type: String,
      required: function (this: IUser) {
        return this.role === "hr";
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);
