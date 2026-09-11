import bcrypt from 'bcryptjs';
import { connectToDatabase, isDbConnected } from './mongodb';
import { Room, IRoom } from '@/models/Room';
import { Booking, IBooking } from '@/models/Booking';
import { Visit, IVisit } from '@/models/Visit';
import { Inquiry, IInquiry } from '@/models/Inquiry';
import { Testimonial, ITestimonial } from '@/models/Testimonial';
import { Facility, IFacility } from '@/models/Facility';
import { SiteSettings, ISiteSettings } from '@/models/SiteSettings';
import { Admin, IAdmin } from '@/models/Admin';
import { defaultRooms, defaultFacilities, defaultTestimonials, defaultSettings } from './sampleData';

// Global in-memory fallback store
interface MemoryStore {
  rooms: any[];
  bookings: any[];
  visits: any[];
  inquiries: any[];
  testimonials: any[];
  facilities: any[];
  settings: any;
  admin: any;
  isInitialized: boolean;
}

declare global {
  // eslint-disable-next-line no-var
  var memoryStore: MemoryStore | undefined;
}

if (!global.memoryStore) {
  global.memoryStore = {
    rooms: defaultRooms.map((r, i) => ({
      _id: `mem_room_${i + 1}`,
      ...r,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })),
    bookings: [
      {
        _id: 'mem_book_1',
        bookingId: 'GPG-2026-7841',
        customerName: 'Rajesh Sharma',
        customerPhone: '9829012345',
        customerEmail: 'rajesh.sharma@example.com',
        residentName: 'Ananya Sharma',
        residentPhone: '9829012346',
        relationship: 'Daughter',
        floor: 1,
        roomNumber: '101',
        preferredMoveInDate: '2026-09-20',
        message: 'Need quiet room near study corridor for JECRC B.Tech batch.',
        status: 'Waiting',
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      },
      {
        _id: 'mem_book_2',
        bookingId: 'GPG-2026-9214',
        customerName: 'Simran Kaur',
        customerPhone: '9988776655',
        customerEmail: 'simran@example.com',
        residentName: 'Simran Kaur',
        residentPhone: '9988776655',
        relationship: 'Self',
        floor: 2,
        roomNumber: '201',
        preferredMoveInDate: '2026-10-01',
        message: 'Requesting room tour verification.',
        status: 'Booked',
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      },
    ],
    visits: [
      {
        _id: 'mem_vst_1',
        visitId: 'VST-2026-4102',
        name: 'Priyanka Agarwal',
        phone: '9876543210',
        email: 'priyanka@example.com',
        visitType: 'Video Call Visit',
        preferredDate: '2026-09-15',
        preferredTime: '04:30 PM',
        message: 'Looking for twin sharing on 2nd or 3rd floor.',
        status: 'Waiting',
        createdAt: new Date().toISOString(),
      },
      {
        _id: 'mem_vst_2',
        visitId: 'VST-2026-8912',
        name: 'Dr. Sunita Rathore',
        phone: '9112233445',
        email: 'sunita.rathore@example.com',
        visitType: 'Physical Visit',
        preferredDate: '2026-09-16',
        preferredTime: '11:00 AM',
        message: 'Visiting with daughter joining Poornima University.',
        status: 'Confirmed',
        createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
      },
    ],
    inquiries: [
      {
        _id: 'mem_inq_1',
        inquiryId: 'INQ-2026-1043',
        name: 'Kavita Joshi',
        phone: '9414012345',
        email: 'kavita@example.com',
        room: 'Floor 1 - Room 102',
        inquiryType: 'Pricing',
        message: 'What are the charges including electricity and 4 meals?',
        status: 'New',
        createdAt: new Date().toISOString(),
      },
    ],
    testimonials: defaultTestimonials.map((t, i) => ({
      _id: `mem_test_${i + 1}`,
      ...t,
      createdAt: new Date().toISOString(),
    })),
    facilities: defaultFacilities.map((f, i) => ({
      _id: `mem_fac_${i + 1}`,
      ...f,
      createdAt: new Date().toISOString(),
    })),
    settings: {
      _id: 'mem_settings_1',
      ...defaultSettings,
      updatedAt: new Date().toISOString(),
    },
    admin: {
      _id: 'mem_admin_1',
      name: 'Girls PG Admin',
      email: process.env.ADMIN_EMAIL || 'admin@girlspg.com',
      passwordHash: bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'Admin@GirlsPG2026', 10),
      role: 'superadmin',
      createdAt: new Date().toISOString(),
    },
    isInitialized: true,
  };
}

