import { useCallback, useEffect, useMemo, useState } from 'react';
import ProductForm from '../components/ProductForm.jsx';
import ProductTable from '../components/ProductTable.jsx';
import SiteNav from '../components/SiteNav.jsx';
import { apiRequest } from '../services/api.js';
import { getWarrantyStatus } from '../services/warranty.js';

const filters = ['All', 'Active', 'Expiring Soon', 'Expired'];

export default function DashboardPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState('');
  const [notice, setNotice] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('soonest');
  const [formProduct, setFormProduct] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setPageError('');
    try {
      const data = await apiRequest('/products');
      setProducts(data.products);
    } catch (error) {
      setPageError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const counts = useMemo(() => products.reduce((summary, product) => {
    summary.total += 1;
    summary[getWarrantyStatus(product.expiryDate)] += 1;
    return summary;
  }, { total: 0, Active: 0, 'Expiring Soon': 0, Expired: 0 }), [products]);

  const visibleProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    return products
      .filter((product) => (
        (!query || `${product.name} ${product.brand}`.toLowerCase().includes(query)) &&
        (filter === 'All' || getWarrantyStatus(product.expiryDate) === filter)
      ))
      .sort((a, b) => {
        const statusPriority = { 'Expiring Soon': 0, Active: 1, Expired: 2 };
        const priorityDifference = statusPriority[getWarrantyStatus(a.expiryDate)] -
          statusPriority[getWarrantyStatus(b.expiryDate)];
        if (priorityDifference !== 0) {
          return priorityDifference;
        }
        return sortOrder === 'soonest'
          ? a.expiryDate.localeCompare(b.expiryDate)
          : b.expiryDate.localeCompare(a.expiryDate);
      });
  }, [products, search, filter, sortOrder]);

  async function saveProduct(values) {
    setSaving(true);
    try {
      const editing = Boolean(formProduct);
      const data = await apiRequest(editing ? `/products/${formProduct._id}` : '/products', {
        method: editing ? 'PUT' : 'POST',
        body: JSON.stringify(values),
      });
      setProducts((current) => editing
        ? current.map((product) => product._id === data.product._id ? data.product : product)
        : [...current, data.product]);
      setNotice(editing ? 'Product updated.' : 'Product added.');
      setFormOpen(false);
      setFormProduct(null);
      setPageError('');
    } catch (error) {
      throw error;
    } finally {
      setSaving(false);
    }
  }

  function startCreate() {
    setFormProduct(null);
    setFormOpen(true);
    setNotice('');
  }

  function startEdit(product) {
    setFormProduct(product);
    setFormOpen(true);
    setNotice('');
  }

  async function deleteProduct(product) {
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) {
      return;
    }
    setNotice('');
    try {
      await apiRequest(`/products/${product._id}`, { method: 'DELETE' });
      setProducts((current) => current.filter((item) => item._id !== product._id));
      setNotice('Product deleted.');
      setPageError('');
    } catch (error) {
      setPageError(error.message);
    }
  }

  return (
    <>
      <SiteNav dashboard />
      <main className="page-shell dashboard">
        <div className="dashboard-heading">
          <div>
            <p className="eyebrow">Your account</p>
            <h1>Warranty dashboard</h1>
            <p className="muted">Manage products and keep an eye on upcoming expiries.</p>
          </div>
          <button className="button button-primary" onClick={startCreate} type="button">Add product</button>
        </div>

        {pageError && <p className="notice notice-error" role="alert">{pageError}</p>}
        {notice && <p className="notice notice-success" role="status">{notice}</p>}

        <section className="summary-grid" aria-label="Warranty summary">
          <article className="summary-card"><span>Total products</span><strong>{counts.total}</strong></article>
          <article className="summary-card"><span>Active warranties</span><strong>{counts.Active}</strong></article>
          <article className="summary-card"><span>Expiring soon</span><strong>{counts['Expiring Soon']}</strong></article>
          <article className="summary-card"><span>Expired warranties</span><strong>{counts.Expired}</strong></article>
        </section>

        {formOpen && (
          <ProductForm
            onCancel={() => { setFormOpen(false); setFormProduct(null); }}
            onSubmit={saveProduct}
            product={formProduct}
            saving={saving}
          />
        )}

        <section className="panel products-panel">
          <div className="products-heading">
            <div>
              <h2>Your products</h2>
              <p className="muted">{loading ? 'Loading products…' : `${visibleProducts.length} of ${products.length} products`}</p>
            </div>
            <div className="filters">
              <label className="search-field">
                <span className="visually-hidden">Search by product or brand</span>
                <input onChange={(event) => setSearch(event.target.value)} placeholder="Search products or brands" type="search" value={search} />
              </label>
              <label>
                <span className="visually-hidden">Filter by warranty status</span>
                <select onChange={(event) => setFilter(event.target.value)} value={filter}>
                  {filters.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </label>
              <label>
                <span className="visually-hidden">Sort by expiry date</span>
                <select onChange={(event) => setSortOrder(event.target.value)} value={sortOrder}>
                  <option value="soonest">Expiry: soonest</option>
                  <option value="latest">Expiry: latest</option>
                </select>
              </label>
            </div>
          </div>

          {loading ? (
            <p className="loading-state" role="status">Loading your warranties…</p>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <h2>No warranties yet</h2>
              <p>Add your first product to start tracking its warranty.</p>
              <button className="button button-primary" onClick={startCreate} type="button">Add your first product</button>
            </div>
          ) : (
            <ProductTable onDelete={deleteProduct} onEdit={startEdit} products={visibleProducts} />
          )}
        </section>
      </main>
    </>
  );
}
