import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBooking extends Document {
  bookingId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  residentName: string;
  residentPhone: string;
  relationship: 'Self' | 'Sister' | 'Daughter' | 'Friend' | 'Relative' | 'Other';
  floor: number;
  room?: mongoose.Types.ObjectId;
  roomNumber: string;
  preferredMoveInDate: string;
  message?: string;
  status: 'Waiting' | 'Booked' | 'Unbooked' | 'Cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    bookingId: { type: String, required: true, unique: true, index: true },
    customerName: { type: String, required: true, trim: true },
    customerPhone: { type: String, required: true, trim: true },
    customerEmail: { type: String, trim: true },
    residentName: { type: String, required: true, trim: true },
    residentPhone: { type: String, required: true, trim: true },
    relationship: {
      type: String,
      enum: ['Self', 'Sister', 'Daughter', 'Friend', 'Relative', 'Other'],
      default: 'Self',
    },
    floor: { type: Number, required: true },
    room: { type: Schema.Types.ObjectId, ref: 'Room' },
    roomNumber: { type: String, required: true },
    preferredMoveInDate: { type: String, required: true },
    message: { type: String, default: '' },
    status: {
      type: String,
      enum: ['Waiting', 'Booked', 'Unbooked', 'Cancelled'],
      default: 'Waiting',
    },
  },
  { timestamps: true }
);

export const Booking: Model<IBooking> =
  mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);
