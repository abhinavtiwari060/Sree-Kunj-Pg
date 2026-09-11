import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IVisit extends Document {
  visitId: string;
  name: string;
  phone: string;
  email?: string;
  visitType: 'Physical Visit' | 'Video Call Visit';
  preferredDate: string;
  preferredTime: string;
  message?: string;
  status: 'Waiting' | 'Confirmed' | 'Completed' | 'Cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const VisitSchema = new Schema<IVisit>(
  {
    visitId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true },
    visitType: {
      type: String,
      enum: ['Physical Visit', 'Video Call Visit'],
      default: 'Physical Visit',
    },
    preferredDate: { type: String, required: true },
    preferredTime: { type: String, required: true },
    message: { type: String, default: '' },
    status: {
      type: String,
      enum: ['Waiting', 'Confirmed', 'Completed', 'Cancelled'],
      default: 'Waiting',
    },
  },
  { timestamps: true }
);

export const Visit: Model<IVisit> =
  mongoose.models.Visit || mongoose.model<IVisit>('Visit', VisitSchema);
