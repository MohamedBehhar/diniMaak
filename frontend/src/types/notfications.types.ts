// CREATE TYPE notifications_type AS ENUM ('rating', 'comment', 'bookingConfirmed', 'bookingCanceled', 'requestAccepted', 'requestRejected', 'requestCanceled', 'chat', 'carpoolingPublished');

// create types for frontend same as backend

// Path: frontend/src/types/notifications.types.ts
 type NotificationType = "rating" | "comment" | "bookingConfirmed" | "bookingCanceled" | "requestAccepted" | "requestRejected" | "requestCanceled" | "chat" | "carpoolingPublished";


 
export interface Notification {
  id: number;
  type: NotificationType;
  message: string;
  user_id: number;
  carpooling_id: number;
  created_at: string;
  updated_at: string;
}
 