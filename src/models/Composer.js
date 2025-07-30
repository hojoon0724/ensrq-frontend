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

// Index for efficient queries
// composerSchema.index({ composerId: 1 });
// composerSchema.index({ name: 1 });
// composerSchema.index({ nationality: 1 });
// composerSchema.index({ born: 1 });

const Composer = mongoose.models.Composer || mongoose.model("Composer", composerSchema);

export default Composer;
