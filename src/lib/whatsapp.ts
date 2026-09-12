export interface BookingWhatsAppDetails {
  bookingId: string;
  customerName: string;
  residentName: string;
  residentPhone: string;
  relationship: string;
  floor: string | number;
  roomNumber: string;
  preferredDate: string;
  message?: string;
}

export interface VisitWhatsAppDetails {
  visitId: string;
  name: string;
  phone: string;
  visitType: 'Physical Visit' | 'Video Call Visit';
  preferredDate: string;
  preferredTime: string;
  message?: string;
}

export interface InquiryWhatsAppDetails {
  name: string;
  phone: string;
  room?: string;
  inquiryType: string;
  message?: string;
}

export function buildWhatsAppBookingUrl(
  whatsappNumber: string,
  details: BookingWhatsAppDetails
): string {
  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');
  const text = `Hello Shri Kunj Girls PG,

I have submitted a room booking request on your website.

📋 *Booking ID:* ${details.bookingId}
👤 *Booked By:* ${details.customerName}
🏢 *Floor:* Floor ${details.floor}
🚪 *Room Number:* ${details.roomNumber}
👩 *Resident Name:* ${details.residentName}
📞 *Resident Phone:* ${details.residentPhone}
🤝 *Relationship:* ${details.relationship}
📅 *Preferred Move-in Date:* ${details.preferredDate}
${details.message ? `💬 *Note:* ${details.message}\n` : ''}
Please confirm my booking request. Thank you!`;

  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
}

export function buildWhatsAppVisitUrl(
  whatsappNumber: string,
  details: VisitWhatsAppDetails
): string {
  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');
  const text = `Hello Shri Kunj Girls PG,

I would like to schedule a PG visit.

🏷️ *Visit ID:* ${details.visitId}
👤 *Name:* ${details.name}
📞 *Phone:* ${details.phone}
📍 *Visit Mode:* ${details.visitType}
📅 *Preferred Date:* ${details.preferredDate}
⏰ *Preferred Time:* ${details.preferredTime}
${details.message ? `💬 *Special Request:* ${details.message}\n` : ''}
Please let me know if this slot is available. Thank you!`;

  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
}

export function buildWhatsAppGeneralUrl(
  whatsappNumber: string,
  details: InquiryWhatsAppDetails
): string {
  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');
  const text = `Hello Shri Kunj Girls PG,

I have an inquiry regarding accommodation near JECRC / Poornima University.

👤 *Name:* ${details.name}
📞 *Phone:* ${details.phone}
📌 *Inquiry Type:* ${details.inquiryType}
${details.room ? `🚪 *Interested Room:* ${details.room}\n` : ''}${details.message ? `💬 *Message:* ${details.message}\n` : ''}
Looking forward to hearing from you!`;

  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
}
