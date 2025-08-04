import mongoose from "mongoose";

const venueSchema = new mongoose.Schema(
  {
    venueId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },

    street: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    zipCode: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    collection: "venues",
  }
);

const Venue = mongoose.models.Venue || mongoose.model("Venue", venueSchema);

export default Venue;
