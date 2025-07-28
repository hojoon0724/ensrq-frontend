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
    address: {
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
    description: {
      type: String,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    collection: "venues",
  }
);

// Index for efficient queries
venueSchema.index({ venueId: 1 });
venueSchema.index({ name: 1 });
venueSchema.index({ city: 1, state: 1 });
venueSchema.index({ "coordinates.latitude": 1, "coordinates.longitude": 1 });

const Venue = mongoose.models.Venue || mongoose.model("Venue", venueSchema);

export default Venue;
