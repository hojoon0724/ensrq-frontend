import mongoose from "mongoose";

const ticketLinkSchema = new mongoose.Schema(
  {
    price: { type: Number, min: 0 },
    url: { type: String, trim: true },
  },
  { _id: false }
);

const programItemSchema = new mongoose.Schema(
  {
    workId: { type: String, required: true, ref: "Work", trim: true },
    is_premiere: { type: Boolean },
    premiere_text: { type: String, trim: true },
    is_commission: { type: Boolean },
    commission_text: { type: String, trim: true },
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
    concertId: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, trim: true },
    description: { type: String, trim: true },
    shortDescription: { type: String, trim: true },
    oneLiner: { type: String, trim: true },
    date: { type: Date, required: true },
    time: { type: String, trim: true },
    seasonId: { type: String, ref: "Season", trim: true },
    venueId: { type: String, ref: "Venue", trim: true },
    ticketsLinks: { singleLive: ticketLinkSchema, singleStreaming: ticketLinkSchema },
    youTubeUrl: { type: String, trim: true },
    streamingPagePassword: { type: String, trim: true },
    streamingPageUrl: { type: String, trim: true },
    sponsors: { type: String, trim: true },
    program: [programItemSchema],
    status: { type: String, enum: ["upcoming", "completed", "cancelled", "postponed"], default: "upcoming" },
    coPresented: [
      {
        name: { type: String, required: true, trim: true },
        logoFileName: { type: String, trim: true },
      },
    ],
    additionalPhotos: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
    collection: "concerts",
  }
);

const Concert = mongoose.models.Concert || mongoose.model("Concert", concertSchema);

export default Concert;
