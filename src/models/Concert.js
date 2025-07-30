import mongoose from "mongoose";

const ticketLinkSchema = new mongoose.Schema(
  {
    price: {
      type: Number,
      min: 0,
    },
    url: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const programItemSchema = new mongoose.Schema(
  {
    workId: {
      type: String,
      required: true,
      ref: "Work",
      trim: true,
    },
    is_premiere: {
      type: Boolean,
      default: false,
    },
    is_commission: {
      type: Boolean,
      default: false,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const performerInstrumentSchema = new mongoose.Schema(
  {
    instrument: {
      type: String,
      required: true,
      trim: true,
    },
    musicians: [
      {
        type: String,
        ref: "Musician",
        trim: true,
      },
    ],
  },
  { _id: false }
);

const concertSchema = new mongoose.Schema(
  {
    concertId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subtitle: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
    seasonId: {
      type: String,
      ref: "Season",
      trim: true,
    },
    venueId: {
      type: String,
      ref: "Venue",
      trim: true,
    },
    ticketsLinks: {
      singleLive: ticketLinkSchema,
      singleStreaming: ticketLinkSchema,
      seasonPass: ticketLinkSchema,
    },
    streamingPageAccessPassword: {
      type: String,
      trim: true,
    },
    sponsors: [
      {
        type: String,
        trim: true,
      },
    ],
    program: [programItemSchema],
    performers: [
      {
        workId: {
          type: String,
          required: true,
          trim: true,
        },
        instruments: [performerInstrumentSchema],
      },
    ],
    status: {
      type: String,
      enum: ["upcoming", "completed", "cancelled", "postponed"],
      default: "upcoming",
    },
    recordings: {
      audio: {
        type: String,
        trim: true,
      },
      video: {
        type: String,
        trim: true,
      },
    },
  },
  {
    timestamps: true,
    collection: "concerts",
  }
);

// Index for efficient queries
// concertSchema.index({ concertId: 1 });
// concertSchema.index({ date: 1 });
// concertSchema.index({ seasonId: 1 });
// concertSchema.index({ venueId: 1 });
// concertSchema.index({ title: 1 });
// concertSchema.index({ status: 1 });
// concertSchema.index({ "program.workId": 1 });

const Concert = mongoose.models.Concert || mongoose.model("Concert", concertSchema);

export default Concert;
