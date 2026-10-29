import { formatDate, getDaysRemaining, getWarrantyStatus } from '../services/warranty.js';

export default function ProductTable({ products, onEdit, onDelete }) {
  if (!products.length) {
    return (
      <div className="empty-state">
        <h2>No products found</h2>
        <p>Add a product or adjust your search and filters.</p>
      </div>
    );
  }

  return (
    <>
      <div className="table-scroll">
        <table className="product-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Brand</th>
              <th>Purchase date</th>
              <th>Expiry date</th>
              <th>Status</th>
              <th>Days remaining</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const status = getWarrantyStatus(product.expiryDate);
              const days = getDaysRemaining(product.expiryDate);
              return (
                <tr key={product._id}>
                  <td>
                    <strong>{product.name}</strong>
                    {product.category && <span className="table-secondary">{product.category}</span>}
                  </td>
                  <td>{product.brand || '—'}</td>
                  <td>{formatDate(product.purchaseDate)}</td>
                  <td>{formatDate(product.expiryDate)}</td>
                  <td><span className={`status status-${status.toLowerCase().replace(' ', '-')}`}>{status}</span></td>
                  <td>{days < 0 ? 'Expired' : `${days} ${days === 1 ? 'day' : 'days'}`}</td>
                  <td>
                    <div className="row-actions">
                      <button className="text-button" onClick={() => onEdit(product)} type="button">Edit</button>
                      <button className="text-button text-danger" onClick={() => onDelete(product)} type="button">Delete</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="mobile-product-list">
        {products.map((product) => {
          const status = getWarrantyStatus(product.expiryDate);
          const days = getDaysRemaining(product.expiryDate);
          return (
            <article className="mobile-product-card" key={product._id}>
              <div className="mobile-product-heading">
                <strong>{product.name}</strong>
                <span className={`status status-${status.toLowerCase().replace(' ', '-')}`}>{status}</span>
              </div>
              <p>{product.brand || 'No brand'}{product.category ? ` · ${product.category}` : ''}</p>
              <dl>
                <div><dt>Purchase date</dt><dd>{formatDate(product.purchaseDate)}</dd></div>
                <div><dt>Expiry date</dt><dd>{formatDate(product.expiryDate)}</dd></div>
                <div><dt>Days remaining</dt><dd>{days < 0 ? 'Expired' : `${days} ${days === 1 ? 'day' : 'days'}`}</dd></div>
              </dl>
              <div className="row-actions">
                <button className="text-button" onClick={() => onEdit(product)} type="button">Edit</button>
                <button className="text-button text-danger" onClick={() => onDelete(product)} type="button">Delete</button>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}
