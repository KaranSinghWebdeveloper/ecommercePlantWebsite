"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import {
  User, Package, MapPin, Phone, Mail, Edit3, Save, X, Plus, Trash2,
  ChevronRight, ChevronDown, Clock, CheckCircle, Truck, XCircle,
  LogOut, ArrowLeft, Leaf, AlertCircle, Eye
} from 'lucide-react';
import Link from 'next/link';
import { useCustomerAuth, useCustomerApi } from '../context/CustomerAuthContext';
import { toast } from 'sonner';

type ProfileTab = 'details' | 'orders' | 'addresses';

export default function ProfilePage() {
  const { customer, isAuthenticated, isLoading, logout } = useCustomerAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [activeTab, setActiveTab] = useState<ProfileTab>('orders');
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setShowLoginModal(true);
    }
  }, [isLoading, isAuthenticated]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      {/* Login Modal */}
      <AnimatePresence>
        {showLoginModal && !isAuthenticated && (
          <LoginModal onClose={() => { setShowLoginModal(false); router.push('/'); }} onSuccess={() => setShowLoginModal(false)} />
        )}
      </AnimatePresence>

      {isAuthenticated && (
        <div className="min-h-screen bg-muted/30">
          {/* Header */}
          <div className="bg-card border-b border-border sticky top-0 z-40">
            <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <h1 className="text-xl font-bold">My Account</h1>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-destructive transition-colors rounded-lg hover:bg-destructive/10"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>

          <div className="max-w-5xl mx-auto px-4 py-6">
            {/* Profile Header Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-2xl p-6 mb-6 shadow-lg"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0">
                  {customer?.name?.[0]?.toUpperCase() || 'C'}
                </div>
                <div>
                  <h2 className="text-xl font-bold">{customer?.name}</h2>
                  <p className="text-primary-foreground/80 text-sm flex items-center gap-1.5 mt-0.5">
                    <Phone className="w-3.5 h-3.5" /> {customer?.phone}
                  </p>
                  {customer?.email && (
                    <p className="text-primary-foreground/80 text-sm flex items-center gap-1.5 mt-0.5">
                      <Mail className="w-3.5 h-3.5" /> {customer?.email}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Tabs */}
            <div className="flex gap-1 bg-card border border-border rounded-xl p-1 mb-6">
              {([
                { id: 'orders', label: 'My Orders', icon: Package },
                { id: 'details', label: 'My Details', icon: User },
                { id: 'addresses', label: 'Addresses', icon: MapPin },
              ] as { id: ProfileTab; label: string; icon: any }[]).map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    activeTab === id
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{label}</span>
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'details' && <DetailsTab />}
                {activeTab === 'orders' && <OrdersTab />}
                {activeTab === 'addresses' && <AddressesTab />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      )}
    </>
  );
}

// ─── DETAILS TAB ──────────────────────────────────────────────────────────────
function DetailsTab() {
  const { customer, updateCustomer, token } = useCustomerAuth();
  const { customerFetch } = useCustomerApi();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: customer?.name || '', phone: customer?.phone || '' });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await customerFetch('/customer/profile', {
        method: 'PUT',
        body: JSON.stringify(form),
      });
      updateCustomer(res.data);
      setEditing(false);
      toast.success('Profile updated!');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-lg">Personal Details</h3>
        {!editing ? (
          <button onClick={() => setEditing(true)} className="flex items-center gap-2 px-4 py-2 text-sm text-primary bg-primary/10 hover:bg-primary/20 rounded-xl transition-colors font-medium">
            <Edit3 className="w-4 h-4" /> Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button onClick={() => setEditing(false)} className="p-2 hover:bg-muted rounded-lg transition-colors">
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
            <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 disabled:opacity-50">
              {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
              Save
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <ProfileField icon={User} label="Full Name" value={form.name} editing={editing} onChange={(v: string) => setForm(f => ({ ...f, name: v }))} />
        <ProfileField icon={Mail} label="Email Address" value={customer?.email || ''} editing={false} readonly />
        <ProfileField icon={Phone} label="Phone Number" value={form.phone} editing={editing} onChange={(v: string) => setForm(f => ({ ...f, phone: v }))} type="tel" placeholder="Add your phone number" />
      </div>

      {!editing && !customer?.phone && (
        <div className="mt-4 flex items-center gap-3 bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          Add your phone number for delivery updates.
        </div>
      )}
    </div>
  );
}

function ProfileField({ icon: Icon, label, value, editing, onChange, type = 'text', readonly = false, placeholder }: any) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
        <Icon className="w-3.5 h-3.5" /> {label}
      </label>
      {editing && !readonly ? (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 border border-input bg-background rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      ) : (
        <p className="px-4 py-3 bg-muted/50 rounded-xl text-sm font-medium text-foreground">
          {value || <span className="text-muted-foreground">{placeholder || 'Not set'}</span>}
        </p>
      )}
    </div>
  );
}

