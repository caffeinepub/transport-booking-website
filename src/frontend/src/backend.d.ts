import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface BookingRecord {
    id: BookingId;
    status: BookingStatus;
    createdAt: bigint;
    details: BookingDetails;
}
export type BookingId = bigint;
export interface BookingDetails {
    dropoff: string;
    date: string;
    name: string;
    time: string;
    pickup: string;
    notes: string;
    vehicle: string;
    phone: string;
}
export interface UserProfile {
    name: string;
}
export enum BookingStatus {
    cancelled = "cancelled",
    pending = "pending",
    completed = "completed",
    confirmed = "confirmed"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteBooking(bookingId: BookingId): Promise<boolean>;
    getAllBookingsForAdmin(): Promise<Array<BookingRecord>>;
    getBookingStatusById(bookingId: BookingId): Promise<BookingStatus | null>;
    getBookingsByPhone(phone: string): Promise<Array<BookingRecord>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getUserIdByName(name: string): Promise<Principal | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitBooking(details: BookingDetails): Promise<BookingId>;
    updateBookingStatus(bookingId: BookingId, newStatus: BookingStatus): Promise<boolean>;
}
