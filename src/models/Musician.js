import mongoose from "mongoose";

const musicianSchema = new mongoose.Schema(
  {
    musicianId: {
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
    instruments: [
      {
        type: String,
        trim: true,
      },
    ],
    bio: {
      type: String,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
  },
  {
    timestamps: true,
    collection: "musicians",
  }
);

// Index for efficient queries
// musicianSchema.index({ musicianId: 1 });
// musicianSchema.index({ name: 1 });
// musicianSchema.index({ instruments: 1 });

const Musician = mongoose.models.Musician || mongoose.model("Musician", musicianSchema);

export default Musician;
