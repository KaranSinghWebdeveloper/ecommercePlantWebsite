"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard, Package, ShoppingCart, Settings, Users, BarChart3,
  Plus, Edit, Trash2, Search, ArrowLeft, TrendingUp, DollarSign
} from 'lucide-react';
import { motion } from 'motion/react';
import { products as allProducts, categories } from '../data/products';
import { productImages } from '../data/imageMapping';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const productsWithImages = allProducts.map(p => ({
    ...p,
    image: productImages[p.id as keyof typeof productImages],
  }));

  // Mock data for dashboard
  const stats = {
    totalRevenue: 125000,
    totalOrders: 342,
    totalProducts: allProducts.length,
    totalCustomers: 1250,
  };

  const recentOrders = [
    {
      id: 'ORD12345',
      customer: 'Priya Sharma',
      items: 2,
      amount: 1298,
      status: 'delivered',
      date: '2026-06-01',
    },
    {
      id: 'ORD12346',
      customer: 'Rahul Verma',
      items: 1,
      amount: 799,
      status: 'shipped',
      date: '2026-06-02',
    },
    {
      id: 'ORD12347',
      customer: 'Sneha Patel',
      items: 3,
      amount: 2197,
      status: 'pending',
      date: '2026-06-02',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-700';
      case 'shipped':
        return 'bg-blue-100 text-blue-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-6 rounded-2xl shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="w-8 h-8" />
            <TrendingUp className="w-5 h-5" />
          </div>
          <p className="text-sm opacity-90 mb-1">Total Revenue</p>
          <p className="text-3xl font-bold">₹{mounted ? stats.totalRevenue.toLocaleString() : stats.totalRevenue}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-secondary to-secondary/80 text-secondary-foreground p-6 rounded-2xl shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <ShoppingCart className="w-8 h-8" />
            <TrendingUp className="w-5 h-5" />
          </div>
          <p className="text-sm opacity-90 mb-1">Total Orders</p>
          <p className="text-3xl font-bold">{stats.totalOrders}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-accent to-accent/80 text-accent-foreground p-6 rounded-2xl shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <Package className="w-8 h-8" />
            <TrendingUp className="w-5 h-5" />
          </div>
          <p className="text-sm opacity-90 mb-1">Total Products</p>
          <p className="text-3xl font-bold">{stats.totalProducts}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-muted to-muted/80 text-foreground p-6 rounded-2xl shadow-lg border border-border"
        >
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8" />
            <TrendingUp className="w-5 h-5" />
          </div>
          <p className="text-sm text-muted-foreground mb-1">Total Customers</p>
          <p className="text-3xl font-bold">{stats.totalCustomers}</p>
        </motion.div>
      </div>

      {/* Recent Orders */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-semibold">Order ID</th>
                <th className="text-left py-3 px-4 text-sm font-semibold">Customer</th>
                <th className="text-left py-3 px-4 text-sm font-semibold">Items</th>
                <th className="text-left py-3 px-4 text-sm font-semibold">Amount</th>
                <th className="text-left py-3 px-4 text-sm font-semibold">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-4 font-medium">{order.id}</td>
                  <td className="py-3 px-4">{order.customer}</td>
                  <td className="py-3 px-4">{order.items}</td>
                  <td className="py-3 px-4 font-semibold">₹{order.amount}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">Product Management</h2>
        <div className="flex gap-3">
          <div className="relative flex-1 md:w-64">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 rounded-lg border border-input bg-input-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          </div>
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 whitespace-nowrap">
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-semibold">Image</th>
                <th className="text-left py-3 px-4 text-sm font-semibold">Product</th>
                <th className="text-left py-3 px-4 text-sm font-semibold">Category</th>
                <th className="text-left py-3 px-4 text-sm font-semibold">Price</th>
                <th className="text-left py-3 px-4 text-sm font-semibold">Stock</th>
                <th className="text-left py-3 px-4 text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {productsWithImages
                .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((product) => (
                  <tr key={product.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted">
                        <ImageWithFallback
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-semibold">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.size}</p>
                    </td>
                    <td className="py-3 px-4 text-sm">{product.category}</td>
                    <td className="py-3 px-4">
                      <p className="font-semibold">₹{product.price}</p>
                      {product.originalPrice && (
                        <p className="text-xs text-muted-foreground line-through">
                          ₹{product.originalPrice}
                        </p>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                          <Edit className="w-4 h-4 text-primary" />
                        </button>
                        <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Order Management</h2>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg">
          All Orders
        </button>
        <button className="px-4 py-2 bg-card border border-border rounded-lg hover:bg-muted transition-colors">
          Pending
        </button>
        <button className="px-4 py-2 bg-card border border-border rounded-lg hover:bg-muted transition-colors">
          Packed
        </button>
        <button className="px-4 py-2 bg-card border border-border rounded-lg hover:bg-muted transition-colors">
          Shipped
        </button>
        <button className="px-4 py-2 bg-card border border-border rounded-lg hover:bg-muted transition-colors">
          Delivered
        </button>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-semibold">Order ID</th>
                <th className="text-left py-3 px-4 text-sm font-semibold">Customer</th>
                <th className="text-left py-3 px-4 text-sm font-semibold">Items</th>
                <th className="text-left py-3 px-4 text-sm font-semibold">Amount</th>
                <th className="text-left py-3 px-4 text-sm font-semibold">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold">Date</th>
                <th className="text-left py-3 px-4 text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-4 font-medium">{order.id}</td>
                  <td className="py-3 px-4">{order.customer}</td>
                  <td className="py-3 px-4">{order.items}</td>
                  <td className="py-3 px-4 font-semibold">₹{order.amount}</td>
                  <td className="py-3 px-4">
                    <select className="px-2 py-1 rounded text-xs font-medium border border-border bg-input-background">
                      <option value="pending">Pending</option>
                      <option value="packed">Packed</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">{order.date}</td>
                  <td className="py-3 px-4">
                    <button className="text-primary hover:underline text-sm font-medium">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderCategories = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Category Management</h2>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div key={category.id} className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-lg">{category.name}</h3>
                <p className="text-sm text-muted-foreground">{category.productCount} products</p>
              </div>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                  <Edit className="w-4 h-4 text-primary" />
                </button>
                <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4 text-destructive" />
                </button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{category.description}</p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Back to Store</span>
              </Link>
              <div className="h-6 w-px bg-border" />
              <h1 className="text-xl md:text-2xl font-bold">Admin Dashboard</h1>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 rounded-lg hover:bg-muted transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="bg-card border border-border rounded-2xl p-4 space-y-2 sticky top-24">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'dashboard'
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted'
                  }`}
              >
                <LayoutDashboard className="w-5 h-5" />
                <span>Dashboard</span>
              </button>
              <button
                onClick={() => setActiveTab('products')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'products'
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted'
                  }`}
              >
                <Package className="w-5 h-5" />
                <span>Products</span>
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'orders'
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted'
                  }`}
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Orders</span>
              </button>
              <button
                onClick={() => setActiveTab('categories')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'categories'
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted'
                  }`}
              >
                <BarChart3 className="w-5 h-5" />
                <span>Categories</span>
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'products' && renderProducts()}
            {activeTab === 'orders' && renderOrders()}
            {activeTab === 'categories' && renderCategories()}
          </div>
        </div>
      </div>
    </div>
  );
}
