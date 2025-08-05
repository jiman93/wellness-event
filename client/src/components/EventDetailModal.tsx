import { useState } from "react";
import { X, Calendar, MapPin, User, Building, Clock, MessageSquare } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "../contexts/AuthContext";

interface WellnessEvent {
  _id: string;
  eventType: {
    name: string;
  };
  vendor: {
    name: string;
    email: string;
  };
  hr: {
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

interface EventDetailModalProps {
  event: WellnessEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove?: (eventId: string, confirmedDate: string) => void;
  onReject?: (eventId: string, remarks: string) => void;
  isLoading?: boolean;
}

export function EventDetailModal({
  event,
  isOpen,
  onClose,
  onApprove,
  onReject,
  isLoading = false,
}: EventDetailModalProps) {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [rejectReason, setRejectReason] = useState<string>("");
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [showDateSelector, setShowDateSelector] = useState(false);

  const isVendor = user?.role === "vendor";
  const canTakeAction = isVendor && event?.status === "Pending";

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
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

  const handleApprove = () => {
    if (!selectedDate) {
      setShowDateSelector(true);
      return;
    }
    if (onApprove && event) {
      onApprove(event._id, selectedDate);
    }
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      setShowRejectForm(true);
      return;
    }
    if (onReject && event) {
      onReject(event._id, rejectReason);
    }
  };

  const handleClose = () => {
    setSelectedDate("");
    setRejectReason("");
    setShowRejectForm(false);
    setShowDateSelector(false);
    onClose();
  };

  if (!isOpen || !event) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Event Details</h2>
          <Button
            onClick={handleClose}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Event Type */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.eventType.name}</h3>
            <span
              className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(
                event.status
              )}`}
            >
              {event.status}
            </span>
          </div>

          {/* Event Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">
                    {isVendor ? event.hr.name : event.vendor.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {isVendor ? event.hr.email : event.vendor.email}
                  </p>
                  {isVendor && (
                    <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                      <Building className="w-4 h-4" />
                      {event.hr.companyName}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Location</p>
                  <p className="text-sm text-gray-600">{event.proposedLocation.street}</p>
                  <p className="text-sm text-gray-600">{event.proposedLocation.postalCode}</p>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4"> 
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Date & Time</p>
                  {event.confirmedDate ? (
                    <div className="flex items-center gap-1 text-sm text-green-700">
                      <Clock className="w-4 h-4" />
                      <span className="font-medium">{formatDate(event.confirmedDate)}</span>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-600">
                      <p className="font-medium mb-1">Proposed Dates:</p>
                      {event.proposedDates.map((date, index) => (
                        <p key={index} className="text-sm">
                          {formatDate(date)} at {formatTime(date)}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Created</p>
                  <p className="text-sm text-gray-600">{formatDate(event.createdAt)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Remarks */}
          {event.remarks && (
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <MessageSquare className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900 mb-1">Remarks</p>
                <p className="text-sm text-gray-600">{event.remarks}</p>
              </div>
            </div>
          )}

          {/* Vendor Actions */}
          {canTakeAction && (
            <div className="border-t pt-6 space-y-4">
              <h4 className="font-semibold text-gray-900">Actions</h4>

              {/* Date Selection for Approval */}
              {showDateSelector && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-900 mb-3">
                    Select a date to approve:
                  </p>
                  <div className="space-y-2">
                    {event.proposedDates.map((date, index) => (
                      <label key={index} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="selectedDate"
                          value={date}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          className="text-sky-600"
                        />
                        <span className="text-sm">
                          {formatDate(date)} at {formatTime(date)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Reject Reason Form */}
              {showRejectForm && (
                <div className="p-4 bg-red-50 rounded-lg">
                  <p className="text-sm font-medium text-red-900 mb-3">
                    Please provide a reason for rejection:
                  </p>
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Enter rejection reason..."
                    className="w-full p-3 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
                    rows={3}
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={handleApprove}
                  disabled={isLoading || (showDateSelector && !selectedDate)}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {isLoading ? "Approving..." : "Approve"}
                </Button>
                <Button
                  onClick={handleReject}
                  disabled={isLoading || (showRejectForm && !rejectReason.trim())}
                  variant="outline"
                  className="border-red-300 text-red-600 hover:bg-red-50"
                >
                  {isLoading ? "Rejecting..." : "Reject"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
