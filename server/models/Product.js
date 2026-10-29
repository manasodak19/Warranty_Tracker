import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    category: {
      type: String,
      trim: true,
      maxlength: 80,
      default: '',
    },
    brand: {
      type: String,
      trim: true,
      maxlength: 80,
      default: '',
    },
    purchaseDate: {
      type: String,
      required: true,
      match: /^\d{4}-\d{2}-\d{2}$/,
    },
    warrantyMonths: {
      type: Number,
      required: true,
      min: 1,
      max: 1200,
      validate: Number.isInteger,
    },
    expiryDate: {
      type: String,
      required: true,
      match: /^\d{4}-\d{2}-\d{2}$/,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: '',
    },
  },
  { timestamps: true },
);

productSchema.index({ userId: 1, expiryDate: 1 });

export default mongoose.model('Product', productSchema);
