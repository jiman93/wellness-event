// MongoDB initialization script
db = db.getSiblingDB("wellness-events");

// Create collections
db.createCollection("events");

// Insert sample events
db.events.insertMany([
  {
    title: "Mindful Meditation Workshop",
    description:
      "Join us for a peaceful meditation session to reduce stress and improve mental clarity.",
    date: new Date("2024-02-15"),
    time: "10:00 AM",
    location: "Wellness Center",
    maxAttendees: 30,
    attendees: ["John Doe", "Jane Smith", "Mike Johnson"],
    category: "meditation",
    instructor: "Sarah Wilson",
    price: 25,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Yoga Flow Class",
    description:
      "A dynamic vinyasa flow class suitable for all levels to improve flexibility and strength.",
    date: new Date("2024-02-16"),
    time: "6:00 PM",
    location: "Studio A",
    maxAttendees: 20,
    attendees: ["Alice Brown", "Bob Davis", "Carol White"],
    category: "yoga",
    instructor: "David Chen",
    price: 20,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Nutrition Workshop",
    description: "Learn about healthy eating habits and meal planning for optimal wellness.",
    date: new Date("2024-02-17"),
    time: "2:00 PM",
    location: "Conference Room",
    maxAttendees: 25,
    attendees: ["Emma Wilson", "Frank Miller"],
    category: "nutrition",
    instructor: "Dr. Lisa Garcia",
    price: 35,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]);

// Create indexes for better performance
db.events.createIndex({ date: 1, isActive: 1 });
db.events.createIndex({ category: 1, isActive: 1 });

print("Database 'wellness-events' initialized with sample data!");