const store = global.memoryStore;

// Ensure database is seeded once when connected to real MongoDB
export async function ensureDbSeeded() {
  const db = await connectToDatabase();
  if (!db || !isDbConnected()) return;

  try {
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin@GirlsPG2026', 10);
      await Admin.create({
        name: 'Super Admin',
        email: (process.env.ADMIN_EMAIL || 'admin@girlspg.com').toLowerCase(),
        passwordHash,
        role: 'superadmin',
      });
    }

    const settingsCount = await SiteSettings.countDocuments();
    if (settingsCount === 0) {
      await SiteSettings.create(defaultSettings);
    }

    const roomCount = await Room.countDocuments();
    if (roomCount === 0) {
      await Room.insertMany(defaultRooms);
    }

    const facilityCount = await Facility.countDocuments();
    if (facilityCount === 0) {
      await Facility.insertMany(defaultFacilities);
    }

    const testimonialCount = await Testimonial.countDocuments();
    if (testimonialCount === 0) {
      await Testimonial.insertMany(defaultTestimonials);
    }
  } catch (err) {
    console.error('Error during auto-seed:', err);
  }
}

// ----------------- DATA ACCESS METHODS -----------------

// Settings
export async function getSettings() {
  await connectToDatabase();
  if (isDbConnected()) {
    try {
      let settings = await SiteSettings.findOne();
      if (!settings) {
        settings = await SiteSettings.create(defaultSettings);
      }
      return settings.toObject();
    } catch (e) {
      console.warn('DB read error for settings, using memory:', e);
    }
  }
  return store.settings;
}

export async function updateSettings(data: Partial<ISiteSettings>) {
  await connectToDatabase();
  if (isDbConnected()) {
    try {
      const updated = await SiteSettings.findOneAndUpdate({}, data, { new: true, upsert: true });
      return updated.toObject();
    } catch (e) {
      console.warn('DB update error for settings:', e);
    }
  }
  store.settings = { ...store.settings, ...data, updatedAt: new Date().toISOString() };
  return store.settings;
}

// Rooms
export async function getRooms(filter: { floor?: number; availability?: string } = {}) {
  await connectToDatabase();
  if (isDbConnected()) {
    try {
      const query: any = {};
      if (filter.floor) query.floor = Number(filter.floor);
      if (filter.availability && filter.availability !== 'all') query.availability = filter.availability;
      return await Room.find(query).sort({ floor: 1, roomNumber: 1 }).lean();
    } catch (e) {
      console.warn('DB read error for rooms:', e);
    }
  }
  return store.rooms.filter((r) => {
    if (filter.floor && r.floor !== Number(filter.floor)) return false;
    if (filter.availability && filter.availability !== 'all' && r.availability !== filter.availability) return false;
    return true;
  });
}

export async function getRoomById(id: string) {
  await connectToDatabase();
  if (isDbConnected()) {
    try {
      return await Room.findById(id).lean();
    } catch (e) {}
  }
  return store.rooms.find((r) => r._id.toString() === id || r.roomNumber === id) || null;
}

