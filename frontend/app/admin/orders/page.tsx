"use client";

import React, { useState, useEffect } from 'react';
import { Package, Search, ChevronLeft, ChevronRight, CheckCircle, Truck, Clock } from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchOrders = async (pageNum: number = 1, searchQuery: string = '', status: string = '') => {
    setLoading(true);
    try {
      const url = new URL(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/admin/orders`);
      url.searchParams.append('page', pageNum.toString());
      url.searchParams.append('limit', '10');
      if (searchQuery) url.searchParams.append('search', searchQuery);
      if (status) url.searchParams.append('status', status);

      const res = await fetch(url.toString());
      const data = await res.json();
      if (data.success) {
        setOrders(data.data.orders);
        setTotalPages(data.data.pagination.totalPages);
        setPage(pageNum);
      }
    } catch (err) {
      console.error('Failed to fetch orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(1, search, statusFilter);
  }, [statusFilter]); // trigger on status filter change

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders(1, search, statusFilter);
  };

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        // Optimistically update
        setOrders(orders.map(o => o.id === orderId ? { ...o, orderStatus: newStatus } : o));
      }
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'packed', label: 'Packed' },
    { value: 'out_for_delivery', label: 'Out for Delivery' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Package className="w-8 h-8 text-primary" />
          Orders Management
        </h1>
      </div>

      {/* Filters & Search */}
      <div className="bg-card p-4 rounded-2xl shadow-sm border border-border mb-6 flex flex-wrap gap-4 items-center justify-between">
        <form onSubmit={handleSearch} className="flex gap-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by order ID, name, or phone..."
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-input bg-background text-sm"
            />
          </div>
          <button type="submit" className="px-4 py-2 bg-secondary text-secondary-foreground text-sm font-semibold rounded-lg hover:bg-secondary/80">
            Search
          </button>
        </form>

        <div className="flex gap-2 items-center">
          <label className="text-sm font-medium text-muted-foreground">Filter by Status:</label>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-input bg-background rounded-lg px-3 py-2 text-sm font-medium outline-none focus:border-primary"
          >
            <option value="">All Orders</option>
            {statusOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-muted/50 text-muted-foreground uppercase text-xs">
              <tr>
                <th className="px-6 py-4 font-semibold">Order Details</th>
                <th className="px-6 py-4 font-semibold">Customer</th>
                <th className="px-6 py-4 font-semibold">Total</th>
                <th className="px-6 py-4 font-semibold">Payment</th>
                <th className="px-6 py-4 font-semibold text-center">Status</th>
                <th className="px-6 py-4 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-primary">{order.orderNumber}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString()}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold">{order.customerName}</p>
                      <p className="text-xs text-muted-foreground">{order.customerPhone}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold">₹{order.totalAmount}</p>
                      <p className="text-xs text-muted-foreground">{order.freeDeliveryApplied ? 'Free Del' : `Del: ₹${order.deliveryCharge}`}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-2 py-1 rounded bg-secondary text-secondary-foreground text-xs font-medium">
                        {order.paymentMethod} ({order.paymentStatus})
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <select 
                        value={order.orderStatus}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`text-xs font-bold rounded-full px-3 py-1 outline-none appearance-none cursor-pointer text-center
                          ${order.orderStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' : ''}
                          ${order.orderStatus === 'confirmed' ? 'bg-blue-100 text-blue-700' : ''}
                          ${order.orderStatus === 'packed' ? 'bg-purple-100 text-purple-700' : ''}
                          ${order.orderStatus === 'out_for_delivery' ? 'bg-orange-100 text-orange-700' : ''}
                          ${order.orderStatus === 'delivered' ? 'bg-green-100 text-green-700' : ''}
                          ${order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-700' : ''}
                        `}
                      >
                        {statusOptions.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="text-sm text-primary hover:underline font-semibold">View</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="border-t border-border p-4 flex items-center justify-between text-sm">
            <p className="text-muted-foreground">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button 
                onClick={() => fetchOrders(page - 1, search, statusFilter)}
                disabled={page === 1}
                className="p-2 border border-input rounded-lg disabled:opacity-50 hover:bg-muted"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={() => fetchOrders(page + 1, search, statusFilter)}
                disabled={page === totalPages}
                className="p-2 border border-input rounded-lg disabled:opacity-50 hover:bg-muted"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