// ─── ORDERS TAB ───────────────────────────────────────────────────────────────
function OrdersTab() {
  const { customerFetch } = useCustomerApi();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
  const [meta, setMeta] = useState<any>({ totalPages: 1 });
  const [page, setPage] = useState(1);

  const load = useCallback(() => {
    setLoading(true);
    customerFetch(`/customer/orders?page=${page}&limit=8`)
      .then((d: any) => { 
        const fetchedOrders = d.data || [];
        setOrders(fetchedOrders); 
        setMeta(d.meta || {}); 
        if (fetchedOrders.length > 0 && page === 1) {
          setExpandedOrder(fetchedOrders[0].id);
        }
      })
      .catch(() => toast.error('Failed to load orders'))
      .finally(() => setLoading(false));
  }, [customerFetch, page]);

  useEffect(() => { load(); }, [load]);

  const statusConfig: Record<string, { label: string; icon: any; color: string; bg: string }> = {
    pending: { label: 'Pending', icon: Clock, color: 'text-yellow-700', bg: 'bg-yellow-50 border-yellow-200' },
    confirmed: { label: 'Confirmed', icon: CheckCircle, color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200' },
    packed: { label: 'Packed', icon: Package, color: 'text-purple-700', bg: 'bg-purple-50 border-purple-200' },
    out_for_delivery: { label: 'Out for Delivery', icon: Truck, color: 'text-indigo-700', bg: 'bg-indigo-50 border-indigo-200' },
    delivered: { label: 'Delivered', icon: CheckCircle, color: 'text-green-700', bg: 'bg-green-50 border-green-200' },
    cancelled: { label: 'Cancelled', icon: XCircle, color: 'text-red-700', bg: 'bg-red-50 border-red-200' },
  };

  if (loading) return (
    <div className="flex items-center justify-center py-16">
      <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
    </div>
  );

  if (orders.length === 0) return (
    <div className="bg-card border border-border rounded-2xl p-12 text-center">
      <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
        <Package className="w-10 h-10 text-muted-foreground" />
      </div>
      <h3 className="font-semibold text-lg mb-2">No orders yet</h3>
      <p className="text-muted-foreground text-sm mb-6">Start shopping to see your orders here!</p>
      <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors text-sm">
        <Leaf className="w-4 h-4" /> Browse Plants
      </Link>
    </div>
  );

  return (
    <div className="space-y-4">
      {orders.map((order) => {
        const status = statusConfig[order.orderStatus] || statusConfig.pending;
        const StatusIcon = status.icon;
        const isExpanded = expandedOrder === order.id;

        return (
          <motion.div
            key={order.id}
            layout
            className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm"
          >
            {/* Order Header */}
            <button
              onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
              className="w-full flex items-center justify-between p-5 hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={`p-2.5 rounded-xl border ${status.bg}`}>
                  <StatusIcon className={`w-5 h-5 ${status.color}`} />
                </div>
                <div className="text-left">
                  <p className="font-bold text-sm text-foreground font-mono">{order.orderNumber}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <p className="font-bold text-foreground">₹{parseFloat(order.totalAmount).toLocaleString('en-IN')}</p>
                  <p className="text-xs text-muted-foreground">{order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}</p>
                </div>
                <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${status.bg} ${status.color}`}>
                  {status.label}
                </span>
                <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
              </div>
            </button>

            {/* Order Items (Expanded) */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-border overflow-hidden"
                >
                  <div className="p-5 space-y-4">
                    {/* Order Items */}
                    <div className="space-y-3">
                      {order.items?.map((item: any) => (
                        <div key={item.id} className="flex items-center gap-3">
                          {item.productImage ? (
                            <img src={item.productImage} alt={item.productName} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                          ) : (
                            <div className="w-14 h-14 bg-muted rounded-xl flex items-center justify-center flex-shrink-0">
                              <Leaf className="w-6 h-6 text-muted-foreground" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{item.productName}</p>
                            <p className="text-xs text-muted-foreground">Qty: {item.quantity} × ₹{parseFloat(item.unitPrice).toLocaleString('en-IN')}</p>
                          </div>
                          <p className="font-semibold text-sm flex-shrink-0">₹{parseFloat(item.totalPrice).toLocaleString('en-IN')}</p>
                        </div>
                      ))}
                    </div>

                    {/* Order Summary */}
                    <div className="bg-muted/50 rounded-xl p-4 space-y-2 text-sm">
                      <div className="flex justify-between text-muted-foreground">
                        <span>Subtotal</span>
                        <span>₹{parseFloat(order.subtotal).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Delivery</span>
                        <span className={parseFloat(order.deliveryCharge) === 0 ? 'text-green-600 font-medium' : ''}>
                          {parseFloat(order.deliveryCharge) === 0 ? 'FREE' : `₹${parseFloat(order.deliveryCharge).toLocaleString('en-IN')}`}
                        </span>
                      </div>
                      <div className="flex justify-between font-bold text-foreground border-t border-border pt-2">
                        <span>Total</span>
                        <span>₹{parseFloat(order.totalAmount).toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    {/* Delivery Address */}
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
                      <p className="leading-relaxed">{order.deliveryAddressText}</p>
                    </div>

                    {/* Payment Info */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Payment</span>
                      <span className={`font-medium px-2.5 py-1 rounded-full text-xs ${
                        order.paymentStatus === 'paid'
                          ? 'bg-green-50 text-green-700 border border-green-200'
                          : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                      }`}>
                        {order.paymentMethod} · {order.paymentStatus}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className="flex justify-center gap-2 pt-2">
          {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                p === page
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border border-border hover:bg-muted text-muted-foreground'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── ADDRESSES TAB ────────────────────────────────────────────────────────────
function AddressesTab() {
  const { customerFetch } = useCustomerApi();
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editAddress, setEditAddress] = useState<any>(null);
  const [form, setForm] = useState({
    fullName: '', phone: '', addressLine1: '', addressLine2: '',
    city: '', state: '', pincode: '', landmark: '', isDefault: false
  });
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    customerFetch('/customer/addresses')
      .then((d: any) => setAddresses(d.data || []))
      .catch(() => toast.error('Failed to load addresses'))
      .finally(() => setLoading(false));
  }, [customerFetch]);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => {
    setEditAddress(null);
    setForm({ fullName: '', phone: '', addressLine1: '', addressLine2: '', city: '', state: '', pincode: '', landmark: '', isDefault: false });
    setShowForm(true);
  };

  const openEdit = (addr: any) => {
    setEditAddress(addr);
    setForm({
      fullName: addr.fullName, phone: addr.phone, addressLine1: addr.addressLine1,
      addressLine2: addr.addressLine2 || '', city: addr.city, state: addr.state,
      pincode: addr.pincode, landmark: addr.landmark || '', isDefault: addr.isDefault
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editAddress) {
        await customerFetch(`/customer/addresses/${editAddress.id}`, { method: 'PUT', body: JSON.stringify(form) });
        toast.success('Address updated!');
      } else {
        await customerFetch('/customer/addresses', { method: 'POST', body: JSON.stringify(form) });
        toast.success('Address added!');
      }
      setShowForm(false);
      load();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this address?')) return;
    try {
      await customerFetch(`/customer/addresses/${id}`, { method: 'DELETE' });
      toast.success('Address deleted');
      load();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-16">
      <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-lg text-foreground">Saved Addresses</h3>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Address
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-10 text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold mb-2">No addresses saved</h3>
          <p className="text-muted-foreground text-sm mb-4">Add your delivery address for faster checkout.</p>
          <button onClick={openAdd} className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90">
            Add Address
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <motion.div
              key={addr.id}
              layout
              className={`relative bg-card border rounded-2xl p-5 ${addr.isDefault ? 'border-primary shadow-sm ring-1 ring-primary/20' : 'border-border hover:border-primary/30 transition-colors'}`}
            >
              {addr.isDefault && (
                <span className="absolute top-4 right-4 px-2.5 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full border border-primary/20">
                  Default
                </span>
              )}
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div className="min-w-0 flex-1 pr-16">
                  <p className="font-bold text-foreground">{addr.fullName}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">{addr.phone}</p>
                </div>
              </div>
              <p className="text-sm text-foreground leading-relaxed">
                {addr.addressLine1}
                {addr.addressLine2 && `, ${addr.addressLine2}`}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {addr.city}, {addr.state} – {addr.pincode}
              </p>
              {addr.landmark && (
                <p className="text-xs text-muted-foreground mt-1">Near: {addr.landmark}</p>
              )}

              <div className="flex gap-2 mt-4 pt-4 border-t border-border">
                <button
                  onClick={() => openEdit(addr)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 text-sm text-primary bg-primary/10 hover:bg-primary/20 rounded-xl transition-colors font-medium"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(addr.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 text-sm text-destructive bg-destructive/10 hover:bg-destructive/20 rounded-xl transition-colors font-medium"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Address Form Modal */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowForm(false)} className="fixed inset-0 bg-black/50 z-50" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-card rounded-2xl shadow-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-lg">{editAddress ? 'Edit Address' : 'Add New Address'}</h3>
                <button onClick={() => setShowForm(false)} className="p-2 hover:bg-muted rounded-lg">
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              <div className="space-y-4">
                {[
                  { key: 'fullName', label: 'Full Name *', placeholder: 'John Doe' },
                  { key: 'phone', label: 'Phone *', placeholder: '9876543210', type: 'tel' },
                  { key: 'addressLine1', label: 'Address Line 1 *', placeholder: 'House/Flat, Street, Area' },
                  { key: 'addressLine2', label: 'Address Line 2', placeholder: 'Landmark, Colony (optional)' },
                  { key: 'city', label: 'City *', placeholder: 'Bengaluru' },
                  { key: 'state', label: 'State *', placeholder: 'Karnataka' },
                  { key: 'pincode', label: 'Pincode *', placeholder: '560001', maxLength: 6 },
                  { key: 'landmark', label: 'Landmark', placeholder: 'Near park / Metro station (optional)' },
                ].map(({ key, label, placeholder, type = 'text', maxLength }) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-foreground mb-1.5">{label}</label>
                    <input
                      type={type}
                      value={form[key as keyof typeof form] as string}
                      onChange={(e) => setForm(f => ({ ...f, [key]: e.target.value }))}
                      placeholder={placeholder}
                      maxLength={maxLength}
                      className="w-full px-4 py-3 border border-input bg-background rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                ))}

                <label className="flex items-center gap-3 cursor-pointer p-3 border border-border rounded-xl hover:bg-muted/50 transition-colors">
                  <input
                    type="checkbox"
                    checked={form.isDefault}
                    onChange={(e) => setForm(f => ({ ...f, isDefault: e.target.checked }))}
                    className="w-4 h-4 rounded border-input text-primary"
                  />
                  <span className="text-sm font-medium">Set as default address</span>
                </label>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowForm(false)} className="flex-1 px-4 py-3 border border-border rounded-xl text-sm font-medium hover:bg-muted transition-colors">Cancel</button>
                <button onClick={handleSave} disabled={saving} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90">
                  {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                  {editAddress ? 'Update' : 'Save Address'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── LOGIN MODAL ──────────────────────────────────────────────────────────────
function LoginModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const { sendOtp, verifyOtp } = useCustomerAuth();
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [countdown]);

  const handleSendOtp = async () => {
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) { setError('Enter a valid email address'); return; }
    setLoading(true);
    setError('');
    try {
      await sendOtp(email);
      setStep('otp');
      setCountdown(60);
      toast.success('OTP sent to your email!');
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) { setError('Enter the 6-digit OTP'); return; }
    
    setLoading(true);
    setError('');
    try {
      await verifyOtp(email, otp);
      toast.success('Welcome back!');
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Invalid OTP code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-card rounded-3xl shadow-2xl p-8 w-full max-w-sm border border-border"
      >
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
            <Leaf className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">
            {step === 'email' ? 'Sign In' : 'Verify OTP'}
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            {step === 'email' ? 'Enter your email address to continue' : `OTP sent to ${email}`}
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-xl mb-4 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {step === 'email' ? (
          <div className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value.toLowerCase())}
              placeholder="hello@example.com"
              className="w-full px-4 py-4 border border-input bg-background rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-primary"
              onKeyDown={(e) => e.key === 'Enter' && handleSendOtp()}
            />
            <button
              onClick={handleSendOtp}
              disabled={loading || !email}
              className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-semibold text-base hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="• • • • • •"
                className="w-full px-4 py-4 border border-input bg-background rounded-xl text-2xl text-center focus:outline-none focus:ring-2 focus:ring-primary font-mono tracking-[0.5em]"
                onKeyDown={(e) => e.key === 'Enter' && handleVerifyOtp()}
              />
              <div className="flex justify-between items-center mt-2">
                <button
                  onClick={() => setStep('email')}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Change email
                </button>
                {countdown > 0 ? (
                  <p className="text-xs text-muted-foreground">Resend in {countdown}s</p>
                ) : (
                  <button onClick={handleSendOtp} className="text-xs text-primary font-medium hover:underline">Resend OTP</button>
                )}
              </div>
            </div>
            <button
              onClick={handleVerifyOtp}
              disabled={loading || otp.length !== 6}
              className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-semibold text-base hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Verifying...' : 'Verify & Continue'}
            </button>
            
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-center">
              <p className="text-xs text-amber-700">
                🛠️ <strong>Dev Mode:</strong> Check server console for OTP
              </p>
            </div>
          </div>
        )}
      </motion.div>
    </>
  );
}
