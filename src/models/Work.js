import mongoose from "mongoose";

const instrumentationSchema = new mongoose.Schema(
  {
    instrument: {
      type: String,
      required: true,
      trim: true,
    },
    count: {
      type: Number,
      default: 1,
      min: 1,
    },
  },
  { _id: false }
);

const workSchema = new mongoose.Schema(
  {
    workId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    composerId: {
      type: String,
      required: true,
      ref: "Composer",
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
    year: {
      type: String,
      trim: true,
    },
    duration: {
      type: String,
      trim: true,
    },
    movements: [
      {
        type: String,
        trim: true,
      },
    ],
    instrumentation: [instrumentationSchema],
    description: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    publishingInfo: {
      publisher: {
        type: String,
        trim: true,
      },
      rentalInfo: {
        type: String,
        trim: true,
      },
    },
  },
  {
    timestamps: true,
    collection: "works",
  }
);

// Index for efficient queries
workSchema.index({ workId: 1 });
workSchema.index({ composerId: 1 });
workSchema.index({ title: 1 });
workSchema.index({ year: 1 });
workSchema.index({ "instrumentation.instrument": 1 });

const Work = mongoose.models.Work || mongoose.model("Work", workSchema);

export default Work;
