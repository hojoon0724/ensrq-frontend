import mongoose from "mongoose";

const ticketLinkSchema = new mongoose.Schema(
  {
    price: { type: Number, min: 0 },
    url: { type: String, trim: true, required: true },
  },
  { _id: false }
);

const seasonSchema = new mongoose.Schema(
  {
    seasonId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    year: {
      type: String,
      required: true,
      trim: true,
    },
    concerts: [
      {
        type: String,
        required: true,
        ref: "Concert",
        trim: true,
      },
    ],
    ticketsLinks: {
      seasonLive: { type: ticketLinkSchema, required: true },
      seasonStreaming: { type: ticketLinkSchema, required: true },
    },
    youTubeUrl: { type: String, trim: true, required: true },
    seasonStreamingPagePassword: { type: String, trim: true, required: true },
    seasonStreamingPageUrl: { type: String, trim: true, required: true },
  },
  {
    timestamps: true,
    collection: "seasons",
  }
);

const Season = mongoose.models.Season || mongoose.model("Season", seasonSchema);

export default Season;