export async function createRoom(data: any) {
  await connectToDatabase();
  if (isDbConnected()) {
    try {
      const room = await Room.create(data);
      return room.toObject();
    } catch (e) {
      console.warn('DB create error for room:', e);
    }
  }
  const newRoom = {
    _id: `mem_room_${Date.now()}`,
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  store.rooms.push(newRoom);
  return newRoom;
}

export async function updateRoom(id: string, data: any) {
  await connectToDatabase();
  if (isDbConnected()) {
    try {
      const updated = await Room.findByIdAndUpdate(id, data, { new: true }).lean();
      if (updated) return updated;
    } catch (e) {}
  }
  const index = store.rooms.findIndex((r) => r._id.toString() === id);
  if (index !== -1) {
    store.rooms[index] = { ...store.rooms[index], ...data, updatedAt: new Date().toISOString() };
    return store.rooms[index];
  }
  return null;
}

export async function deleteRoom(id: string) {
  await connectToDatabase();
  if (isDbConnected()) {
    try {
      await Room.findByIdAndDelete(id);
      return true;
    } catch (e) {}
  }
  const index = store.rooms.findIndex((r) => r._id.toString() === id);
  if (index !== -1) {
    store.rooms.splice(index, 1);
    return true;
  }
  return false;
}

// Bookings
export async function getBookings(query: any = {}) {
  await connectToDatabase();
  if (isDbConnected()) {
    try {
      return await Booking.find(query).sort({ createdAt: -1 }).lean();
    } catch (e) {}
  }
  return [...store.bookings].reverse();
}

export async function createBooking(data: any) {
  const bookingId = `GPG-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const payload = {
    ...data,
    bookingId,
    status: 'Waiting',
  };

  await connectToDatabase();
  if (isDbConnected()) {
    try {
      const doc = await Booking.create(payload);
      return doc.toObject();
    } catch (e) {
      console.warn('DB create booking error:', e);
    }
  }
  const newBooking = {
    _id: `mem_book_${Date.now()}`,
    ...payload,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  store.bookings.unshift(newBooking);
  return newBooking;
}

export async function updateBookingStatus(id: string, status: 'Waiting' | 'Booked' | 'Unbooked' | 'Cancelled') {
  await connectToDatabase();
  let booking: any = null;

  if (isDbConnected()) {
    try {
      booking = await Booking.findByIdAndUpdate(id, { status }, { new: true }).lean();
    } catch (e) {}
  }

  if (!booking) {
    const item = store.bookings.find((b) => b._id.toString() === id || b.bookingId === id);
    if (item) {
      item.status = status;
      item.updatedAt = new Date().toISOString();
      booking = item;
    }
  }

  // Room availability synchronization logic
  if (booking && booking.roomNumber) {
    const roomAvailability = status === 'Booked' ? 'Booked' : status === 'Waiting' ? 'Pending' : 'Available';
    if (isDbConnected()) {
      try {
        await Room.findOneAndUpdate({ roomNumber: booking.roomNumber }, { availability: roomAvailability });
      } catch (e) {}
    }
    const rIdx = store.rooms.findIndex((r) => r.roomNumber === booking.roomNumber);
    if (rIdx !== -1) {
      store.rooms[rIdx].availability = roomAvailability;
    }
  }

  return booking;
}

// Visits
export async function getVisits() {
  await connectToDatabase();
  if (isDbConnected()) {
    try {
      return await Visit.find().sort({ createdAt: -1 }).lean();
    } catch (e) {}
  }
  return [...store.visits].reverse();
}

export async function createVisit(data: any) {
  const visitId = `VST-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const payload = { ...data, visitId, status: 'Waiting' };

  await connectToDatabase();
  if (isDbConnected()) {
    try {
      const doc = await Visit.create(payload);
      return doc.toObject();
    } catch (e) {}
  }
  const newVisit = {
    _id: `mem_vst_${Date.now()}`,
    ...payload,
    createdAt: new Date().toISOString(),
  };
  store.visits.unshift(newVisit);
  return newVisit;
}

export async function updateVisitStatus(id: string, status: string) {
  await connectToDatabase();
  if (isDbConnected()) {
    try {
      const updated = await Visit.findByIdAndUpdate(id, { status }, { new: true }).lean();
      if (updated) return updated;
    } catch (e) {}
  }
  const item = store.visits.find((v) => v._id.toString() === id || v.visitId === id);
  if (item) {
    item.status = status;
    return item;
  }
  return null;
}

// Inquiries
export async function getInquiries() {
  await connectToDatabase();
  if (isDbConnected()) {
    try {
      return await Inquiry.find().sort({ createdAt: -1 }).lean();
    } catch (e) {}
  }
  return [...store.inquiries].reverse();
}

export async function createInquiry(data: any) {
  const inquiryId = `INQ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const payload = { ...data, inquiryId, status: 'New' };

  await connectToDatabase();
  if (isDbConnected()) {
    try {
      const doc = await Inquiry.create(payload);
      return doc.toObject();
    } catch (e) {}
  }
  const newInq = {
    _id: `mem_inq_${Date.now()}`,
    ...payload,
    createdAt: new Date().toISOString(),
  };
  store.inquiries.unshift(newInq);
  return newInq;
}

export async function updateInquiryStatus(id: string, status: string) {
  await connectToDatabase();
  if (isDbConnected()) {
    try {
      const updated = await Inquiry.findByIdAndUpdate(id, { status }, { new: true }).lean();
      if (updated) return updated;
    } catch (e) {}
  }
  const item = store.inquiries.find((i) => i._id.toString() === id || i.inquiryId === id);
  if (item) {
    item.status = status;
    return item;
  }
  return null;
}

// Facilities
export async function getFacilities() {
  await connectToDatabase();
  if (isDbConnected()) {
    try {
      return await Facility.find({ active: true }).sort({ order: 1 }).lean();
    } catch (e) {}
  }
  return store.facilities.filter((f) => f.active);
}

export async function getAllFacilitiesAdmin() {
  await connectToDatabase();
  if (isDbConnected()) {
    try {
      return await Facility.find().sort({ order: 1 }).lean();
    } catch (e) {}
  }
  return store.facilities;
}

export async function createFacility(data: any) {
  await connectToDatabase();
  if (isDbConnected()) {
    try {
      const item = await Facility.create(data);
      return item.toObject();
    } catch (e) {}
  }
  const newFac = {
    _id: `mem_fac_${Date.now()}`,
    ...data,
    createdAt: new Date().toISOString(),
  };
  store.facilities.push(newFac);
  return newFac;
}

export async function updateFacility(id: string, data: any) {
  await connectToDatabase();
  if (isDbConnected()) {
    try {
      const updated = await Facility.findByIdAndUpdate(id, data, { new: true }).lean();
      if (updated) return updated;
    } catch (e) {}
  }
  const idx = store.facilities.findIndex((f) => f._id.toString() === id);
  if (idx !== -1) {
    store.facilities[idx] = { ...store.facilities[idx], ...data };
    return store.facilities[idx];
  }
  return null;
}

export async function deleteFacility(id: string) {
  await connectToDatabase();
  if (isDbConnected()) {
    try {
      await Facility.findByIdAndDelete(id);
      return true;
    } catch (e) {}
  }
  const idx = store.facilities.findIndex((f) => f._id.toString() === id);
  if (idx !== -1) {
    store.facilities.splice(idx, 1);
    return true;
  }
  return false;
}

// Testimonials
export async function getTestimonials() {
  await connectToDatabase();
  if (isDbConnected()) {
    try {
      return await Testimonial.find({ active: true }).sort({ order: 1 }).lean();
    } catch (e) {}
  }
  return store.testimonials.filter((t) => t.active);
}

export async function getAllTestimonialsAdmin() {
  await connectToDatabase();
  if (isDbConnected()) {
    try {
      return await Testimonial.find().sort({ order: 1 }).lean();
    } catch (e) {}
  }
  return store.testimonials;
}

export async function createTestimonial(data: any) {
  await connectToDatabase();
  if (isDbConnected()) {
    try {
      const item = await Testimonial.create(data);
      return item.toObject();
    } catch (e) {}
  }
  const newTest = {
    _id: `mem_test_${Date.now()}`,
    ...data,
    createdAt: new Date().toISOString(),
  };
  store.testimonials.push(newTest);
  return newTest;
}

export async function updateTestimonial(id: string, data: any) {
  await connectToDatabase();
  if (isDbConnected()) {
    try {
      const updated = await Testimonial.findByIdAndUpdate(id, data, { new: true }).lean();
      if (updated) return updated;
    } catch (e) {}
  }
  const idx = store.testimonials.findIndex((t) => t._id.toString() === id);
  if (idx !== -1) {
    store.testimonials[idx] = { ...store.testimonials[idx], ...data };
    return store.testimonials[idx];
  }
  return null;
}

export async function deleteTestimonial(id: string) {
  await connectToDatabase();
  if (isDbConnected()) {
    try {
      await Testimonial.findByIdAndDelete(id);
      return true;
    } catch (e) {}
  }
  const idx = store.testimonials.findIndex((t) => t._id.toString() === id);
  if (idx !== -1) {
    store.testimonials.splice(idx, 1);
    return true;
  }
  return false;
}

// Admin Authentication
export async function authenticateAdmin(email: string, pass: string) {
  await connectToDatabase();
  const cleanEmail = email.toLowerCase().trim();

  if (isDbConnected()) {
    try {
      const admin = await Admin.findOne({ email: cleanEmail });
      if (admin) {
        const isMatch = await bcrypt.compare(pass, admin.passwordHash);
        if (isMatch) {
          return {
            id: admin._id.toString(),
            email: admin.email,
            name: admin.name,
            role: admin.role,
          };
        }
      }
    } catch (e) {}
  }

  // Fallback check against memory admin
  if (cleanEmail === store.admin.email.toLowerCase()) {
    const isMatch = await bcrypt.compare(pass, store.admin.passwordHash);
    if (isMatch) {
      return {
        id: store.admin._id,
        email: store.admin.email,
        name: store.admin.name,
        role: store.admin.role,
      };
    }
  }

  // Also support default admin env credentials match
  if (
    cleanEmail === (process.env.ADMIN_EMAIL || 'admin@girlspg.com').toLowerCase() &&
    pass === (process.env.ADMIN_PASSWORD || 'Admin@GirlsPG2026')
  ) {
    return {
      id: 'default_admin',
      email: cleanEmail,
      name: 'Girls PG Admin',
      role: 'superadmin',
    };
  }

  return null;
}
