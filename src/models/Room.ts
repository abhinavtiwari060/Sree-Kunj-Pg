import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IRoom extends Document {
  roomNumber: string;
  floor: number; // 1, 2, 3, 4
  type: string; // e.g. "Deluxe Single AC", "Twin Sharing Luxury", "Triple Sharing Comfort"
  isAc: boolean;
  price: number;
  capacity: number;
  description: string;
  facilities: string[];
  images: string[];
  availability: 'Available' | 'Pending' | 'Booked' | 'Unavailable';
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const RoomSchema = new Schema<IRoom>(
  {
    roomNumber: { type: String, required: true, trim: true },
    floor: { type: Number, required: true, min: 1, max: 4 },
    type: { type: String, required: true },
    isAc: { type: Boolean, default: true },
    price: { type: Number, required: true },
    capacity: { type: Number, required: true, min: 1, max: 6 },
    description: { type: String, default: '' },
    facilities: [{ type: String }],
    images: [{ type: String }],
    availability: {
      type: String,
      enum: ['Available', 'Pending', 'Booked', 'Unavailable'],
      default: 'Available',
    },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Room: Model<IRoom> =
  mongoose.models.Room || mongoose.model<IRoom>('Room', RoomSchema);
