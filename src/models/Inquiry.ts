import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IInquiry extends Document {
  inquiryId: string;
  name: string;
  phone: string;
  email?: string;
  room?: string;
  inquiryType: 'Room availability' | 'Pricing' | 'Physical visit' | 'Video call visit' | 'General inquiry';
  message: string;
  status: 'New' | 'Contacted' | 'Resolved' | 'Closed';
  createdAt: Date;
  updatedAt: Date;
}

const InquirySchema = new Schema<IInquiry>(
  {
    inquiryId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true },
    room: { type: String, default: '' },
    inquiryType: {
      type: String,
      enum: ['Room availability', 'Pricing', 'Physical visit', 'Video call visit', 'General inquiry'],
      default: 'General inquiry',
    },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Resolved', 'Closed'],
      default: 'New',
    },
  },
  { timestamps: true }
);

export const Inquiry: Model<IInquiry> =
  mongoose.models.Inquiry || mongoose.model<IInquiry>('Inquiry', InquirySchema);
