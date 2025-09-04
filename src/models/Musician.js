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
    instrument: {
      type: String,
      trim: true,
    },
    bio: {
      type: String,
      trim: true,
    },
    photos: [
      {
        type: String,
        trim: true,
      },
    ],
    preferredPhoto: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    collection: "musicians",
  }
);

const Musician = mongoose.models.Musician || mongoose.model("Musician", musicianSchema);

export default Musician;
