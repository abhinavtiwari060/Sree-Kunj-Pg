import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITestimonial extends Document {
  name: string;
  university: string;
  course?: string;
  videoUrl: string;
  posterUrl?: string;
  text?: string;
  rating: number;
  order: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    name: { type: String, required: true, trim: true },
    university: { type: String, default: 'JECRC University' },
    course: { type: String, default: 'B.Tech CSE' },
    videoUrl: { type: String, required: true },
    posterUrl: { type: String, default: '' },
    text: { type: String, default: '' },
    rating: { type: Number, default: 5, min: 1, max: 5 },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Testimonial: Model<ITestimonial> =
  mongoose.models.Testimonial || mongoose.model<ITestimonial>('Testimonial', TestimonialSchema);
