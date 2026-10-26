const mongoose = require("mongoose");
const { User } = require("./User");

const propertySchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
      required: true,
    },
    deletedAt: { type: Date, default: null },
    title: {
      type: String,
      trim: true,
      required: true,
      minlength: 10,
      maxlength: 150,
    },
    description: {
      type: String,
      trim: true,
      minlength: 10,
      maxlength: 5000,
    },
    listingType: {
      type: String,
      required: true,
      enum: ["Buy", "Rent"],
    },
    propertyType: {
      type: String,
      required: true,
      enum: ["Flat", "Villa", "Plot", "FarmHouse", "Other"],
    },
    bedrooms: {
      type: Number,
      required: true,
      min: 0,
    },
    bathrooms: {
      type: Number,
      required: true,
      min: 0,
    },
    balconies: {
      type: Number,
      required: true,
      min: 0,
    },
    builtUpArea: {
      type: Number,
      required: true,
      min: 0,
    },
    floorNumber: {
      type: Number,
      required: true,
      min: 0,
    },
    totalFloors: {
      type: Number,
      required: true,
      min: 0,
    },
    propertyAge: { type: Number, min: 0 },
    facing: { type: String, enum: ["", "North", "South", "East", "West", "North-East", "North-West", "South-East", "South-West"] },
    images: [{
      url: { type: String, required: true },
      publicId: { type: String, required: true },
    }],
    address: {
      formattedAddress: { type: String, trim: true },
      latitude: { type: Number, min: -90, max: 90 },
      longitude: { type: Number, min: -180, max: 180 },
      googlePlaceId: {
        type: String,
        trim: true,
      },
      countryCode: {
        type: String,
        trim: true,
      },
      state: {
        type: String,
        trim: true,
        required: true,
      },
      city: {
        type: String,
        trim: true,
        required: true,
      },
      locality: {
        type: String,
        trim: true,
      },
      pincode: {
        type: String,
        trim: true,
      },
      buildingName: {
        type: String,
        trim: true,
      },
      addressLine: {
        type: String,
        trim: true,
      },
      unitNumber: {
        type: String,
      },
      landmark: {
        type: String,
      },
    },
    furnishings: {
      type: Array,
    },
    amenities: {
      type: Array,
    },
    parking: {
      type: String,
      required: true,
      enum: ["none", "two_wheeler", "four_wheeler", "both"],
    },
    price: {
      type: Number,
      required: true,
      min: 1,
    },
    maintenance: {
      type: Number,
      min: 0,
    },
  },

  {
    timestamps: true,
  },
);

propertySchema.index({ deletedAt: 1, createdAt: -1, _id: -1 });
propertySchema.index({ ownerId: 1, deletedAt: 1, createdAt: -1 });
propertySchema.index({ deletedAt: 1, listingType: 1, price: 1 });
const Property = mongoose.model("Property", propertySchema);

module.exports = { Property };
