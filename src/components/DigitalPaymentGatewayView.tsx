import React, { useState, useMemo } from 'react';
import {
  CreditCard,
  Building2,
  Smartphone,
  QrCode,
  Search,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  FileText,
  Upload,
  Download,
  AlertTriangle,
  Zap,
  DollarSign,
  Copy,
  Receipt,
  Check,
  Settings,
  ExternalLink,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { FeeVoucher, Student } from '../types';

interface DigitalPaymentGatewayViewProps {
  vouchers: FeeVoucher[];
  students: Student[];
  onUpdateVouchers?: (updated: FeeVoucher[]) => void;
  onPrintVoucher?: (voucher: FeeVoucher) => void;
}

export default function DigitalPaymentGatewayView({
  vouchers,
  students,
  onUpdateVouchers,
  onPrintVoucher,
}: DigitalPaymentGatewayViewProps) {
  const [activeTab, setActiveTab] = useState<'checkout' | 'reconciliation' | 'transactions' | 'config'>('checkout');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVoucher, setSelectedVoucher] = useState<FeeVoucher | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'1bill' | 'easypaisa' | 'jazzcash' | 'card'>('1bill');
  const [accountNumber, setAccountNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState<any | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Reconciliation mock state
  const [isAutoMatching, setIsAutoMatching] = useState(false);
  const [reconciliationLogs, setReconciliationLogs] = useState<any[]>([
    {
      id: 'REC-901',
      refNo: '1BILL-09823412',
      bank: 'Meezan Bank Ltd',
      amount: 4500,
      timestamp: '2026-09-21 10:14 AM',
      voucherNo: vouchers[0]?.voucherNo || 'VCH-2024-001',
      studentName: vouchers[0]?.studentName || 'Ahmad Ali',
      status: 'Matched',
      confidence: '100%',
    },
    {
      id: 'REC-902',
      refNo: 'EP-449102839',
      bank: 'EasyPaisa Wallet',
      amount: 4000,
      timestamp: '2026-09-21 09:42 AM',
      voucherNo: vouchers[1]?.voucherNo || 'VCH-2024-002',
      studentName: vouchers[1]?.studentName || 'Fatima Zahra',
      status: 'Matched',
      confidence: '100%',
    },
    {
      id: 'REC-903',
      refNo: 'JC-88192039',
      bank: 'JazzCash Wallet',
      amount: 5200,
      timestamp: '2026-09-21 08:30 AM',
      voucherNo: vouchers[2]?.voucherNo || 'VCH-2024-003',
      studentName: vouchers[2]?.studentName || 'Bilal Khan',
      status: 'Matched',
      confidence: '100%',
    },
    {
      id: 'REC-904',
      refNo: '1BILL-11092834',
      bank: 'Habib Bank Ltd (HBL)',
      amount: 3500,
      timestamp: '2026-09-21 07:15 AM',
      voucherNo: 'VCH-UNREGISTERED',
      studentName: 'Unknown Depositor',
      status: 'Unmatched',
      confidence: '0%',
    },
  ]);

  // Gateway Config state
  const [gatewayConfig, setGatewayConfig] = useState({
    isSandbox: true,
    oneBillPrefix: '100482',
    merchantIdOneLink: 'EDU_ISL_0092',
    easyPaisaStoreId: 'EP_STORE_7781',
    jazzCashMerchantId: 'JC_MERCH_4401',
    stripePublishableKey: 'pk_test_51NxEduSchoolSystemPakistan...',
    autoSendSmsReceipt: true,
    instantReconcile: true,
  });

  // Filter vouchers for search
  const filteredVouchers = useMemo(() => {
    if (!searchQuery) return vouchers.slice(0, 10);
    const q = searchQuery.toLowerCase();
    return vouchers.filter(
      (v) =>
        v.voucherNo.toLowerCase().includes(q) ||
        v.studentName.toLowerCase().includes(q) ||
        v.studentCode.toLowerCase().includes(q) ||
        v.className.toLowerCase().includes(q)
    );
  }, [vouchers, searchQuery]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleSelectVoucher = (v: FeeVoucher) => {
    setSelectedVoucher(v);
    setPaymentSuccess(null);
  };

  const handleProcessPayment = () => {
    if (!selectedVoucher) return;
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const transactionId = `TXN-${paymentMethod.toUpperCase()}-${Date.now().toString().slice(-6)}`;
      const successData = {
        transactionId,
        voucherNo: selectedVoucher.voucherNo,
        studentName: selectedVoucher.studentName,
        studentCode: selectedVoucher.studentCode,
        amount: selectedVoucher.netPayable,
        method: paymentMethod.toUpperCase(),
        timestamp: new Date().toLocaleString(),
        status: 'SUCCESS',
        referenceNo: `${gatewayConfig.oneBillPrefix}${selectedVoucher.voucherNo.replace(/[^0-9]/g, '')}`,
      };

      setPaymentSuccess(successData);

      // Update voucher in parent state if callback provided
      if (onUpdateVouchers) {
        const updated = vouchers.map((v) => {
          if (v.id === selectedVoucher.id) {
            return {
              ...v,
              paymentStatus: 'Paid' as const,
              paidAmount: v.netPayable,
              paymentDate: new Date().toISOString().split('T')[0],
              paymentMethod: 'Online Wallet' as const,
            };
          }
          return v;
        });
        onUpdateVouchers(updated);
      }
    }, 1200);
  };

  const handleRunAutoReconcile = () => {
    setIsAutoMatching(true);
    setTimeout(() => {
      setIsAutoMatching(false);
      alert('1Link Clearing Stream processed: 3 Vouchers auto-reconciled and marked as Paid in real-time!');
    }, 1000);
  };

  return (
    <div className="space-y-5">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-cyan-900 rounded-xl p-5 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-400 text-emerald-950 uppercase tracking-wide">
                Digital Payment Gateway
              </span>
              <span className="text-xs bg-white/15 px-2 py-0.5 rounded border border-white/20 text-emerald-100 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                1Link 1Bill &bull; EasyPaisa &bull; JazzCash &bull; Card Engine
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Online Fee Collection &amp; Auto-Reconciliation
            </h1>
            <p className="text-emerald-100 text-xs mt-1 max-w-2xl">
              Accept digital school fee payments instantly across Pakistani banking channels with automated 1Bill clearing and parent SMS receipts.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleRunAutoReconcile}
              disabled={isAutoMatching}
              className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 text-xs font-bold rounded-lg shadow-sm transition flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isAutoMatching ? 'animate-spin' : ''}`} />
              <span>{isAutoMatching ? 'Syncing...' : '1Link Auto-Reconcile'}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('config')}
              className="px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-medium rounded-lg transition flex items-center gap-1.5 cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Gateway Config</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 pt-2 rounded-t-xl">
        <div className="flex gap-2">
          {[
            { id: 'checkout', label: '1Bill & Digital Checkout', icon: CreditCard },
            { id: 'reconciliation', label: 'Bank Auto-Reconciliation', icon: RefreshCw },
            { id: 'transactions', label: 'Digital Ledger', icon: Receipt },
            { id: 'config', label: 'Merchant Gateway Settings', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-3 px-4 border-b-2 text-xs font-bold transition cursor-pointer ${
                  isActive
                    ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50 rounded-t-lg'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="text-[11px] text-slate-400 hidden sm:flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>1Link Switch Gateway: ONLINE</span>
        </div>
      </div>

      {/* TAB 1: DIGITAL CHECKOUT & 1BILL LOOKUP */}
      {activeTab === 'checkout' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column: Voucher Lookup & Selector */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Search className="w-4 h-4 text-emerald-600" />
                <span>Find Student Fee Voucher</span>
              </h3>
              <span className="text-[10px] text-slate-400">Total: {vouchers.length}</span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search Voucher #, Student Name, Roll No..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
              />
            </div>

            {/* Voucher List */}
            <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
              {filteredVouchers.map((v) => {
                const isSelected = selectedVoucher?.id === v.id;
                const isPaid = v.paymentStatus === 'Paid';
                return (
                  <div
                    key={v.id}
                    onClick={() => handleSelectVoucher(v)}
                    className={`p-3 rounded-lg border transition cursor-pointer ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/70 shadow-xs ring-1 ring-emerald-400'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">{v.studentName}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isPaid
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {v.paymentStatus}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500">
                      <span>Voucher: {v.voucherNo}</span>
                      <span>Class: {v.className}</span>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-xs">
                      <span className="text-slate-400 text-[10px]">{v.month}</span>
                      <span className="font-bold text-slate-900">
                        PKR {v.netPayable.toLocaleString()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Interactive Digital Payment Terminal */}
          <div className="lg:col-span-7 space-y-4">
            {selectedVoucher ? (
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-5">
                {/* Selected Voucher Summary Card */}
                <div className="p-4 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-xl space-y-3 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider">
                        Active Challan
                      </span>
                      <h3 className="text-lg font-bold text-white">{selectedVoucher.studentName}</h3>
                      <p className="text-xs text-slate-300">
                        ID: {selectedVoucher.studentCode} &bull; {selectedVoucher.className} ({selectedVoucher.section})
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400">Total Net Payable</span>
                      <div className="text-2xl font-black text-emerald-400">
                        PKR {selectedVoucher.netPayable.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* 1Bill 1Link Universal Reference Number */}
                  <div className="bg-white/10 border border-white/15 rounded-lg p-2.5 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-slate-300">1Link / 1Bill Consumer Number:</div>
                      <div className="text-sm font-mono font-bold text-white tracking-widest">
                        {gatewayConfig.oneBillPrefix}
                        {selectedVoucher.voucherNo.replace(/[^0-9]/g, '').padStart(8, '0')}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy(
                          `${gatewayConfig.oneBillPrefix}${selectedVoucher.voucherNo.replace(/[^0-9]/g, '').padStart(8, '0')}`,
                          '1bill'
                        )
                      }
                      className="px-2.5 py-1 bg-white/20 hover:bg-white/30 text-white text-[10px] font-bold rounded flex items-center gap-1 cursor-pointer"
                    >
                      {copiedText === '1bill' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedText === '1bill' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                {paymentSuccess ? (
                  /* Success Screen */
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-center space-y-4">
                    <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-emerald-900">Payment Successful!</h4>
                      <p className="text-xs text-emerald-700">
                        Fee Voucher #{paymentSuccess.voucherNo} has been cleared digitally.
                      </p>
                    </div>

                    <div className="bg-white border border-emerald-100 rounded-lg p-3 max-w-md mx-auto text-left text-xs space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Transaction ID:</span>
                        <span className="font-mono font-bold text-slate-800">{paymentSuccess.transactionId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Channel:</span>
                        <span className="font-bold text-slate-800">{paymentSuccess.method}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Amount Paid:</span>
                        <span className="font-bold text-emerald-700">PKR {paymentSuccess.amount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Timestamp:</span>
                        <span className="text-slate-700">{paymentSuccess.timestamp}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-3">
                      {onPrintVoucher && (
                        <button
                          type="button"
                          onClick={() => onPrintVoucher(selectedVoucher)}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Receipt className="w-4 h-4" />
                          <span>Print Cleared Receipt</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setPaymentSuccess(null)}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition cursor-pointer"
                      >
                        Make Another Payment
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Payment Method Selector & Checkout Form */
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-2">
                        Select Instant Payment Gateway:
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {[
                          { id: '1bill', name: '1Link / 1Bill', sub: 'Any Bank App', icon: Building2, color: 'border-blue-500 bg-blue-50/50 text-blue-700' },
                          { id: 'easypaisa', name: 'EasyPaisa', sub: 'Wallet & QR', icon: Smartphone, color: 'border-emerald-500 bg-emerald-50/50 text-emerald-700' },
                          { id: 'jazzcash', name: 'JazzCash', sub: 'Mobile Account', icon: Zap, color: 'border-amber-500 bg-amber-50/50 text-amber-700' },
                          { id: 'card', name: 'Debit/Credit Card', sub: 'Visa / MasterCard', icon: CreditCard, color: 'border-purple-500 bg-purple-50/50 text-purple-700' },
                        ].map((m) => {
                          const Icon = m.icon;
                          const isSelected = paymentMethod === m.id;
                          return (
                            <button
                              key={m.id}
                              type="button"
                              onClick={() => setPaymentMethod(m.id as any)}
                              className={`p-3 rounded-lg border text-left transition cursor-pointer ${
                                isSelected
                                  ? `${m.color} ring-2 ring-emerald-500 shadow-2xs`
                                  : 'border-slate-200 hover:border-slate-300 bg-white'
                              }`}
                            >
                              <Icon className="w-5 h-5 mb-1.5 text-slate-700" />
                              <div className="text-xs font-bold text-slate-800">{m.name}</div>
                              <div className="text-[10px] text-slate-500">{m.sub}</div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Method Specific Input Area */}
                    {paymentMethod === '1bill' && (
                      <div className="p-3.5 bg-blue-50/60 border border-blue-200 rounded-lg text-xs space-y-2">
                        <div className="font-bold text-blue-900 flex items-center gap-1.5">
                          <Building2 className="w-4 h-4 text-blue-600" />
                          <span>Pay via Any Banking App (HBL, Meezan, Alfalah, Standard Chartered, etc.)</span>
                        </div>
                        <p className="text-slate-600 text-[11px] leading-relaxed">
                          1. Open your Mobile Banking App &rarr; Navigate to <strong>Bill Payments</strong> &rarr; Select <strong>1Bill / Invoices</strong>.
                          <br />
                          2. Enter 1Link Consumer ID: <strong className="font-mono text-blue-800">{gatewayConfig.oneBillPrefix}{selectedVoucher.voucherNo.replace(/[^0-9]/g, '').padStart(8, '0')}</strong>.
                          <br />
                          3. Verify student name <strong>{selectedVoucher.studentName}</strong> and tap <strong>Pay</strong>.
                        </p>
                      </div>
                    )}

                    {(paymentMethod === 'easypaisa' || paymentMethod === 'jazzcash') && (
                      <div className="space-y-3">
                        <label className="block text-xs font-medium text-slate-700">
                          Enter {paymentMethod === 'easypaisa' ? 'EasyPaisa' : 'JazzCash'} Mobile Number:
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="03001234567"
                            value={accountNumber}
                            onChange={(e) => setAccountNumber(e.target.value)}
                            className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>
                        <p className="text-[11px] text-slate-500">
                          A real-time payment authorization prompt (USSD / In-App Notification) will be sent to this phone.
                        </p>
                      </div>
                    )}

                    {paymentMethod === 'card' && (
                      <div className="space-y-3 bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-xs">
                        <div>
                          <label className="block text-[11px] font-medium text-slate-600 mb-1">Card Number</label>
                          <input
                            type="text"
                            placeholder="4214 •••• •••• 9821"
                            className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded text-xs"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[11px] font-medium text-slate-600 mb-1">Expiry Date</label>
                            <input
                              type="text"
                              placeholder="MM/YY"
                              className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-medium text-slate-600 mb-1">CVV / CVC</label>
                            <input
                              type="text"
                              placeholder="123"
                              className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded text-xs"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Pay Button */}
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={handleProcessPayment}
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                    >
                      {isProcessing ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Authorizing with 1Link Gateway...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Authorize &amp; Settle PKR {selectedVoucher.netPayable.toLocaleString()}</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500 shadow-xs">
                <CreditCard className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-700">No Voucher Selected</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Please select a fee voucher from the left panel to initiate digital payment checkout or view 1Bill consumer tokens.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: BANK AUTO-RECONCILIATION */}
      {activeTab === 'reconciliation' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
            <div>
              <h3 className="text-sm font-bold text-slate-800">1Link &amp; Bank Statement Auto-Reconciliation Engine</h3>
              <p className="text-xs text-slate-500">
                Match incoming bank transfers against issued school fee vouchers with automatic verification.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Statement (.CSV)</span>
              </button>
              <button
                type="button"
                onClick={handleRunAutoReconcile}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Run Auto-Match</span>
              </button>
            </div>
          </div>

          {/* Reconciliation Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Bank Ref / 1Link Token</th>
                  <th className="py-2.5 px-3">Channel / Bank</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Matched Voucher</th>
                  <th className="py-2.5 px-3">Student Name</th>
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reconciliationLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-800">{log.refNo}</td>
                    <td className="py-2.5 px-3 text-slate-700">{log.bank}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">PKR {log.amount.toLocaleString()}</td>
                    <td className="py-2.5 px-3 font-mono text-blue-600">{log.voucherNo}</td>
                    <td className="py-2.5 px-3 font-medium text-slate-800">{log.studentName}</td>
                    <td className="py-2.5 px-3 text-slate-500 text-[11px]">{log.timestamp}</td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          log.status === 'Matched'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {log.status} ({log.confidence})
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      {log.status === 'Matched' ? (
                        <span className="text-[11px] font-bold text-emerald-600 flex items-center justify-end gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Reconciled
                        </span>
                      ) : (
                        <button
                          type="button"
                          className="px-2 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded text-[10px] font-bold cursor-pointer"
                        >
                          Manual Match
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: DIGITAL LEDGER */}
      {activeTab === 'transactions' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">Real-Time Digital Collections Audit</h3>
            <button
              type="button"
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Treasury Report</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
              <div className="text-xs text-emerald-700 font-bold">Total Digital Recoveries (MTD)</div>
              <div className="text-xl font-black text-emerald-900 mt-1">PKR 384,500</div>
              <div className="text-[10px] text-emerald-600 mt-1">84 Transactions verified</div>
            </div>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <div className="text-xs text-blue-700 font-bold">1Link 1Bill Volume</div>
              <div className="text-xl font-black text-blue-900 mt-1">PKR 245,000</div>
              <div className="text-[10px] text-blue-600 mt-1">63% of total digital collection</div>
            </div>
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <div className="text-xs text-amber-700 font-bold">Wallets (EasyPaisa / JazzCash)</div>
              <div className="text-xl font-black text-amber-900 mt-1">PKR 139,500</div>
              <div className="text-[10px] text-amber-600 mt-1">37% of total digital collection</div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: MERCHANT GATEWAY CONFIGURATION */}
      {activeTab === 'config' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-5">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Banking &amp; Fintech Gateway Parameters</h3>
            <p className="text-xs text-slate-500">
              Configure credentials for direct connection to Pakistan National Financial Switch (1Link) and wallet aggregators.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">1Link 1Bill School Prefix (6 Digits)</label>
              <input
                type="text"
                value={gatewayConfig.oneBillPrefix}
                onChange={(e) => setGatewayConfig({ ...gatewayConfig, oneBillPrefix: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">1Link Merchant ID</label>
              <input
                type="text"
                value={gatewayConfig.merchantIdOneLink}
                onChange={(e) => setGatewayConfig({ ...gatewayConfig, merchantIdOneLink: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">EasyPaisa Store ID</label>
              <input
                type="text"
                value={gatewayConfig.easyPaisaStoreId}
                onChange={(e) => setGatewayConfig({ ...gatewayConfig, easyPaisaStoreId: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">JazzCash Merchant Code</label>
              <input
                type="text"
                value={gatewayConfig.jazzCashMerchantId}
                onChange={(e) => setGatewayConfig({ ...gatewayConfig, jazzCashMerchantId: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={gatewayConfig.autoSendSmsReceipt}
                onChange={(e) => setGatewayConfig({ ...gatewayConfig, autoSendSmsReceipt: e.target.checked })}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>Auto-dispatch SMS payment confirmation to Parent phone on clearing</span>
            </label>

            <button
              type="button"
              onClick={() => alert('Payment Gateway parameters saved successfully!')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition cursor-pointer shadow-xs"
            >
              Save Configuration
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
