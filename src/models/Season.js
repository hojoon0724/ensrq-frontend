import mongoose from "mongoose";

const seasonSchema = new mongoose.Schema(
  {
    seasonId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    season: {
      type: String,
      required: true,
      trim: true,
    },
    concerts: [
      {
        type: String,
        required: true,
      },
    ],
  },
  {
    timestamps: true,
    collection: "seasons",
  }
);

// Index for efficient queries
seasonSchema.index({ seasonId: 1 });
seasonSchema.index({ season: 1 });

const Season = mongoose.models.Season || mongoose.model("Season", seasonSchema);

export default Season;
