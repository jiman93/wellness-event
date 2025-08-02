import { Routes, Route } from "react-router-dom";
import { Calendar, Users, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

function HomePage() {
  const events = [
    {
      id: 1,
      title: "Mindful Meditation Workshop",
      description:
        "Join us for a peaceful meditation session to reduce stress and improve mental clarity.",
      date: "2024-01-15",
      time: "10:00 AM",
      location: "Wellness Center",
      attendees: 25,
      maxAttendees: 30,
    },
    {
      id: 2,
      title: "Yoga Flow Class",
      description:
        "A dynamic vinyasa flow class suitable for all levels to improve flexibility and strength.",
      date: "2024-01-16",
      time: "6:00 PM",
      location: "Studio A",
      attendees: 18,
      maxAttendees: 20,
    },
    {
      id: 3,
      title: "Nutrition Workshop",
      description: "Learn about healthy eating habits and meal planning for optimal wellness.",
      date: "2024-01-17",
      time: "2:00 PM",
      location: "Conference Room",
      attendees: 12,
      maxAttendees: 25,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Wellness Event Platform</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover and join wellness events to improve your physical and mental health
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Card key={event.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl">{event.title}</CardTitle>
                <CardDescription>{event.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  {new Date(event.date).toLocaleDateString()}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  {event.time}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  {event.location}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="w-4 h-4 mr-2" />
                  {event.attendees}/{event.maxAttendees} attendees
                </div>
                <div className="pt-2">
                  <Button className="w-full">Join Event</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
    </Routes>
  );
}

export default App;
