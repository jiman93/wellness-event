import { useState } from "react";
import { X, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "../config/api";

interface EventType {
  _id: string;
  name: string;
}

interface Vendor {
  _id: string;
  name: string;
  email: string;
}

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateEventModal({ isOpen, onClose }: CreateEventModalProps) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    eventType: "",
    vendor: "",
    proposedDates: ["", "", ""],
    proposedLocation: {
      street: "",
      postalCode: "",
    },
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch event types
  const { data: eventTypes, isLoading: loadingEventTypes } = useQuery({
    queryKey: ["event-types"],
    queryFn: async () => {
      const data = await apiRequest("/event-types");
      return data.data;
    },
    staleTime: 0,
    refetchOnMount: true,
  });

  // Fetch vendors
  const { data: vendors, isLoading: loadingVendors } = useQuery({
    queryKey: ["vendors"],
    queryFn: async () => {
      const data = await apiRequest("/vendors");
      return data.data;
    },
    staleTime: 0,
    refetchOnMount: true,
  });

  // Create event mutation
  const createEventMutation = useMutation({
    mutationFn: async (eventData: any) => {
      const token = localStorage.getItem("token");
      const data = await apiRequest("/wellness-events", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(eventData),
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wellness-events"] });
      handleClose();
    },
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.eventType) {
      newErrors.eventType = "Event type is required";
    }

    if (!formData.vendor) {
      newErrors.vendor = "Vendor is required";
    }

    if (formData.proposedDates.some((date) => !date)) {
      newErrors.proposedDates = "All three proposed dates are required";
    }

    if (!formData.proposedLocation.street) {
      newErrors.street = "Street address is required";
    }

    if (!formData.proposedLocation.postalCode) {
      newErrors.postalCode = "Postal code is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      createEventMutation.mutate(formData);
    }
  };

  const handleClose = () => {
    setFormData({
      eventType: "",
      vendor: "",
      proposedDates: ["", "", ""],
      proposedLocation: {
        street: "",
        postalCode: "",
      },
    });
    setErrors({});
    onClose();
  };

  const updateProposedDate = (index: number, value: string) => {
    const newDates = [...formData.proposedDates];
    newDates[index] = value;
    setFormData({ ...formData, proposedDates: newDates });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Create Wellness Event</h2>
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
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Event Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Event Type *</label>
            <select
              value={formData.eventType}
              onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent ${
                errors.eventType ? "border-red-300" : "border-gray-300"
              }`}
            >
              <option value="">Select an event type</option>
              {eventTypes?.map((type: EventType) => (
                <option key={type._id} value={type._id}>
                  {type.name}
                </option>
              ))}
            </select>
            {errors.eventType && <p className="text-sm text-red-600 mt-1">{errors.eventType}</p>}
          </div>

          {/* Vendor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Vendor *</label>
            <select
              value={formData.vendor}
              onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent ${
                errors.vendor ? "border-red-300" : "border-gray-300"
              }`}
            >
              <option value="">Select a vendor</option>
              {vendors?.map((vendor: Vendor) => (
                <option key={vendor._id} value={vendor._id}>
                  {vendor.name} ({vendor.email})
                </option>
              ))}
            </select>
            {errors.vendor && <p className="text-sm text-red-600 mt-1">{errors.vendor}</p>}
          </div>

          {/* Proposed Dates */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Proposed Dates * (Select 3 dates)
            </label>
            <div className="space-y-3">
              {formData.proposedDates.map((date, index) => (
                <div key={index}>
                  <input
                    type="datetime-local"
                    value={date}
                    onChange={(e) => updateProposedDate(index, e.target.value)}
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent ${
                      errors.proposedDates ? "border-red-300" : "border-gray-300"
                    }`}
                  />
                </div>
              ))}
            </div>
            {errors.proposedDates && (
              <p className="text-sm text-red-600 mt-1">{errors.proposedDates}</p>
            )}
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Street Address *
              </label>
              <input
                type="text"
                value={formData.proposedLocation.street}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    proposedLocation: { ...formData.proposedLocation, street: e.target.value },
                  })
                }
                placeholder="Enter street address"
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent ${
                  errors.street ? "border-red-300" : "border-gray-300"
                }`}
              />
              {errors.street && <p className="text-sm text-red-600 mt-1">{errors.street}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code *</label>
              <input
                type="text"
                value={formData.proposedLocation.postalCode}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    proposedLocation: { ...formData.proposedLocation, postalCode: e.target.value },
                  })
                }
                placeholder="Enter postal code"
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent ${
                  errors.postalCode ? "border-red-300" : "border-gray-300"
                }`}
              />
              {errors.postalCode && (
                <p className="text-sm text-red-600 mt-1">{errors.postalCode}</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={createEventMutation.isPending || loadingEventTypes || loadingVendors}
              className="flex-1 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white"
            >
              {createEventMutation.isPending ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Creating...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Event
                </div>
              )}
            </Button>
            <Button type="button" onClick={handleClose} variant="outline" className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
