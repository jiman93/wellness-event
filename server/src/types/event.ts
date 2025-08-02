export interface IEvent {
  _id?: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  location: string;
  maxAttendees: number;
  attendees: string[];
  category: string;
  instructor?: string;
  price?: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateEventRequest {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  maxAttendees: number;
  category: string;
  instructor?: string;
  price?: number;
}

export interface UpdateEventRequest extends Partial<CreateEventRequest> {
  isActive?: boolean;
}
