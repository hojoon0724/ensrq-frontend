import mongoose from "mongoose";

const donorTierSchema = new mongoose.Schema(
  {
    donorTierId: { type: String, required: true, unique: true },
    label: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  },
  {
    collection: "donorTiers",
  }
);

const DonorTier = mongoose.models.DonorTier || mongoose.model("DonorTier", donorTierSchema);

export default DonorTier;
