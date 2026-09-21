import { useState } from 'react';
import {
  Package,
  ShoppingBag,
  Search,
  Plus,
  Minus,
  Trash2,
  Printer,
  CreditCard,
  QrCode,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Filter,
  User,
  X,
  RotateCcw,
  Tag,
  Receipt,
} from 'lucide-react';
import { InventoryProduct, PosTransaction, Student } from '../types';
import { INITIAL_INVENTORY, INITIAL_POS_TRANSACTIONS } from '../data/mockData';

interface CampusPosStoreViewProps {
  students: Student[];
  inventory?: InventoryProduct[];
  onUpdateInventory?: (products: InventoryProduct[]) => void;
}

export default function CampusPosStoreView({
  students,
  inventory = INITIAL_INVENTORY,
  onUpdateInventory,
}: CampusPosStoreViewProps) {
  const [activeTab, setActiveTab] = useState<'terminal' | 'inventory' | 'history'>('terminal');
  const [products, setProducts] = useState<InventoryProduct[]>(inventory);
  const [transactions, setTransactions] = useState<PosTransaction[]>(INITIAL_POS_TRANSACTIONS);

  // Cart State
  const [cart, setCart] = useState<
    { product: InventoryProduct; qty: number; lineTotal: number }[]
  >([]);
  const [selectedCustomerType, setSelectedCustomerType] = useState<'Student' | 'Walk-in'>('Student');
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || 'std-1');
  const [walkInName, setWalkInName] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [tenderedCash, setTenderedCash] = useState(0);
  const [paymentMode, setPaymentMode] = useState<'Cash' | 'Card' | 'Easypaisa' | 'JazzCash'>('Cash');

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [productSearch, setProductSearch] = useState('');

  // Modals
  const [completedReceipt, setCompletedReceipt] = useState<PosTransaction | null>(null);
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [targetRestockProduct, setTargetRestockProduct] = useState<InventoryProduct | null>(null);
  const [restockQty, setRestockQty] = useState(25);

  // Calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + item.lineTotal, 0);
  const cartNetTotal = Math.max(0, cartSubtotal - discountAmount);
  const returnChange = tenderedCash >= cartNetTotal ? tenderedCash - cartNetTotal : 0;

  const lowStockCount = products.filter((p) => p.stockQty <= p.reorderLevel).length;
  const todayTotalRevenue = transactions.reduce((sum, t) => sum + t.netTotal, 0);

  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.sku.toLowerCase().includes(productSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleAddToCart = (product: InventoryProduct) => {
    if (product.stockQty <= 0) {
      alert(`"${product.name}" is currently OUT OF STOCK! Please restock from supplier.`);
      return;
    }
    const existingIndex = cart.findIndex((item) => item.product.id === product.id);
    if (existingIndex > -1) {
      const updated = [...cart];
      if (updated[existingIndex].qty < product.stockQty) {
        updated[existingIndex].qty += 1;
        updated[existingIndex].lineTotal = updated[existingIndex].qty * product.unitPrice;
        setCart(updated);
      } else {
        alert(`Cannot add more than available stock (${product.stockQty})!`);
      }
    } else {
      setCart([...cart, { product, qty: 1, lineTotal: product.unitPrice }]);
    }
  };

  const handleUpdateCartQty = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.qty + delta;
            if (newQty <= 0) return null;
            if (newQty > item.product.stockQty) {
              alert(`Maximum available stock is ${item.product.stockQty}!`);
              return item;
            }
            return {
              ...item,
              qty: newQty,
              lineTotal: newQty * item.product.unitPrice,
            };
          }
          return item;
        })
        .filter(Boolean) as any
    );
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert('Cart is empty! Please add items before checkout.');
      return;
    }

    const customerName =
      selectedCustomerType === 'Student'
        ? students.find((s) => s.id === selectedStudentId)?.name || 'Registered Student'
        : walkInName || 'Walk-in Parent';

    const newTx: PosTransaction = {
      id: `pos-${Date.now()}`,
      invoiceNo: `POS-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0],
      customerType: selectedCustomerType,
      studentId: selectedCustomerType === 'Student' ? selectedStudentId : undefined,
      customerName,
      items: cart.map((c) => ({
        productId: c.product.id,
        productName: c.product.name,
        qty: c.qty,
        unitPrice: c.product.unitPrice,
        total: c.lineTotal,
      })),
      subTotal: cartSubtotal,
      discount: discountAmount,
      tax: 0,
      netTotal: cartNetTotal,
      tenderedAmount: tenderedCash > 0 ? tenderedCash : cartNetTotal,
      changeAmount: returnChange,
      paymentMode,
    };

    // Deduct inventory stock
    const updatedProducts = products.map((p) => {
      const cartItem = cart.find((c) => c.product.id === p.id);
      if (cartItem) {
        return { ...p, stockQty: Math.max(0, p.stockQty - cartItem.qty) };
      }
      return p;
    });

    setProducts(updatedProducts);
    if (onUpdateInventory) {
      onUpdateInventory(updatedProducts);
    }
    setTransactions([newTx, ...transactions]);
    setCompletedReceipt(newTx);

    // Reset Cart
    setCart([]);
    setDiscountAmount(0);
    setTenderedCash(0);
    setWalkInName('');
  };

  const handleRestock = () => {
    if (!targetRestockProduct) return;
    const updated = products.map((p) =>
      p.id === targetRestockProduct.id ? { ...p, stockQty: p.stockQty + Number(restockQty) } : p
    );
    setProducts(updated);
    if (onUpdateInventory) {
      onUpdateInventory(updated);
    }
    setShowRestockModal(false);
    alert(`Stock for "${targetRestockProduct.name}" increased by ${restockQty} units!`);
  };

  return (
    <div id="campus-pos-store-module" className="space-y-4">
      {/* Top Banner with Stats */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-amber-600" />
              <h2 className="text-base font-bold text-slate-800">
                Campus Point-of-Sale (POS) Uniform &amp; Book Store
              </h2>
              <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-full border border-amber-200">
                80mm Thermal Billing Ready
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Rapid barcode cashier checkout, student uniform sets, Oxford book syllabus packs, and real-time inventory ledger.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('terminal')}
              className="px-3 py-1.5 bg-[#1b3b6f] hover:bg-[#142d55] text-white text-xs font-bold rounded shadow-xs flex items-center gap-1.5 transition"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Open POS Cashier</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('inventory')}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded shadow-xs flex items-center gap-1.5 transition"
            >
              <Package className="w-3.5 h-3.5" />
              <span>Inventory Warehouse ({products.length})</span>
            </button>
          </div>
        </div>

        {/* 4 Financial Metrics Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <div className="bg-slate-50 border border-slate-200 rounded p-3">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Today's Sales Revenue</span>
            <div className="text-lg font-bold text-slate-800 font-mono mt-0.5">
              Rs. {todayTotalRevenue.toLocaleString()}
            </div>
            <span className="text-[10px] text-slate-400">{transactions.length} Sales Completed</span>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded p-3">
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Total Catalog SKUs</span>
            <div className="text-lg font-bold text-emerald-700 font-mono mt-0.5">
              {products.length} Products
            </div>
            <span className="text-[10px] text-emerald-600 font-semibold">Uniforms, Books &amp; Copies</span>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded p-3">
            <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">Low Stock Threshold</span>
            <div className="text-lg font-bold text-amber-700 font-mono mt-0.5">
              {lowStockCount} Items
            </div>
            <span className="text-[10px] text-amber-600 font-bold">&lt; 10 Units Remaining</span>
          </div>

          <div className="bg-sky-50 border border-sky-200 rounded p-3">
            <span className="text-[11px] font-bold text-sky-700 uppercase tracking-wider">Active Cart Items</span>
            <div className="text-lg font-bold text-sky-800 font-mono mt-0.5">
              {cart.reduce((sum, i) => sum + i.qty, 0)} Units
            </div>
            <span className="text-[10px] text-sky-600 font-semibold">Rs. {cartNetTotal.toLocaleString()} Net</span>
          </div>
        </div>

        {/* Sub-tabs Navigation */}
        <div className="flex flex-wrap items-center gap-1.5 mt-4 pt-3 border-t border-slate-100 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('terminal')}
            className={`px-3 py-1.5 rounded transition flex items-center gap-1.5 ${
              activeTab === 'terminal' ? 'bg-[#1b3b6f] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Cashier Billing Terminal</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('inventory')}
            className={`px-3 py-1.5 rounded transition flex items-center gap-1.5 ${
              activeTab === 'inventory' ? 'bg-[#1b3b6f] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Inventory &amp; Restocking Ledger</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 rounded transition flex items-center gap-1.5 ${
              activeTab === 'history' ? 'bg-[#1b3b6f] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>Sales History &amp; Receipts</span>
          </button>
        </div>
      </div>

      {/* 1. POS CASHIER BILLING TERMINAL */}
      {activeTab === 'terminal' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-xs">
          {/* Left 2 Cols: Product Catalog & Category Tap */}
          <div className="lg:col-span-2 space-y-3">
            {/* Search & Category Tabs */}
            <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs space-y-2.5">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Scan barcode or type item name (e.g. Uniform, Oxford, Notebooks)..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-xs outline-none focus:border-sky-500 focus:bg-white"
                />
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                {['All', 'Uniform', 'Books', 'Stationery', 'Accessories'].map((cat) => (
                  <button
                    type="button"
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded text-xs font-semibold transition ${
                      selectedCategory === cat
                        ? 'bg-[#1b3b6f] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Product Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {filteredProducts.map((p) => {
                const isLow = p.stockQty <= p.reorderLevel;
                const isOut = p.stockQty === 0;
                return (
                  <div
                    key={p.id}
                    className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs flex flex-col justify-between space-y-2 hover:border-amber-400 transition"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-mono text-slate-400 font-bold">{p.sku}</span>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                            isOut
                              ? 'bg-red-100 text-red-800'
                              : isLow
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {isOut ? 'Out of Stock' : `${p.stockQty} In Stock`}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-xs line-clamp-2">{p.name}</h4>
                      <span className="text-[10px] text-slate-500 block">{p.category}</span>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-sm font-bold font-mono text-slate-900">
                        Rs. {p.unitPrice.toLocaleString()}
                      </span>
                      <button
                        type="button"
                        disabled={isOut}
                        onClick={() => handleAddToCart(p)}
                        className={`px-2.5 py-1 rounded font-bold text-[11px] flex items-center gap-1 shadow-xs transition ${
                          isOut
                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            : 'bg-amber-600 hover:bg-amber-700 text-white'
                        }`}
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Col: POS Shopping Cart & Checkout Panel */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-4 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-amber-600" />
                  <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Active Sale Bill</h3>
                </div>
                {cart.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setCart([])}
                    className="text-[10px] text-red-600 hover:underline font-bold"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Customer Selector */}
              <div className="space-y-2 bg-slate-50 p-2.5 rounded border border-slate-200 text-[11px]">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-slate-700">Customer Type:</label>
                  <div className="flex gap-2">
                    {(['Student', 'Walk-in'] as const).map((type) => (
                      <label key={type} className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="radio"
                          name="custType"
                          checked={selectedCustomerType === type}
                          onChange={() => setSelectedCustomerType(type)}
                          className="text-amber-600"
                        />
                        <span>{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {selectedCustomerType === 'Student' ? (
                  <select
                    value={selectedStudentId}
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                    className="w-full px-2 py-1 border rounded bg-white font-medium text-xs"
                  >
                    {students.map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.name} ({st.className} - {st.studentCode})
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    placeholder="Parent / Customer Name"
                    value={walkInName}
                    onChange={(e) => setWalkInName(e.target.value)}
                    className="w-full px-2 py-1 border rounded bg-white text-xs"
                  />
                )}
              </div>

              {/* Cart Items List */}
              <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                {cart.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    <ShoppingBag className="w-8 h-8 mx-auto mb-1 opacity-40" />
                    <span>No items added to cart yet.</span>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200 text-[11px]"
                    >
                      <div className="flex-1 pr-2">
                        <span className="font-bold text-slate-900 block truncate">{item.product.name}</span>
                        <span className="text-slate-500 font-mono">Rs. {item.product.unitPrice} each</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleUpdateCartQty(item.product.id, -1)}
                          className="p-1 bg-white border border-slate-300 rounded hover:bg-slate-100"
                        >
                          <Minus className="w-2.5 h-2.5" />
                        </button>
                        <span className="font-bold font-mono px-1">{item.qty}</span>
                        <button
                          type="button"
                          onClick={() => handleUpdateCartQty(item.product.id, 1)}
                          className="p-1 bg-white border border-slate-300 rounded hover:bg-slate-100"
                        >
                          <Plus className="w-2.5 h-2.5" />
                        </button>
                      </div>

                      <div className="text-right pl-3 font-mono font-bold text-slate-800">
                        Rs. {item.lineTotal}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Billing Summary & Tender */}
            <form onSubmit={handleCheckout} className="space-y-3 border-t pt-3">
              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span>Rs. {cartSubtotal.toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-600 font-sans">Discount (PKR):</span>
                  <input
                    type="number"
                    value={discountAmount}
                    onChange={(e) => setDiscountAmount(Number(e.target.value))}
                    className="w-20 px-1.5 py-0.5 border rounded text-right font-mono font-bold text-emerald-700"
                  />
                </div>

                <div className="flex justify-between font-bold text-slate-900 border-t pt-1 text-sm">
                  <span>NET TOTAL:</span>
                  <span className="text-emerald-800">Rs. {cartNetTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Payment Mode Selector */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Payment Mode
                </label>
                <div className="grid grid-cols-4 gap-1 text-[11px] font-bold">
                  {(['Cash', 'Card', 'Easypaisa', 'JazzCash'] as const).map((m) => (
                    <button
                      type="button"
                      key={m}
                      onClick={() => setPaymentMode(m)}
                      className={`py-1 rounded border text-center transition ${
                        paymentMode === m
                          ? 'bg-[#1b3b6f] text-white border-[#1b3b6f]'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cash Tender & Change */}
              {paymentMode === 'Cash' && (
                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2 rounded border border-slate-200 text-xs">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">Tendered Cash</label>
                    <input
                      type="number"
                      value={tenderedCash}
                      onChange={(e) => setTenderedCash(Number(e.target.value))}
                      className="w-full px-2 py-1 border rounded font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">Change to Return</label>
                    <div className="px-2 py-1 bg-white border border-slate-200 rounded font-mono font-bold text-emerald-700">
                      Rs. {returnChange.toLocaleString()}
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={cart.length === 0}
                className={`w-full py-2.5 rounded font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition ${
                  cart.length === 0
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-[#28a745] hover:bg-[#218838] text-white'
                }`}
              >
                <Printer className="w-4 h-4" />
                <span>Print POS Receipt &amp; Settle</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 2. INVENTORY & RESTOCKING LEDGER */}
      {activeTab === 'inventory' && (
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-4 text-xs">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Campus Store Warehouse Stock Ledger</h3>
              <p className="text-slate-500 text-xs mt-0.5">
                Track stock quantities, reorder thresholds, unit prices, and register wholesale vendor restock batches.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setTargetRestockProduct(products[0]);
                setShowRestockModal(true);
              }}
              className="px-3 py-1.5 bg-[#1b3b6f] hover:bg-[#142d55] text-white font-bold rounded flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Restock Inventory</span>
            </button>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded">
            <table className="w-full text-left">
              <thead className="bg-[#1b3b6f] text-white font-bold text-[11px] uppercase">
                <tr>
                  <th className="p-2.5">SKU</th>
                  <th className="p-2.5">Item Description</th>
                  <th className="p-2.5">Category</th>
                  <th className="p-2.5 text-center">Unit Price</th>
                  <th className="p-2.5 text-center">In Stock</th>
                  <th className="p-2.5 text-center">Reorder Limit</th>
                  <th className="p-2.5 text-center">Status</th>
                  <th className="p-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((p) => {
                  const isLow = p.stockQty <= p.reorderLevel;
                  return (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="p-2.5 font-mono font-bold text-slate-700">{p.sku}</td>
                      <td className="p-2.5 font-bold text-slate-900">{p.name}</td>
                      <td className="p-2.5 text-slate-600">{p.category}</td>
                      <td className="p-2.5 text-center font-mono font-bold text-slate-800">
                        Rs. {p.unitPrice.toLocaleString()}
                      </td>
                      <td className="p-2.5 text-center font-mono font-bold text-slate-900">
                        {p.stockQty} Units
                      </td>
                      <td className="p-2.5 text-center font-mono text-slate-500">
                        {p.reorderLevel} Units
                      </td>
                      <td className="p-2.5 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            isLow ? 'bg-red-100 text-red-800 border border-red-300' : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {isLow ? 'LOW STOCK' : 'HEALTHY'}
                        </span>
                      </td>
                      <td className="p-2.5 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setTargetRestockProduct(p);
                            setShowRestockModal(true);
                          }}
                          className="px-2 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded font-bold text-[11px]"
                        >
                          Restock
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. SALES HISTORY & RECEIPTS */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-4 text-xs">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-800">POS Sales Transaction Audit Journal</h3>
              <p className="text-slate-500 text-xs mt-0.5">
                Complete log of store invoices with payment modes, item counts, and reprintable thermal receipts.
              </p>
            </div>
            <span className="font-mono font-bold text-emerald-700 text-sm">
              Today's Drawer: Rs. {todayTotalRevenue.toLocaleString()}
            </span>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded">
            <table className="w-full text-left">
              <thead className="bg-[#1b3b6f] text-white font-bold text-[11px] uppercase">
                <tr>
                  <th className="p-2.5">Invoice #</th>
                  <th className="p-2.5">Date</th>
                  <th className="p-2.5">Customer Name</th>
                  <th className="p-2.5">Items Purchased</th>
                  <th className="p-2.5 text-center">Payment Mode</th>
                  <th className="p-2.5 text-right">Net Billed</th>
                  <th className="p-2.5 text-center">Thermal Slip</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50">
                    <td className="p-2.5 font-mono font-bold text-slate-800">{tx.invoiceNo}</td>
                    <td className="p-2.5 text-slate-600 font-mono">{tx.date}</td>
                    <td className="p-2.5 font-bold text-slate-900">{tx.customerName}</td>
                    <td className="p-2.5 text-slate-600">
                      {tx.items.map((i) => `${i.qty}x ${i.productName}`).join(', ')}
                    </td>
                    <td className="p-2.5 text-center">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-bold">
                        {tx.paymentMode}
                      </span>
                    </td>
                    <td className="p-2.5 text-right font-mono font-bold text-emerald-700">
                      Rs. {tx.netTotal.toLocaleString()}
                    </td>
                    <td className="p-2.5 text-center">
                      <button
                        type="button"
                        onClick={() => setCompletedReceipt(tx)}
                        className="px-2 py-1 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded font-bold text-[11px] flex items-center gap-1 mx-auto"
                      >
                        <Printer className="w-3 h-3" />
                        <span>Print</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 80mm THERMAL POS RECEIPT MODAL */}
      {completedReceipt && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-lg max-w-sm w-full border border-slate-200 shadow-xl overflow-hidden text-xs">
            <div className="bg-[#1b3b6f] text-white p-3 flex items-center justify-between">
              <span className="font-bold text-sm">80mm Thermal Receipt</span>
              <button
                type="button"
                onClick={() => setCompletedReceipt(null)}
                className="text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-3 font-mono text-[11px]">
              <div className="text-center border-b pb-2 space-y-0.5 font-sans">
                <div className="font-extrabold text-slate-900 text-sm">THE EDUCATORS CAMPUS STORE</div>
                <div className="text-[10px] text-slate-500">Official Uniform &amp; Book Counter</div>
                <div className="text-[10px] text-slate-600">Model Town Campus, Lahore</div>
                <div className="text-[10px] text-slate-400">NTN: 3982410-7</div>
              </div>

              <div className="space-y-1 text-slate-600 text-[10px]">
                <div className="flex justify-between">
                  <span>Invoice No:</span>
                  <span className="font-bold text-slate-900">{completedReceipt.invoiceNo}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date &amp; Time:</span>
                  <span>{completedReceipt.date} 10:45 AM</span>
                </div>
                <div className="flex justify-between">
                  <span>Customer:</span>
                  <span className="font-bold text-slate-900">{completedReceipt.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cashier:</span>
                  <span>Counter 01 (Store Incharge)</span>
                </div>
              </div>

              {/* Items */}
              <div className="border-t border-b border-dashed py-2 space-y-1.5">
                <div className="flex justify-between font-bold text-slate-800">
                  <span>Item</span>
                  <span>Qty x Rate = Total</span>
                </div>
                {completedReceipt.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between text-slate-700">
                    <span className="truncate max-w-[150px]">{it.productName}</span>
                    <span>{it.qty} x {it.unitPrice} = {it.total}</span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-1 font-bold">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span>Rs. {completedReceipt.subTotal}</span>
                </div>
                {completedReceipt.discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount:</span>
                    <span>-Rs. {completedReceipt.discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-900 text-sm border-t pt-1">
                  <span>NET TOTAL:</span>
                  <span>Rs. {completedReceipt.netTotal}</span>
                </div>
                <div className="flex justify-between text-slate-600 text-[10px]">
                  <span>Paid via ({completedReceipt.paymentMode}):</span>
                  <span>Rs. {completedReceipt.tenderedAmount}</span>
                </div>
                {completedReceipt.changeAmount > 0 && (
                  <div className="flex justify-between text-slate-600 text-[10px]">
                    <span>Change Returned:</span>
                    <span>Rs. {completedReceipt.changeAmount}</span>
                  </div>
                )}
              </div>

              <div className="text-center pt-2 text-[9px] text-slate-400 space-y-1 font-sans">
                <p>Goods once sold can be exchanged within 7 days with original receipt.</p>
                <p className="font-bold">*** THANK YOU FOR VISITING ***</p>
              </div>

              <div className="pt-2 flex justify-end gap-2 font-sans">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded flex items-center justify-center gap-1 text-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RESTOCK PRODUCT MODAL */}
      {showRestockModal && targetRestockProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-lg max-w-sm w-full border border-slate-200 shadow-xl overflow-hidden text-xs">
            <div className="bg-[#1b3b6f] text-white p-3 flex items-center justify-between">
              <span className="font-bold text-sm">Restock Warehouse Inventory</span>
              <button
                type="button"
                onClick={() => setShowRestockModal(false)}
                className="text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-3">
              <div>
                <span className="text-slate-500 block">Product:</span>
                <span className="font-bold text-slate-900">{targetRestockProduct.name}</span>
                <span className="text-[10px] text-slate-400 block font-mono">Current Stock: {targetRestockProduct.stockQty} Units</span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Incoming Restock Quantity</label>
                <input
                  type="number"
                  value={restockQty}
                  onChange={(e) => setRestockQty(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 border rounded font-mono font-bold"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRestockModal(false)}
                  className="px-3 py-1.5 border rounded font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleRestock}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded"
                >
                  Confirm Restock
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
