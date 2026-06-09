"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard, Package, ShoppingCart, Tag, Image, MapPin, Users,
  Plus, Edit, Trash2, Search, LogOut, TrendingUp, DollarSign,
  BarChart3, CheckCircle, Clock, Truck, XCircle, RefreshCw, X, Save,
  Eye, ChevronLeft, ChevronRight, Settings, Leaf, Bell
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAdminAuth, useAdminApi } from '../context/AdminAuthContext';
import { toast } from 'sonner';

type Tab = 'dashboard' | 'products' | 'orders' | 'categories' | 'banners' | 'delivery' | 'customers';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { admin, logout } = useAdminAuth();
  const { adminFetch } = useAdminApi();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/admin/login');
  };

  const navItems: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'categories', label: 'Categories', icon: Tag },
    { id: 'banners', label: 'Banners', icon: Image },
    { id: 'delivery', label: 'Delivery Areas', icon: MapPin },
    { id: 'customers', label: 'Customers', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-green-900 to-green-800 flex flex-col transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Logo */}
        <div className="p-6 border-b border-green-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-400 rounded-xl flex items-center justify-center">
              <Leaf className="w-6 h-6 text-green-900" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg leading-none">HarYali</h1>
              <p className="text-green-300 text-xs">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${
                  activeTab === item.id
                    ? 'bg-white/20 text-white font-medium shadow-sm'
                    : 'text-green-200 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Admin Profile & Logout */}
        <div className="p-4 border-t border-green-700/50">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-9 h-9 bg-green-400 rounded-full flex items-center justify-center text-green-900 font-bold text-sm flex-shrink-0">
              {admin?.name?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-medium truncate">{admin?.name}</p>
              <p className="text-green-400 text-xs truncate">{admin?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-300 hover:bg-red-500/20 hover:text-red-200 transition-colors text-sm"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-4 lg:px-8 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <BarChart3 className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-lg font-bold text-gray-900 capitalize">
                {navItems.find((n) => n.id === activeTab)?.label}
              </h2>
              <p className="text-xs text-gray-500">
                {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="text-sm text-gray-500 hover:text-green-600 transition-colors hidden sm:flex items-center gap-1"
            >
              <Eye className="w-4 h-4" />
              View Store
            </Link>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          {activeTab === 'dashboard' && <DashboardTab adminFetch={adminFetch} />}
          {activeTab === 'products' && <ProductsTab adminFetch={adminFetch} />}
          {activeTab === 'orders' && <OrdersTab adminFetch={adminFetch} />}
          {activeTab === 'categories' && <CategoriesTab adminFetch={adminFetch} />}
          {activeTab === 'banners' && <BannersTab adminFetch={adminFetch} />}
          {activeTab === 'delivery' && <DeliveryTab adminFetch={adminFetch} />}
          {activeTab === 'customers' && <CustomersTab adminFetch={adminFetch} />}
        </main>
      </div>
    </div>
  );
}

// ─── DASHBOARD TAB ────────────────────────────────────────────────────────────
function DashboardTab({ adminFetch }: { adminFetch: any }) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminFetch('/admin/stats')
      .then((d: any) => setStats(d.data))
      .catch(() => toast.error('Failed to load stats'))
      .finally(() => setLoading(false));
  }, [adminFetch]);

  if (loading) return <LoadingSpinner />;

  const statCards = [
    { label: 'Total Revenue', value: `₹${(stats?.stats?.totalRevenue || 0).toLocaleString('en-IN')}`, icon: DollarSign, color: 'from-green-500 to-emerald-600', sub: `₹${(stats?.stats?.monthRevenue || 0).toLocaleString('en-IN')} this month` },
    { label: 'Total Orders', value: stats?.stats?.totalOrders || 0, icon: ShoppingCart, color: 'from-blue-500 to-blue-600', sub: `${stats?.ordersByStatus?.pending || 0} pending` },
    { label: 'Active Products', value: stats?.stats?.totalProducts || 0, icon: Package, color: 'from-purple-500 to-purple-600', sub: 'in your store' },
    { label: 'Customers', value: stats?.stats?.totalCustomers || 0, icon: Users, color: 'from-orange-500 to-orange-600', sub: 'registered' },
  ];

  const statusConfig: Record<string, { label: string; icon: any; color: string }> = {
    pending: { label: 'Pending', icon: Clock, color: 'text-yellow-600 bg-yellow-50' },
    confirmed: { label: 'Confirmed', icon: CheckCircle, color: 'text-blue-600 bg-blue-50' },
    packed: { label: 'Packed', icon: Package, color: 'text-purple-600 bg-purple-50' },
    out_for_delivery: { label: 'Out for Delivery', icon: Truck, color: 'text-indigo-600 bg-indigo-50' },
    delivered: { label: 'Delivered', icon: CheckCircle, color: 'text-green-600 bg-green-50' },
    cancelled: { label: 'Cancelled', icon: XCircle, color: 'text-red-600 bg-red-50' },
  };

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`bg-gradient-to-br ${card.color} p-6 rounded-2xl text-white shadow-lg`}
            >
              <div className="flex items-center justify-between mb-3">
                <Icon className="w-8 h-8 opacity-90" />
                <TrendingUp className="w-5 h-5 opacity-70" />
              </div>
              <p className="text-sm opacity-90 mb-1">{card.label}</p>
              <p className="text-3xl font-bold">{card.value}</p>
              <p className="text-xs opacity-75 mt-1">{card.sub}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Order Status Overview */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-4">Order Status Overview</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {Object.entries(statusConfig).map(([status, cfg]) => {
            const Icon = cfg.icon;
            const count = stats?.ordersByStatus?.[status] || 0;
            return (
              <div key={status} className={`${cfg.color} rounded-xl p-4 text-center`}>
                <Icon className="w-6 h-6 mx-auto mb-2" />
                <p className="text-2xl font-bold">{count}</p>
                <p className="text-xs font-medium mt-1">{cfg.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <h3 className="font-bold text-gray-900">Recent Orders</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {['Order #', 'Customer', 'Amount', 'Status', 'Method', 'Date'].map((h) => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(stats?.recentOrders || []).map((order: any) => (
                <tr key={order.id} className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="py-3 px-4 font-mono text-sm font-medium text-green-700">{order.orderNumber}</td>
                  <td className="py-3 px-4">
                    <p className="font-medium text-gray-900 text-sm">{order.customerName}</p>
                    <p className="text-xs text-gray-500">{order.customerPhone}</p>
                  </td>
                  <td className="py-3 px-4 font-semibold text-gray-900">₹{order.totalAmount?.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-4"><StatusBadge status={order.orderStatus} /></td>
                  <td className="py-3 px-4 text-sm text-gray-600">{order.paymentMethod}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── CATEGORIES TAB ───────────────────────────────────────────────────────────
function CategoriesTab({ adminFetch }: { adminFetch: any }) {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [form, setForm] = useState({ name: '', slug: '', imageUrl: '', description: '', status: 'active' });
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    adminFetch('/admin/categories?limit=100')
      .then((d: any) => setCategories(d.data || []))
      .catch(() => toast.error('Failed to load categories'))
      .finally(() => setLoading(false));
  }, [adminFetch]);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => { setEditItem(null); setForm({ name: '', slug: '', imageUrl: '', description: '', status: 'active' }); setShowForm(true); };
  const openEdit = (cat: any) => { setEditItem(cat); setForm({ name: cat.name, slug: cat.slug, imageUrl: cat.imageUrl || '', description: cat.description || '', status: cat.status }); setShowForm(true); };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editItem) {
        await adminFetch(`/admin/categories/${editItem.id}`, { method: 'PUT', body: JSON.stringify(form) });
        toast.success('Category updated!');
      } else {
        await adminFetch('/admin/categories', { method: 'POST', body: JSON.stringify(form) });
        toast.success('Category created!');
      }
      setShowForm(false);
      load();
    } catch (err: any) { toast.error(err.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await adminFetch(`/admin/categories/${id}`, { method: 'DELETE' });
      toast.success('Category deleted');
      load();
    } catch (err: any) { toast.error(err.message); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Categories <span className="text-gray-400 font-normal text-base">({categories.length})</span></h2>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <motion.div key={cat.id} layout className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {cat.imageUrl ? (
                    <img src={cat.imageUrl} alt={cat.name} className="w-12 h-12 rounded-xl object-cover" />
                  ) : (
                    <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                      <Tag className="w-6 h-6 text-green-500" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-900">{cat.name}</h3>
                    <p className="text-xs text-gray-500">{cat.productCount || 0} products</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${cat.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {cat.status}
                </span>
              </div>
              {cat.description && <p className="text-sm text-gray-500 mb-3 line-clamp-2">{cat.description}</p>}
              <div className="flex items-center gap-2 pt-2 border-t border-gray-50">
                <button onClick={() => openEdit(cat)} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm text-green-700 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                  <Edit className="w-3.5 h-3.5" /> Edit
                </button>
                <button onClick={() => handleDelete(cat.id, cat.name)} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Category Form Modal */}
      <Modal open={showForm} onClose={() => setShowForm(false)} title={editItem ? 'Edit Category' : 'New Category'}>
        <div className="space-y-4">
          <FormField label="Name *" value={form.name} onChange={(v) => setForm(f => ({ ...f, name: v }))} placeholder="e.g. Indoor Plants" />
          <FormField label="Slug" value={form.slug} onChange={(v) => setForm(f => ({ ...f, slug: v }))} placeholder="auto-generated if empty" />
          <FormField label="Image URL" value={form.imageUrl} onChange={(v) => setForm(f => ({ ...f, imageUrl: v }))} placeholder="https://..." />
          <FormField label="Description" value={form.description} onChange={(v) => setForm(f => ({ ...f, description: v }))} multiline />
          <SelectField label="Status" value={form.status} onChange={(v) => setForm(f => ({ ...f, status: v }))} options={[{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }]} />
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={() => setShowForm(false)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-medium">
            {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
            {editItem ? 'Update' : 'Create'}
          </button>
        </div>
      </Modal>
    </div>
  );
}

// ─── PRODUCTS TAB ─────────────────────────────────────────────────────────────
function ProductsTab({ adminFetch }: { adminFetch: any }) {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<any>({ total: 0, totalPages: 1 });
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [form, setForm] = useState<any>({
    categoryId: '', name: '', price: '', comparePrice: '', stockAvailable: 0,
    stockStatus: 'in_stock', status: 'active', shortDescription: '', description: '',
    imageUrl: '', featured: false, bestSeller: false, newArrival: false, petFriendly: false,
    plantType: '', height: '', potSize: '', sunlightRequirement: '', wateringFrequency: '',
    maintenanceLevel: '', location: ''
  });
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: '15', ...(search ? { search } : {}) });
    Promise.all([
      adminFetch(`/admin/products?${params}`),
      adminFetch('/admin/categories?limit=100'),
    ])
      .then(([pd, cd]: any) => {
        setProducts(pd.data || []);
        setMeta(pd.meta || { total: 0, totalPages: 1 });
        setCategories(cd.data || []);
      })
      .catch(() => toast.error('Failed to load products'))
      .finally(() => setLoading(false));
  }, [adminFetch, page, search]);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => {
    setEditItem(null);
    setForm({ categoryId: '', name: '', price: '', comparePrice: '', stockAvailable: 0, stockStatus: 'in_stock', status: 'active', shortDescription: '', description: '', imageUrl: '', featured: false, bestSeller: false, newArrival: false, petFriendly: false, plantType: '', height: '', potSize: '', sunlightRequirement: '', wateringFrequency: '', maintenanceLevel: '', location: '' });
    setShowForm(true);
  };

  const openEdit = (p: any) => {
    setEditItem(p);
    setForm({
      categoryId: String(p.categoryId), name: p.name, price: String(p.price), comparePrice: p.comparePrice ? String(p.comparePrice) : '',
      stockAvailable: p.stockAvailable, stockStatus: p.stockStatus, status: p.status,
      shortDescription: p.shortDescription || '', description: p.description || '',
      imageUrl: p.primaryImage || '', featured: p.featured, bestSeller: p.bestSeller, newArrival: p.newArrival, petFriendly: p.petFriendly,
      plantType: p.plantType || '', height: p.height || '', potSize: p.potSize || '',
      sunlightRequirement: p.sunlightRequirement || '', wateringFrequency: p.wateringFrequency || '',
      maintenanceLevel: p.maintenanceLevel || '', location: p.location || '',
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload: any = {
        ...form,
        categoryId: parseInt(form.categoryId),
        price: parseFloat(form.price),
        comparePrice: form.comparePrice ? parseFloat(form.comparePrice) : null,
        stockAvailable: parseInt(form.stockAvailable),
        images: form.imageUrl ? [{ imageUrl: form.imageUrl, isPrimary: true }] : [],
      };
      delete payload.imageUrl;

      if (editItem) {
        await adminFetch(`/admin/products/${editItem.id}`, { method: 'PUT', body: JSON.stringify(payload) });
        toast.success('Product updated!');
      } else {
        await adminFetch('/admin/products', { method: 'POST', body: JSON.stringify(payload) });
        toast.success('Product created!');
      }
      setShowForm(false);
      load();
    } catch (err: any) { toast.error(err.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      await adminFetch(`/admin/products/${id}`, { method: 'DELETE' });
      toast.success('Product deleted');
      load();
    } catch (err: any) { toast.error(err.message); }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Products <span className="text-gray-400 font-normal text-base">({meta.total})</span></h2>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search products..."
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-medium whitespace-nowrap">
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>
      </div>

      {loading ? <LoadingSpinner /> : (
        <>
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    {['Image', 'Product', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map(h => (
                      <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="py-3 px-4">
                        {p.primaryImage ? (
                          <img src={p.primaryImage} alt={p.name} className="w-12 h-12 rounded-xl object-cover" />
                        ) : (
                          <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                            <Package className="w-5 h-5 text-gray-400" />
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-medium text-gray-900 text-sm">{p.name}</p>
                        <p className="text-xs text-gray-500">{p.sku || '—'}</p>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">{p.category?.name}</td>
                      <td className="py-3 px-4">
                        <p className="font-semibold text-gray-900 text-sm">₹{parseFloat(p.price).toLocaleString('en-IN')}</p>
                        {p.comparePrice && <p className="text-xs text-gray-400 line-through">₹{parseFloat(p.comparePrice).toLocaleString('en-IN')}</p>}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${p.stockStatus === 'in_stock' ? 'bg-green-50 text-green-700' : p.stockStatus === 'low_stock' ? 'bg-yellow-50 text-yellow-700' : 'bg-red-50 text-red-700'}`}>
                          {p.stockAvailable} ({p.stockStatus.replace('_', ' ')})
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${p.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{p.status}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-1">
                          <button onClick={() => openEdit(p)} className="p-2 hover:bg-green-50 rounded-lg text-green-600 transition-colors"><Edit className="w-4 h-4" /></button>
                          <button onClick={() => handleDelete(p.id, p.name)} className="p-2 hover:bg-red-50 rounded-lg text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && (
                    <tr><td colSpan={7} className="py-12 text-center text-gray-400">No products found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {meta.totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Page {page} of {meta.totalPages} ({meta.total} total)</p>
              <div className="flex gap-2">
                <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="p-2 border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50"><ChevronLeft className="w-4 h-4" /></button>
                <button disabled={page >= meta.totalPages} onClick={() => setPage(p => p + 1)} className="p-2 border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Product Form Modal */}
      <Modal open={showForm} onClose={() => setShowForm(false)} title={editItem ? 'Edit Product' : 'New Product'} wide>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <FormField label="Product Name *" value={form.name} onChange={(v) => setForm((f: any) => ({ ...f, name: v }))} placeholder="e.g. Peace Lily" />
          </div>
          <SelectField label="Category *" value={String(form.categoryId)} onChange={(v) => setForm((f: any) => ({ ...f, categoryId: v }))}
            options={categories.map(c => ({ value: String(c.id), label: c.name }))} />
          <SelectField label="Status" value={form.status} onChange={(v) => setForm((f: any) => ({ ...f, status: v }))}
            options={[{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }, { value: 'draft', label: 'Draft' }]} />
          <FormField label="Price (₹) *" value={form.price} onChange={(v) => setForm((f: any) => ({ ...f, price: v }))} type="number" placeholder="499" />
          <FormField label="Compare Price (₹)" value={form.comparePrice} onChange={(v) => setForm((f: any) => ({ ...f, comparePrice: v }))} type="number" placeholder="699" />
          <FormField label="Stock Quantity" value={String(form.stockAvailable)} onChange={(v) => setForm((f: any) => ({ ...f, stockAvailable: v }))} type="number" />
          <SelectField label="Stock Status" value={form.stockStatus} onChange={(v) => setForm((f: any) => ({ ...f, stockStatus: v }))}
            options={[{ value: 'in_stock', label: 'In Stock' }, { value: 'low_stock', label: 'Low Stock' }, { value: 'out_of_stock', label: 'Out of Stock' }]} />
          <div className="sm:col-span-2">
            <FormField label="Primary Image URL" value={form.imageUrl} onChange={(v) => setForm((f: any) => ({ ...f, imageUrl: v }))} placeholder="https://..." />
            {form.imageUrl && <img src={form.imageUrl} alt="preview" className="mt-2 h-24 w-24 object-cover rounded-xl border" />}
          </div>
          <div className="sm:col-span-2">
            <FormField label="Short Description" value={form.shortDescription} onChange={(v) => setForm((f: any) => ({ ...f, shortDescription: v }))} multiline placeholder="Brief product description" />
          </div>
          <FormField label="Plant Type" value={form.plantType} onChange={(v) => setForm((f: any) => ({ ...f, plantType: v }))} placeholder="Indoor, Outdoor..." />
          <FormField label="Height" value={form.height} onChange={(v) => setForm((f: any) => ({ ...f, height: v }))} placeholder="30-40 cm" />
          <FormField label="Sunlight" value={form.sunlightRequirement} onChange={(v) => setForm((f: any) => ({ ...f, sunlightRequirement: v }))} placeholder="Low, Medium, Bright" />
          <FormField label="Watering" value={form.wateringFrequency} onChange={(v) => setForm((f: any) => ({ ...f, wateringFrequency: v }))} placeholder="Weekly, Twice weekly..." />
          <div className="sm:col-span-2">
            <div className="flex flex-wrap gap-4">
              {[
                { key: 'featured', label: 'Featured' },
                { key: 'bestSeller', label: 'Best Seller' },
                { key: 'newArrival', label: 'New Arrival' },
                { key: 'petFriendly', label: 'Pet Friendly' },
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form[key]} onChange={(e) => setForm((f: any) => ({ ...f, [key]: e.target.checked }))} className="w-4 h-4 rounded border-gray-300 text-green-600" />
                  <span className="text-sm text-gray-700">{label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={() => setShowForm(false)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-medium">
            {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
            {editItem ? 'Update' : 'Create'} Product
          </button>
        </div>
      </Modal>
    </div>
  );
}

// ─── ORDERS TAB ───────────────────────────────────────────────────────────────
function OrdersTab({ adminFetch }: { adminFetch: any }) {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<any>({ total: 0, totalPages: 1 });
  const [updating, setUpdating] = useState<number | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: '20', ...(filterStatus ? { status: filterStatus } : {}) });
    adminFetch(`/admin/orders?${params}`)
      .then((d: any) => { setOrders(d.data || []); setMeta(d.meta || {}); })
      .catch(() => toast.error('Failed to load orders'))
      .finally(() => setLoading(false));
  }, [adminFetch, page, filterStatus]);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id: number, status: string) => {
    setUpdating(id);
    try {
      await adminFetch(`/admin/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) });
      toast.success('Order status updated');
      load();
    } catch (err: any) { toast.error(err.message); }
    finally { setUpdating(null); }
  };

  const statusOptions = ['pending', 'confirmed', 'packed', 'out_for_delivery', 'delivered', 'cancelled'];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <button onClick={() => { setFilterStatus(''); setPage(1); }} className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${!filterStatus ? 'bg-green-600 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>All</button>
        {statusOptions.map(s => (
          <button key={s} onClick={() => { setFilterStatus(s); setPage(1); }} className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors capitalize ${filterStatus === s ? 'bg-green-600 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>
            {s.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {loading ? <LoadingSpinner /> : (
        <>
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    {['Order', 'Customer', 'Items', 'Amount', 'Payment', 'Status', 'Date'].map(h => (
                      <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-t border-gray-50 hover:bg-gray-50/50">
                      <td className="py-3 px-4 font-mono text-sm font-medium text-green-700">{order.orderNumber}</td>
                      <td className="py-3 px-4">
                        <p className="font-medium text-sm">{order.customerName}</p>
                        <p className="text-xs text-gray-500">{order.customerPhone}</p>
                      </td>
                      <td className="py-3 px-4 text-sm text-center">{order._count?.items || order.items?.length || 0}</td>
                      <td className="py-3 px-4 font-semibold text-sm">₹{parseFloat(order.totalAmount).toLocaleString('en-IN')}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${order.paymentStatus === 'paid' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                          {order.paymentStatus} · {order.paymentMethod}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={order.orderStatus}
                          onChange={(e) => updateStatus(order.id, e.target.value)}
                          disabled={updating === order.id}
                          className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                        >
                          {statusOptions.map(s => (
                            <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3 px-4 text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr><td colSpan={7} className="py-12 text-center text-gray-400">No orders found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          {meta.totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Page {page} of {meta.totalPages} ({meta.total} total)</p>
              <div className="flex gap-2">
                <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="p-2 border border-gray-200 rounded-lg disabled:opacity-50"><ChevronLeft className="w-4 h-4" /></button>
                <button disabled={page >= meta.totalPages} onClick={() => setPage(p => p + 1)} className="p-2 border border-gray-200 rounded-lg disabled:opacity-50"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── BANNERS TAB ──────────────────────────────────────────────────────────────
function BannersTab({ adminFetch }: { adminFetch: any }) {
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [form, setForm] = useState({ title: '', subtitle: '', imageUrl: '', link: '', sortOrder: '0', status: 'active' });
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    adminFetch('/admin/banners').then((d: any) => setBanners(d.data || [])).finally(() => setLoading(false));
  }, [adminFetch]);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => { setEditItem(null); setForm({ title: '', subtitle: '', imageUrl: '', link: '', sortOrder: '0', status: 'active' }); setShowForm(true); };
  const openEdit = (b: any) => { setEditItem(b); setForm({ title: b.title, subtitle: b.subtitle || '', imageUrl: b.imageUrl, link: b.link || '', sortOrder: String(b.sortOrder), status: b.status }); setShowForm(true); };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { ...form, sortOrder: parseInt(form.sortOrder) };
      if (editItem) { await adminFetch(`/admin/banners/${editItem.id}`, { method: 'PUT', body: JSON.stringify(payload) }); toast.success('Banner updated!'); }
      else { await adminFetch('/admin/banners', { method: 'POST', body: JSON.stringify(payload) }); toast.success('Banner created!'); }
      setShowForm(false); load();
    } catch (err: any) { toast.error(err.message); } finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this banner?')) return;
    await adminFetch(`/admin/banners/${id}`, { method: 'DELETE' }); toast.success('Deleted'); load();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Banners <span className="text-gray-400 font-normal text-base">({banners.length})</span></h2>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-medium">
          <Plus className="w-4 h-4" /> Add Banner
        </button>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {banners.map((b) => (
            <div key={b.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
              <img src={b.imageUrl} alt={b.title} className="w-full h-40 object-cover" onError={(e: any) => { e.target.style.display = 'none'; }} />
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{b.title}</h3>
                    {b.subtitle && <p className="text-sm text-gray-500">{b.subtitle}</p>}
                    <span className={`mt-1 inline-block px-2 py-0.5 rounded-full text-xs ${b.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{b.status}</span>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(b)} className="p-2 hover:bg-green-50 rounded-lg text-green-600"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(b.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-500"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {banners.length === 0 && <div className="col-span-2 py-12 text-center text-gray-400 bg-white rounded-2xl border border-gray-100">No banners yet</div>}
        </div>
      )}

      <Modal open={showForm} onClose={() => setShowForm(false)} title={editItem ? 'Edit Banner' : 'New Banner'}>
        <div className="space-y-4">
          <FormField label="Title *" value={form.title} onChange={(v) => setForm(f => ({ ...f, title: v }))} />
          <FormField label="Subtitle" value={form.subtitle} onChange={(v) => setForm(f => ({ ...f, subtitle: v }))} />
          <FormField label="Image URL *" value={form.imageUrl} onChange={(v) => setForm(f => ({ ...f, imageUrl: v }))} placeholder="https://..." />
          {form.imageUrl && <img src={form.imageUrl} alt="" className="w-full h-32 object-cover rounded-xl border" />}
          <FormField label="Link" value={form.link} onChange={(v) => setForm(f => ({ ...f, link: v }))} placeholder="/category/indoor-plants" />
          <FormField label="Sort Order" value={form.sortOrder} onChange={(v) => setForm(f => ({ ...f, sortOrder: v }))} type="number" />
          <SelectField label="Status" value={form.status} onChange={(v) => setForm(f => ({ ...f, status: v }))} options={[{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }]} />
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={() => setShowForm(false)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-xl text-sm font-medium">
            {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
            {editItem ? 'Update' : 'Create'}
          </button>
        </div>
      </Modal>
    </div>
  );
}

// ─── DELIVERY TAB ─────────────────────────────────────────────────────────────
function DeliveryTab({ adminFetch }: { adminFetch: any }) {
  const [areas, setAreas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [form, setForm] = useState({ name: '', city: '', pincode: '', deliveryCharge: '0', minOrderForFreeDelivery: '1000', isActive: true });
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  const load = useCallback(() => {
    adminFetch(`/admin/delivery/areas?search=${search}`)
      .then((d: any) => setAreas(d.data || []))
      .finally(() => setLoading(false));
  }, [adminFetch, search]);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => { setEditItem(null); setForm({ name: '', city: '', pincode: '', deliveryCharge: '0', minOrderForFreeDelivery: '1000', isActive: true }); setShowForm(true); };
  const openEdit = (a: any) => { setEditItem(a); setForm({ name: a.name, city: a.city, pincode: a.pincode, deliveryCharge: String(a.deliveryCharge), minOrderForFreeDelivery: String(a.minOrderForFreeDelivery), isActive: a.isActive }); setShowForm(true); };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { ...form, deliveryCharge: parseFloat(form.deliveryCharge), minOrderForFreeDelivery: parseFloat(form.minOrderForFreeDelivery) };
      if (editItem) { await adminFetch(`/admin/delivery/areas/${editItem.id}`, { method: 'PUT', body: JSON.stringify(payload) }); toast.success('Area updated!'); }
      else { await adminFetch('/admin/delivery/areas', { method: 'POST', body: JSON.stringify(payload) }); toast.success('Area added!'); }
      setShowForm(false); load();
    } catch (err: any) { toast.error(err.message); } finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this delivery area?')) return;
    await adminFetch(`/admin/delivery/areas/${id}`, { method: 'DELETE' }); toast.success('Deleted'); load();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Delivery Areas <span className="text-gray-400 font-normal text-base">({areas.length})</span></h2>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-xl text-sm font-medium whitespace-nowrap">
            <Plus className="w-4 h-4" /> Add Area
          </button>
        </div>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {['Area Name', 'City', 'Pincode', 'Delivery Charge', 'Free above', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {areas.map((a) => (
                  <tr key={a.id} className="border-t border-gray-50 hover:bg-gray-50/50">
                    <td className="py-3 px-4 font-medium text-sm">{a.name}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{a.city}</td>
                    <td className="py-3 px-4 font-mono text-sm">{a.pincode}</td>
                    <td className="py-3 px-4 text-sm">₹{parseFloat(a.deliveryCharge).toFixed(0)}</td>
                    <td className="py-3 px-4 text-sm">₹{parseFloat(a.minOrderForFreeDelivery).toLocaleString('en-IN')}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${a.isActive ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {a.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-1">
                        <button onClick={() => openEdit(a)} className="p-2 hover:bg-green-50 rounded-lg text-green-600"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(a.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-500"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {areas.length === 0 && <tr><td colSpan={7} className="py-12 text-center text-gray-400">No delivery areas yet</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal open={showForm} onClose={() => setShowForm(false)} title={editItem ? 'Edit Delivery Area' : 'Add Delivery Area'}>
        <div className="space-y-4">
          <FormField label="Area Name *" value={form.name} onChange={(v) => setForm(f => ({ ...f, name: v }))} placeholder="Koramangala" />
          <FormField label="City *" value={form.city} onChange={(v) => setForm(f => ({ ...f, city: v }))} placeholder="Bengaluru" />
          <FormField label="Pincode *" value={form.pincode} onChange={(v) => setForm(f => ({ ...f, pincode: v }))} placeholder="560034" maxLength={6} />
          <FormField label="Delivery Charge (₹)" value={form.deliveryCharge} onChange={(v) => setForm(f => ({ ...f, deliveryCharge: v }))} type="number" />
          <FormField label="Min Order for Free Delivery (₹)" value={form.minOrderForFreeDelivery} onChange={(v) => setForm(f => ({ ...f, minOrderForFreeDelivery: v }))} type="number" />
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.isActive} onChange={(e) => setForm(f => ({ ...f, isActive: e.target.checked }))} className="w-4 h-4 rounded text-green-600" />
            <span className="text-sm text-gray-700 font-medium">Active</span>
          </label>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={() => setShowForm(false)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-xl text-sm font-medium">
            {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
            {editItem ? 'Update' : 'Add'}
          </button>
        </div>
      </Modal>
    </div>
  );
}

// ─── CUSTOMERS TAB ────────────────────────────────────────────────────────────
function CustomersTab({ adminFetch }: { adminFetch: any }) {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<any>({});

  const load = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: '20', ...(search ? { search } : {}) });
    adminFetch(`/admin/customers?${params}`)
      .then((d: any) => { setCustomers(d.data || []); setMeta(d.meta || {}); })
      .finally(() => setLoading(false));
  }, [adminFetch, page, search]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="space-y-4">
      <div className="flex gap-3 items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Customers <span className="text-gray-400 font-normal text-base">({meta.total || 0})</span></h2>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search customers..." className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
        </div>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {['Customer', 'Phone', 'Email', 'Orders', 'Joined'].map(h => (
                    <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.id} className="border-t border-gray-50 hover:bg-gray-50/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-semibold text-sm flex-shrink-0">
                          {c.name?.[0]?.toUpperCase() || 'C'}
                        </div>
                        <span className="font-medium text-sm">{c.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-sm">{c.phone}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{c.email || '—'}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold">{c.orderCount || 0}</span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500">{new Date(c.createdAt).toLocaleDateString('en-IN')}</td>
                  </tr>
                ))}
                {customers.length === 0 && <tr><td colSpan={5} className="py-12 text-center text-gray-400">No customers found</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {meta.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">Page {page} of {meta.totalPages}</p>
          <div className="flex gap-2">
            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="p-2 border border-gray-200 rounded-lg disabled:opacity-50"><ChevronLeft className="w-4 h-4" /></button>
            <button disabled={page >= meta.totalPages} onClick={() => setPage(p => p + 1)} className="p-2 border border-gray-200 rounded-lg disabled:opacity-50"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SHARED UI COMPONENTS ─────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-50 text-yellow-700',
    confirmed: 'bg-blue-50 text-blue-700',
    packed: 'bg-purple-50 text-purple-700',
    out_for_delivery: 'bg-indigo-50 text-indigo-700',
    delivered: 'bg-green-50 text-green-700',
    cancelled: 'bg-red-50 text-red-700',
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${colors[status] || 'bg-gray-100 text-gray-600'}`}>
      {status.replace(/_/g, ' ')}
    </span>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="w-10 h-10 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
    </div>
  );
}

function Modal({ open, onClose, title, children, wide = false }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/50 z-50" />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl shadow-2xl p-6 w-full ${wide ? 'max-w-2xl' : 'max-w-md'} max-h-[90vh] overflow-y-auto`}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-gray-900 text-lg">{title}</h3>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function FormField({ label, value, onChange, placeholder, type = 'text', multiline = false, maxLength }: any) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      {multiline ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={3}
          className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" />
      ) : (
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} maxLength={maxLength}
          className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
      )}
    </div>
  );
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white">
        <option value="">Select...</option>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}
