const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    date: { type: Date, required: true },
    location: { type: String, trim: true },
    image: { type: String, trim: true },
    status: {
      type: String,
      enum: ['upcoming', 'completed', 'planning', 'cancelled'],
      default: 'upcoming',
    },
    registrationLink: { type: String, trim: true },
    agendaLink: { type: String, trim: true },
    attendanceCount: { type: Number, min: 0 },
  },
  { timestamps: true }
);

eventSchema.index({ status: 1, date: -1 });

module.exports = mongoose.model('Event', eventSchema);
