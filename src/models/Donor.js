import mongoose from "mongoose";

const donorSchema = new mongoose.Schema(
  {
    donorId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    displayName: {
      type: String,
      required: true,
      trim: true,
    },
    donorTierId: {
      type: String,
      ref: "DonorTier",
    },
  },
  {
    timestamps: true,
    collection: "donors",
  }
);

const Donor = mongoose.models.Donor || mongoose.model("Donor", donorSchema);

export default Donor;