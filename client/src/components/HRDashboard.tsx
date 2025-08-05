import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Eye, Calendar, Clock, Plus } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { EventDetailModal } from "./EventDetailModal";
import { CreateEventModal } from "./CreateEventModal";

interface WellnessEvent {
  _id: string;
  eventType?: {
    name: string;
  };
  vendor?: {
    name: string;
    email: string;
  };
  hr?: {
    name: string;
    email: string;
    companyName: string;
  };
  proposedDates: string[];
  confirmedDate?: string;
  status: "Pending" | "Approved" | "Rejected";
  createdAt: string;
  remarks?: string;
  proposedLocation: {
    postalCode: string;
    street: string;
  };
}

export function HRDashboard() {
  const { user } = useAuth();
  const [selectedEvent, setSelectedEvent] = useState<WellnessEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const {
    data: events,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["wellness-events"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const res = await fetch("/wellness-events", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch wellness events");
      const json = await res.json();
      return json.data;
    },
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatProposedDates = (dates: string[]) => {
    return dates.map((date) => formatDate(date)).join(", ");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleViewEvent = (event: WellnessEvent) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading wellness events...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold mb-2">Error loading events</p>
          <p className="text-sm">{error instanceof Error ? error.message : "An error occurred"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Company HR Dashboard</h1>
            <p className="text-gray-600">
              Manage and track wellness events for {user?.companyName}
            </p>
          </div>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Event
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Wellness Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          {events && events.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Event Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Vendor Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Date Created
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event: WellnessEvent) => (
                    <tr key={event._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="font-medium text-gray-900">
                          {event.eventType?.name || "Unknown Event Type"}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-gray-900">
                          {event.vendor?.name || "Unknown Vendor"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {event.vendor?.email || "No email"}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        {event.confirmedDate ? (
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4 text-green-600" />
                            <span className="text-green-700 font-medium">
                              {formatDate(event.confirmedDate)}
                            </span>
                          </div>
                        ) : (
                          <div className="text-sm text-gray-600">
                            {formatProposedDates(event.proposedDates)}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            event.status
                          )}`}
                        >
                          {event.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">
                        {formatDate(event.createdAt)}
                      </td>
                      <td className="py-4 px-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewEvent(event)}
                          className="flex items-center gap-1 text-sky-600 hover:text-sky-700 hover:bg-sky-50"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
              <p className="text-gray-600">No wellness events have been created yet.</p>
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="mt-4 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Event
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Event Detail Modal */}
      <EventDetailModal event={selectedEvent} isOpen={isModalOpen} onClose={handleCloseModal} />

      {/* Create Event Modal */}
      <CreateEventModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
    </div>
  );
}
