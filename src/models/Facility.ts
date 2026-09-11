import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IFacility extends Document {
  name: string;
  category: string;
  description: string;
  imageUrl: string;
  icon: string;
  order: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FacilitySchema = new Schema<IFacility>(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, default: 'Essential' },
    description: { type: String, required: true },
    imageUrl: { type: String, default: '' },
    icon: { type: String, default: 'Sparkles' },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Facility: Model<IFacility> =
  mongoose.models.Facility || mongoose.model<IFacility>('Facility', FacilitySchema);
