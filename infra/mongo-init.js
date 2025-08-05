// MongoDB initialization script
// First authenticate with admin database
db = db.getSiblingDB("admin");
db.auth(process.env.MONGO_INITDB_ROOT_USERNAME, process.env.MONGO_INITDB_ROOT_PASSWORD);

// Switch to the wellness-events database
db = db.getSiblingDB("wellness-events");

// Create collections
db.createCollection("users");
db.createCollection("eventtypes");
db.createCollection("wellnessevents");

// Insert sample users with properly hashed passwords (password: "password123")
db.users.insertMany([
  {
    _id: ObjectId(),
    name: "John Smith",
    email: "john.smith@company.com",
    passwordHash: "$2b$10$3BBDrvp17wFVuvtERKaLwuAdZcvApTRy3hSH3rHyYEraqEFrQ8luq",
    role: "hr",
    companyName: "TechCorp Inc.",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: ObjectId(),
    name: "Sarah Johnson",
    email: "sarah.johnson@company.com",
    passwordHash: "$2b$10$3BBDrvp17wFVuvtERKaLwuAdZcvApTRy3hSH3rHyYEraqEFrQ8luq",
    role: "hr",
    companyName: "Wellness Solutions Ltd.",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: ObjectId(),
    name: "Mike Chen",
    email: "mike.chen@yogastudio.com",
    passwordHash: "$2b$10$3BBDrvp17wFVuvtERKaLwuAdZcvApTRy3hSH3rHyYEraqEFrQ8luq",
    role: "vendor",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: ObjectId(),
    name: "Lisa Garcia",
    email: "lisa.garcia@meditation.com",
    passwordHash: "$2b$10$3BBDrvp17wFVuvtERKaLwuAdZcvApTRy3hSH3rHyYEraqEFrQ8luq",
    role: "vendor",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: ObjectId(),
    name: "David Wilson",
    email: "david.wilson@nutrition.com",
    passwordHash: "$2b$10$3BBDrvp17wFVuvtERKaLwuAdZcvApTRy3hSH3rHyYEraqEFrQ8luq",
    role: "vendor",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]);

// Insert sample event types
db.eventtypes.insertMany([
  {
    _id: ObjectId(),
    name: "Yoga Class",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: ObjectId(),
    name: "Meditation Workshop",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: ObjectId(),
    name: "Nutrition Seminar",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: ObjectId(),
    name: "Fitness Training",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: ObjectId(),
    name: "Mental Health Talk",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]);

// Get user and event type IDs for reference
const hr1 = db.users.findOne({ email: "john.smith@company.com" })._id;
const hr2 = db.users.findOne({ email: "sarah.johnson@company.com" })._id;
const vendor1 = db.users.findOne({ email: "mike.chen@yogastudio.com" })._id;
const vendor2 = db.users.findOne({ email: "lisa.garcia@meditation.com" })._id;
const vendor3 = db.users.findOne({ email: "david.wilson@nutrition.com" })._id;

const yogaType = db.eventtypes.findOne({ name: "Yoga Class" })._id;
const meditationType = db.eventtypes.findOne({ name: "Meditation Workshop" })._id;
const nutritionType = db.eventtypes.findOne({ name: "Nutrition Seminar" })._id;
const fitnessType = db.eventtypes.findOne({ name: "Fitness Training" })._id;
const mentalHealthType = db.eventtypes.findOne({ name: "Mental Health Talk" })._id;

// Insert sample wellness events
db.wellnessevents.insertMany([
  {
    _id: ObjectId(),
    hr: hr1,
    vendor: vendor1,
    eventType: yogaType,
    proposedDates: [new Date("2024-03-15"), new Date("2024-03-16"), new Date("2024-03-17")],
    proposedLocation: {
      postalCode: "12345",
      street: "123 Wellness Street, Downtown",
    },
    status: "Pending",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: ObjectId(),
    hr: hr1,
    vendor: vendor2,
    eventType: meditationType,
    proposedDates: [new Date("2024-03-20"), new Date("2024-03-21"), new Date("2024-03-22")],
    proposedLocation: {
      postalCode: "12345",
      street: "456 Peace Avenue, Downtown",
    },
    status: "Approved",
    confirmedDate: new Date("2024-03-20"),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: ObjectId(),
    hr: hr2,
    vendor: vendor3,
    eventType: nutritionType,
    proposedDates: [new Date("2024-03-25"), new Date("2024-03-26"), new Date("2024-03-27")],
    proposedLocation: {
      postalCode: "67890",
      street: "789 Health Boulevard, Uptown",
    },
    status: "Rejected",
    remarks: "Dates conflict with company retreat",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: ObjectId(),
    hr: hr2,
    vendor: vendor1,
    eventType: fitnessType,
    proposedDates: [new Date("2024-04-01"), new Date("2024-04-02"), new Date("2024-04-03")],
    proposedLocation: {
      postalCode: "67890",
      street: "321 Fitness Road, Uptown",
    },
    status: "Pending",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: ObjectId(),
    hr: hr1,
    vendor: vendor2,
    eventType: mentalHealthType,
    proposedDates: [new Date("2024-04-10"), new Date("2024-04-11"), new Date("2024-04-12")],
    proposedLocation: {
      postalCode: "12345",
      street: "654 Mind Street, Downtown",
    },
    status: "Pending",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]);

// Create indexes for better performance
db.users.createIndex({ email: 1 }, { unique: true });
db.eventtypes.createIndex({ name: 1 }, { unique: true });
db.wellnessevents.createIndex({ hr: 1 });
db.wellnessevents.createIndex({ vendor: 1 });
db.wellnessevents.createIndex({ status: 1 });
db.wellnessevents.createIndex({ proposedDates: 1 });

print("Database 'wellness-events' initialized with sample data!");
print("Created collections: users, eventtypes, wellnessevents");
print("Sample data includes:");
print("- 5 users (2 HR, 3 vendors)");
print("- 5 event types");
print("- 5 wellness events with various statuses");
print("All users have password: 'password123'");
