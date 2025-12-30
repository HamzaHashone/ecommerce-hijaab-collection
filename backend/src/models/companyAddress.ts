import mongoose from "mongoose";

const CompanyAddressSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  street1: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  zip: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
}, { timestamps: true });

export const CompanyAddress = mongoose.model("CompanyAddress", CompanyAddressSchema);

export default CompanyAddress;