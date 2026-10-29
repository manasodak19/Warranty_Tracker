import mongoose from 'mongoose';
import Product from '../models/Product.js';
import { addMonthsToDateOnly, isValidDateOnly } from '../utils/warranty.js';

const fields = ['name', 'category', 'brand', 'purchaseDate', 'warrantyMonths', 'notes'];
const textLimits = { name: 120, category: 80, brand: 80, notes: 2000 };

function validateProduct(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return 'Product details are required.';
  }
  for (const field of Object.keys(body)) {
    if (!fields.includes(field)) {
      return `Unexpected product field: ${field}.`;
    }
  }

  if (typeof body.name !== 'string' || !body.name.trim() || body.name.trim().length > textLimits.name) {
    return 'Product name is required and must be 120 characters or fewer.';
  }
  for (const field of ['category', 'brand', 'notes']) {
    if (body[field] !== undefined && (typeof body[field] !== 'string' || body[field].length > textLimits[field])) {
      return `${field} must be text with at most ${textLimits[field]} characters.`;
    }
  }
  if (!isValidDateOnly(body.purchaseDate)) {
    return 'Enter a valid purchase date.';
  }
  if (!Number.isInteger(body.warrantyMonths) || body.warrantyMonths < 1 || body.warrantyMonths > 1200) {
    return 'Warranty duration must be a whole number between 1 and 1200 months.';
  }
  return null;
}

function productData(body, userId) {
  return {
    userId,
    name: body.name.trim(),
    category: body.category?.trim() ?? '',
    brand: body.brand?.trim() ?? '',
    purchaseDate: body.purchaseDate,
    warrantyMonths: body.warrantyMonths,
    expiryDate: addMonthsToDateOnly(body.purchaseDate, body.warrantyMonths),
    notes: body.notes?.trim() ?? '',
  };
}

function validId(id) {
  return mongoose.isValidObjectId(id);
}

export async function listProducts(req, res, next) {
  try {
    const products = await Product.find({ userId: req.user.id }).sort({ expiryDate: 1, createdAt: -1 });
    return res.json({ products });
  } catch (error) {
    return next(error);
  }
}

export async function getProduct(req, res, next) {
  if (!validId(req.params.id)) {
    return res.status(400).json({ message: 'Invalid product identifier.' });
  }
  try {
    const product = await Product.findOne({ _id: req.params.id, userId: req.user.id });
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    return res.json({ product });
  } catch (error) {
    return next(error);
  }
}

export async function createProduct(req, res, next) {
  const validationError = validateProduct(req.body);
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }
  try {
    const product = await Product.create(productData(req.body, req.user.id));
    return res.status(201).json({ product });
  } catch (error) {
    return next(error);
  }
}

export async function updateProduct(req, res, next) {
  if (!validId(req.params.id)) {
    return res.status(400).json({ message: 'Invalid product identifier.' });
  }
  const validationError = validateProduct(req.body);
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      productData(req.body, req.user.id),
      { new: true, runValidators: true },
    );
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    return res.json({ product });
  } catch (error) {
    return next(error);
  }
}

export async function deleteProduct(req, res, next) {
  if (!validId(req.params.id)) {
    return res.status(400).json({ message: 'Invalid product identifier.' });
  }
  try {
    const product = await Product.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    return res.json({ message: 'Product deleted.' });
  } catch (error) {
    return next(error);
  }
}
