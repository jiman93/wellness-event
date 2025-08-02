import { Event } from "../models/Event";

describe("Event Model", () => {
  it("should create a valid event", async () => {
    const validEvent = {
      title: "Test Event",
      description: "A test event description",
      date: new Date("2024-12-31"),
      time: "10:00 AM",
      location: "Test Location",
      maxAttendees: 20,
      category: "wellness",
      instructor: "Test Instructor",
      price: 25,
    };

    const event = new Event(validEvent);
    const savedEvent = await event.save();

    expect(savedEvent.title).toBe(validEvent.title);
    expect(savedEvent.description).toBe(validEvent.description);
    expect(savedEvent.isActive).toBe(true);
    expect(savedEvent.attendees).toHaveLength(0);
  });

  it("should not create an event with invalid date", async () => {
    const invalidEvent = {
      title: "Test Event",
      description: "A test event description",
      date: new Date("2020-01-01"), // Past date
      time: "10:00 AM",
      location: "Test Location",
      maxAttendees: 20,
      category: "wellness",
    };

    const event = new Event(invalidEvent);

    await expect(event.save()).rejects.toThrow();
  });

  it("should not create an event without required fields", async () => {
    const invalidEvent = {
      title: "Test Event",
      // Missing required fields
    };

    const event = new Event(invalidEvent as any);

    await expect(event.save()).rejects.toThrow();
  });
});
