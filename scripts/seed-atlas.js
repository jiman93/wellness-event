const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// MongoDB Atlas connection string
const MONGODB_URI =
  "mongodb+srv://zulhafiz10:cormeum123@wellness.qfqnmq1.mongodb.net/wellness-events?retryWrites=true&w=majority&appName=wellness";

// User Schema
const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    passwordHash: String,
    role: { type: String, enum: ["hr", "vendor"] },
    companyName: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { collection: "users" }
);

// Event Type Schema
const eventTypeSchema = new mongoose.Schema(
  {
    name: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { collection: "eventtypes" }
);

// Wellness Event Schema
const wellnessEventSchema = new mongoose.Schema(
  {
    eventType: { type: mongoose.Schema.Types.ObjectId, ref: "EventType" },
    hr: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    proposedDates: [String],
    confirmedDate: String,
    status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
    proposedLocation: {
      street: String,
      postalCode: String,
    },
    remarks: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { collection: "wellnessevents" }
);

const User = mongoose.model("User", userSchema);
const EventType = mongoose.model("EventType", eventTypeSchema);
const WellnessEvent = mongoose.model("WellnessEvent", wellnessEventSchema);

async function seedDatabase() {
  try {
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB Atlas");

    // Clear existing data
    console.log("Clearing existing data...");
    await User.deleteMany({});
    await EventType.deleteMany({});
    await WellnessEvent.deleteMany({});

    // Hash password
    const passwordHash = await bcrypt.hash("password123", 10);

    // Create users
    console.log("Creating users...");
    const users = await User.insertMany([
      {
        name: "John Smith",
        email: "john.smith@company.com",
        passwordHash,
        role: "hr",
        companyName: "TechCorp Inc.",
      },
      {
        name: "Sarah Johnson",
        email: "sarah.johnson@company.com",
        passwordHash,
        role: "hr",
        companyName: "TechCorp Inc.",
      },
      {
        name: "Mike Chen",
        email: "mike.chen@yogastudio.com",
        passwordHash,
        role: "vendor",
      },
      {
        name: "Lisa Garcia",
        email: "lisa.garcia@meditation.com",
        passwordHash,
        role: "vendor",
      },
      {
        name: "David Wilson",
        email: "david.wilson@nutrition.com",
        passwordHash,
        role: "vendor",
      },
    ]);

    // Create event types
    console.log("Creating event types...");
    const eventTypes = await EventType.insertMany([
      { name: "Yoga Class" },
      { name: "Meditation Workshop" },
      { name: "Nutrition Seminar" },
      { name: "Fitness Training" },
      { name: "Mental Health Talk" },
    ]);

    // Create sample wellness events
    console.log("Creating sample wellness events...");
    const hr1 = users.find((u) => u.email === "john.smith@company.com");
    const hr2 = users.find((u) => u.email === "sarah.johnson@company.com");
    const vendor1 = users.find((u) => u.email === "mike.chen@yogastudio.com");
    const vendor2 = users.find((u) => u.email === "lisa.garcia@meditation.com");
    const vendor3 = users.find((u) => u.email === "david.wilson@nutrition.com");

    await WellnessEvent.insertMany([
      {
        hr: hr1._id,
        vendor: vendor1._id,
        eventType: eventTypes[0]._id, // Yoga Class
        proposedDates: ["2024-03-15", "2024-03-16", "2024-03-17"],
        proposedLocation: {
          postalCode: "12345",
          street: "123 Wellness Street, Downtown",
        },
        status: "Pending",
      },
      {
        hr: hr1._id,
        vendor: vendor2._id,
        eventType: eventTypes[1]._id, // Meditation Workshop
        proposedDates: ["2024-03-20", "2024-03-21", "2024-03-22"],
        proposedLocation: {
          postalCode: "12345",
          street: "456 Peace Avenue, Downtown",
        },
        status: "Approved",
        confirmedDate: "2024-03-20",
      },
      {
        hr: hr2._id,
        vendor: vendor3._id,
        eventType: eventTypes[2]._id, // Nutrition Seminar
        proposedDates: ["2024-03-25", "2024-03-26", "2024-03-27"],
        proposedLocation: {
          postalCode: "67890",
          street: "789 Health Boulevard, Uptown",
        },
        status: "Rejected",
        remarks: "Dates conflict with company retreat",
      },
      {
        hr: hr2._id,
        vendor: vendor1._id,
        eventType: eventTypes[3]._id, // Fitness Training
        proposedDates: ["2024-04-01", "2024-04-02", "2024-04-03"],
        proposedLocation: {
          postalCode: "67890",
          street: "321 Fitness Road, Uptown",
        },
        status: "Pending",
      },
      {
        hr: hr1._id,
        vendor: vendor2._id,
        eventType: eventTypes[4]._id, // Mental Health Talk
        proposedDates: ["2024-04-10", "2024-04-11", "2024-04-12"],
        proposedLocation: {
          postalCode: "12345",
          street: "654 Mind Street, Downtown",
        },
        status: "Pending",
      },
    ]);

    console.log("✅ Database seeded successfully!");
    console.log("\n📋 Demo Credentials:");
    console.log("HR Users:");
    console.log("  - john.smith@company.com / password123");
    console.log("  - sarah.johnson@company.com / password123");
    console.log("Vendor Users:");
    console.log("  - mike.chen@yogastudio.com / password123");
    console.log("  - lisa.garcia@meditation.com / password123");
    console.log("  - david.wilson@nutrition.com / password123");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB Atlas");
  }
}

seedDatabase();
