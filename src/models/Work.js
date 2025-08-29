import mongoose from "mongoose";

const instrumentationSchema = new mongoose.Schema(
  {
    instrument: {
      type: String,
      required: true,
      ref: "Instrument",
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
  },

  {
    timestamps: true,
    collection: "works",
  }
);

const Work = mongoose.models.Work || mongoose.model("Work", workSchema);

export default Work;
