import { useEffect, useState } from 'react';
import { addMonthsToDateOnly, formatDate } from '../services/warranty.js';

const emptyValues = {
  name: '',
  category: '',
  brand: '',
  purchaseDate: '',
  warrantyMonths: '',
  notes: '',
};

export default function ProductForm({ product, onSubmit, onCancel, saving }) {
  const [values, setValues] = useState(emptyValues);
  const [error, setError] = useState('');

  useEffect(() => {
    setValues(product ? {
      name: product.name,
      category: product.category || '',
      brand: product.brand || '',
      purchaseDate: product.purchaseDate,
      warrantyMonths: String(product.warrantyMonths),
      notes: product.notes || '',
    } : emptyValues);
    setError('');
  }, [product]);

  const expiryDate = addMonthsToDateOnly(values.purchaseDate, Number(values.warrantyMonths));

  function updateField(event) {
    setValues((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    const months = Number(values.warrantyMonths);
    if (!values.name.trim() || !values.purchaseDate || !Number.isInteger(months) || months < 1 || months > 1200) {
      setError('Enter a product name, purchase date, and warranty duration from 1 to 1200 whole months.');
      return;
    }

    try {
      await onSubmit({ ...values, name: values.name.trim(), warrantyMonths: months });
    } catch (submitError) {
      setError(submitError.message);
    }
  }

  return (
    <section className="panel form-panel" aria-labelledby="product-form-title">
      <div className="panel-heading">
        <h2 id="product-form-title">{product ? 'Edit product' : 'Add a product'}</h2>
        <button className="button button-outline button-small" onClick={onCancel} type="button">Cancel</button>
      </div>
      <form className="product-form" onSubmit={handleSubmit}>
        <label>
          Product name <span aria-hidden="true">*</span>
          <input name="name" onChange={updateField} required maxLength="120" value={values.name} />
        </label>
        <label>
          Category
          <input name="category" onChange={updateField} maxLength="80" value={values.category} />
        </label>
        <label>
          Brand
          <input name="brand" onChange={updateField} maxLength="80" value={values.brand} />
        </label>
        <label>
          Purchase date <span aria-hidden="true">*</span>
          <input name="purchaseDate" onChange={updateField} required type="date" value={values.purchaseDate} />
        </label>
        <label>
          Warranty duration (months) <span aria-hidden="true">*</span>
          <input name="warrantyMonths" onChange={updateField} required min="1" max="1200" step="1" type="number" value={values.warrantyMonths} />
        </label>
        <div className="calculated-date">
          <span>Calculated expiry date</span>
          <strong>{expiryDate ? formatDate(expiryDate) : 'Enter a purchase date and duration'}</strong>
        </div>
        <label className="form-wide">
          Notes
          <textarea name="notes" onChange={updateField} maxLength="2000" rows="3" value={values.notes} />
        </label>
        {error && <p className="form-error form-wide" role="alert">{error}</p>}
        <div className="form-actions form-wide">
          <button className="button button-primary" disabled={saving} type="submit">
            {saving ? 'Saving…' : product ? 'Save changes' : 'Add product'}
          </button>
          <button className="button button-outline" onClick={onCancel} type="button">Cancel</button>
        </div>
      </form>
    </section>
  );
}
