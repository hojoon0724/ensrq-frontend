import mongoose from "mongoose";

const composerSchema = new mongoose.Schema(
  {
    composerId: {
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
    nationality: {
      type: String,
      trim: true,
    },
    born: {
      type: Number,
      min: 1000,
      max: new Date().getFullYear(),
    },
    died: {
      type: Number,
      min: 1000,
      max: new Date().getFullYear(),
    },
    bio: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    collection: "composers",
  }
);

const Composer = mongoose.models.Composer || mongoose.model("Composer", composerSchema);

export default Composer;
