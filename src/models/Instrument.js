import mongoose from "mongoose";

const instrumentSchema = new mongoose.Schema(
  {
    instrumentId: {
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
    displayName: {
      type: String,
      required: true,
      trim: true,
    },
    plural: {
      type: String,
      trim: true,
    }
  },
  {
    timestamps: true,
    collection: "instruments",
  }
);

const Instrument = mongoose.models.Instrument || mongoose.model("Instrument", instrumentSchema);

export default Instrument;
