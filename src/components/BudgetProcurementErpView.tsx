import React, { useState } from 'react';
import {
  DollarSign,
  ShoppingCart,
  FileCheck,
  CheckCircle2,
  Clock,
  Printer,
  Plus,
  Search,
  Building2,
  TrendingUp,
  AlertTriangle,
  Receipt,
  FileSpreadsheet,
  Check,
  XCircle,
} from 'lucide-react';
import { InstitutionalBudgetPlan, ProcurementRequisition } from '../types';
import {
  INITIAL_BUDGET_PLANS,
  INITIAL_PROCUREMENT_REQUISITIONS,
} from '../data/phase10Data';

interface BudgetProcurementErpViewProps {
  onPrintPurchaseOrder?: (requisition: ProcurementRequisition) => void;
}

export default function BudgetProcurementErpView({
  onPrintPurchaseOrder,
}: BudgetProcurementErpViewProps) {
  const [activeTab, setActiveTab] = useState<'budget' | 'requisitions' | 'quotation_comparison'>('budget');
  const [budgetPlan, setBudgetPlan] = useState<InstitutionalBudgetPlan>(INITIAL_BUDGET_PLANS[0]);
  const [requisitions, setRequisitions] = useState<ProcurementRequisition[]>(
    INITIAL_PROCUREMENT_REQUISITIONS
  );
  const [selectedPrForComparison, setSelectedPrForComparison] = useState<ProcurementRequisition | null>(
    INITIAL_PROCUREMENT_REQUISITIONS[0]
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddPrModal, setShowAddPrModal] = useState(false);

  // New Requisition Form State
  const [prForm, setPrForm] = useState({
    department: 'Science Labs' as ProcurementRequisition['department'],
    requestedBy: 'Sir Tariq Jamil (Senior Lab Incharge)',
    purpose: '',
    estimatedCost: 150000,
    priority: 'High' as ProcurementRequisition['priority'],
    itemName1: '',
    itemSpec1: '',
    itemQty1: 1,
    vendor1Name: '',
    vendor1Price: 140000,
    vendor2Name: '',
    vendor2Price: 155000,
  });

  const filteredRequisitions = requisitions.filter((pr) => {
    return (
      pr.prNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pr.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pr.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pr.requestedBy.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleCreateRequisition = (e: React.FormEvent) => {
    e.preventDefault();
    const newPr: ProcurementRequisition = {
      id: `pr-${Date.now()}`,
      prNumber: `PR-2024-${Math.floor(100 + Math.random() * 900)}`,
      department: prForm.department,
      requestedBy: prForm.requestedBy,
      requestDate: new Date().toISOString().split('T')[0],
      requiredBeforeDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      purpose: prForm.purpose || 'Institutional lab / academic equipment requisition',
      estimatedCost: Number(prForm.estimatedCost),
      priority: prForm.priority,
      itemsList: [
        {
          itemName: prForm.itemName1 || 'Standard Procurement Line Item',
          specification: prForm.itemSpec1 || 'Standard Beaconhouse Specification',
          quantity: Number(prForm.itemQty1) || 1,
          unit: 'Units',
          estimatedUnitCost: Number(prForm.estimatedCost),
        },
      ],
      quotations: [
        {
          vendorName: prForm.vendor1Name || 'Premier Educational Equipment',
          quotedTotal: Number(prForm.vendor1Price),
          deliveryDays: 5,
          warrantyTerms: '2 Years Replacement Warranty',
          isRecommended: true,
        },
        {
          vendorName: prForm.vendor2Name || 'Standard Lab Supplies Corp',
          quotedTotal: Number(prForm.vendor2Price),
          deliveryDays: 8,
          warrantyTerms: '1 Year Warranty',
          isRecommended: false,
        },
      ],
      approvalStatus: 'Pending Review',
    };

    setRequisitions([newPr, ...requisitions]);
    setShowAddPrModal(false);
    alert(`Purchase Requisition ${newPr.prNumber} submitted for Principal & Finance review!`);
  };

  const handleApproveRequisition = (prId: string) => {
    setRequisitions(
      requisitions.map((pr) =>
        pr.id === prId
          ? {
              ...pr,
              approvalStatus: 'Approved by Principal',
              poNumber: `PO-2024-${Math.floor(100 + Math.random() * 900)}`,
              approverComments: 'Approved on lowest evaluated responsive quotation by Principal.',
            }
          : pr
      )
    );
    alert('Requisition Approved & Purchase Order (PO) Generated!');
  };

  return (
    <div id="budget-procurement-erp" className="space-y-4">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-[#002147] rounded-xl p-5 text-white shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-amber-400/20 rounded-lg text-amber-300 border border-amber-400/30">
              <DollarSign className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold tracking-tight">
              School Capex/Opex Budgeting, PR/PO &amp; Vendor Procurement ERP
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-400 text-slate-900">
              Phase 10
            </span>
          </div>
          <p className="text-slate-200 text-xs max-w-2xl">
            Institutional revenue vs expenditure forecast, 3-way vendor quotation comparison matrices, purchase requisitions (PR), and official printable purchase orders (PO).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowAddPrModal(true)}
            className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>Create Purchase Requisition (PR)</span>
          </button>
        </div>
      </div>

      {/* KPI Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              FY 24-25 Revenue Budget
            </div>
            <div className="text-xl font-black text-emerald-700 mt-0.5">
              PKR {(budgetPlan.totalRevenueForecast / 1000000).toFixed(1)}M
            </div>
            <div className="text-[10px] text-emerald-600 font-semibold">97.8% Realization</div>
          </div>
          <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-lg">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Total Expenditure
            </div>
            <div className="text-xl font-black text-rose-700 mt-0.5">
              PKR {(budgetPlan.totalExpenditureBudget / 1000000).toFixed(1)}M
            </div>
            <div className="text-[10px] text-slate-500 font-medium">Capex + Opex Head</div>
          </div>
          <div className="p-2.5 bg-rose-50 text-rose-700 rounded-lg">
            <Receipt className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Projected Net Surplus
            </div>
            <div className="text-xl font-black text-[#002147] mt-0.5">
              +PKR {(budgetPlan.projectedSurplusDeficit / 1000000).toFixed(1)}M
            </div>
            <div className="text-[10px] text-blue-700 font-medium">Safe Margin Reserve</div>
          </div>
          <div className="p-2.5 bg-blue-50 text-blue-700 rounded-lg">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Active Procurement PRs
            </div>
            <div className="text-xl font-black text-amber-700 mt-0.5">
              {requisitions.length} Requisitions
            </div>
            <div className="text-[10px] text-amber-600 font-medium">3-Way Bidding Matrix</div>
          </div>
          <div className="p-2.5 bg-amber-50 text-amber-700 rounded-lg">
            <ShoppingCart className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Tabs Header */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-xl px-4 pt-2 gap-2 text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveTab('budget')}
          className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition ${
            activeTab === 'budget'
              ? 'border-amber-700 text-amber-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Annual Fiscal Budget Plan &amp; Head Allocations</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('requisitions')}
          className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition ${
            activeTab === 'requisitions'
              ? 'border-amber-700 text-amber-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Purchase Requisitions (PR) &amp; PO Workflows</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('quotation_comparison')}
          className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition ${
            activeTab === 'quotation_comparison'
              ? 'border-amber-700 text-amber-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>3-Way Quotation Comparative Statement</span>
        </button>
      </div>

      {/* TAB 1: ANNUAL BUDGET HEADS */}
      {activeTab === 'budget' && (
        <div className="bg-white rounded-b-xl border border-slate-200 p-5 space-y-5 shadow-xs text-xs">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Fiscal Year 2024–2025 Campus Revenue &amp; Expenditure Ledger
              </h3>
              <p className="text-slate-500 text-[11px]">
                Audited against The Educators Central Financial Compliance standards.
              </p>
            </div>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-900 font-bold rounded-full">
              Status: {budgetPlan.status}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Revenue Heads */}
            <div className="p-4 rounded-xl border border-slate-200 bg-emerald-50/20 space-y-3">
              <h4 className="font-bold text-emerald-900 text-sm flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-700" /> Revenue Heads Breakdown
              </h4>
              <div className="space-y-2">
                {budgetPlan.revenueHeads.map((rev, i) => (
                  <div key={i} className="p-2.5 bg-white rounded-lg border text-slate-800 flex justify-between items-center">
                    <div>
                      <div className="font-bold text-[11px]">{rev.headName}</div>
                      <div className="text-slate-500 text-[10px]">
                        Budgeted: PKR {rev.budgetedAmount.toLocaleString()}
                      </div>
                    </div>
                    <div className="text-right font-black text-emerald-700">
                      PKR {rev.actualRealized.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Expenditure Heads */}
            <div className="p-4 rounded-xl border border-slate-200 bg-rose-50/20 space-y-3">
              <h4 className="font-bold text-rose-900 text-sm flex items-center gap-2">
                <Receipt className="w-4 h-4 text-rose-700" /> Expenditure Heads Breakdown
              </h4>
              <div className="space-y-2">
                {budgetPlan.expenditureHeads.map((exp, i) => (
                  <div key={i} className="p-2.5 bg-white rounded-lg border text-slate-800 flex justify-between items-center">
                    <div>
                      <div className="font-bold text-[11px]">{exp.headName}</div>
                      <div className="text-slate-500 text-[10px]">
                        Category: <span className="font-medium text-slate-700">{exp.category}</span>
                      </div>
                    </div>
                    <div className="text-right font-black text-rose-700">
                      PKR {exp.actualSpent.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: REQUISITIONS DESK */}
      {activeTab === 'requisitions' && (
        <div className="bg-white rounded-b-xl border border-slate-200 p-5 space-y-4 shadow-xs text-xs">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-bold text-slate-900 text-sm">
              Departmental Purchase Requisitions (PR) &amp; PO Status
            </h3>

            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2 text-slate-400" />
              <input
                type="text"
                placeholder="Search PR No, Department, Purpose..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 border-b">
                  <th className="p-2.5">PR Number</th>
                  <th className="p-2.5">Department</th>
                  <th className="p-2.5">Requested By</th>
                  <th className="p-2.5">Purpose &amp; Scope</th>
                  <th className="p-2.5">Est. Cost</th>
                  <th className="p-2.5">Status</th>
                  <th className="p-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRequisitions.map((pr) => (
                  <tr key={pr.id} className="hover:bg-slate-50">
                    <td className="p-2.5 font-mono font-bold text-blue-900">{pr.prNumber}</td>
                    <td className="p-2.5 font-semibold text-slate-800">{pr.department}</td>
                    <td className="p-2.5 text-slate-600">{pr.requestedBy}</td>
                    <td className="p-2.5 max-w-xs truncate text-slate-700" title={pr.purpose}>
                      {pr.purpose}
                    </td>
                    <td className="p-2.5 font-black text-slate-900">
                      PKR {pr.estimatedCost.toLocaleString()}
                    </td>
                    <td className="p-2.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          pr.approvalStatus === 'PO Issued' || pr.approvalStatus === 'Approved by Principal'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {pr.approvalStatus}
                      </span>
                    </td>
                    <td className="p-2.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedPrForComparison(pr);
                            setActiveTab('quotation_comparison');
                          }}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-bold text-[10px]"
                        >
                          View Bids
                        </button>

                        {pr.approvalStatus === 'Pending Review' && (
                          <button
                            type="button"
                            onClick={() => handleApproveRequisition(pr.id)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-[10px]"
                          >
                            Approve PR
                          </button>
                        )}

                        {(pr.approvalStatus === 'Approved by Principal' ||
                          pr.approvalStatus === 'PO Issued') && (
                          <button
                            type="button"
                            onClick={() => {
                              if (onPrintPurchaseOrder) {
                                onPrintPurchaseOrder(pr);
                              } else {
                                alert(`Printing Purchase Order for ${pr.prNumber}`);
                              }
                            }}
                            className="px-2.5 py-1 bg-[#002147] hover:bg-[#0b3366] text-white rounded font-bold text-[10px] flex items-center gap-1"
                          >
                            <Printer className="w-3 h-3" />
                            <span>Print PO</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: 3-WAY COMPARATIVE STATEMENT */}
      {activeTab === 'quotation_comparison' && selectedPrForComparison && (
        <div className="bg-white rounded-b-xl border border-slate-200 p-5 space-y-4 shadow-xs text-xs">
          <div className="flex justify-between items-center border-b pb-3">
            <div>
              <span className="px-2 py-0.5 bg-blue-100 text-blue-900 rounded font-mono font-bold text-[10px]">
                {selectedPrForComparison.prNumber}
              </span>
              <h3 className="font-bold text-slate-900 text-sm mt-1">
                Comparative Quotation Evaluation Matrix: {selectedPrForComparison.purpose}
              </h3>
            </div>

            <button
              type="button"
              onClick={() => {
                if (onPrintPurchaseOrder) {
                  onPrintPurchaseOrder(selectedPrForComparison);
                } else {
                  alert(`Printing Comparative Statement for ${selectedPrForComparison.prNumber}`);
                }
              }}
              className="px-3 py-1.5 bg-[#002147] hover:bg-[#0b3366] text-white rounded font-bold text-[11px] flex items-center gap-1.5 transition"
            >
              <Printer className="w-3.5 h-3.5 text-amber-300" />
              <span>Print Comparative PO</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {selectedPrForComparison.quotations.map((q, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 ${
                  q.isRecommended
                    ? 'border-emerald-500 bg-emerald-50/30 ring-2 ring-emerald-400/40'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold text-slate-500">Quotation #{idx + 1}</span>
                    {q.isRecommended && (
                      <span className="px-2 py-0.5 bg-emerald-600 text-white rounded-full font-bold text-[10px] flex items-center gap-1">
                        <Check className="w-3 h-3" /> Recommended Bid
                      </span>
                    )}
                  </div>

                  <h4 className="font-black text-slate-900 text-sm">{q.vendorName}</h4>
                  <div className="text-xl font-black text-slate-900">
                    PKR {q.quotedTotal.toLocaleString()}
                  </div>

                  <div className="space-y-1 text-slate-600 text-[11px] pt-2 border-t">
                    <div>
                      Delivery Turnaround: <strong>{q.deliveryDays} Business Days</strong>
                    </div>
                    <div>
                      Warranty Terms: <strong>{q.warrantyTerms}</strong>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <span
                    className={`block text-center py-1.5 rounded font-bold text-[11px] ${
                      q.isRecommended
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {q.isRecommended ? 'Lowest Evaluated Responsive Bid' : 'Alternative Bidder'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Items Spec List */}
          <div className="p-4 bg-slate-50 rounded-xl border space-y-2">
            <h4 className="font-bold text-slate-900 text-xs">Required Specifications &amp; Quantities:</h4>
            <div className="space-y-1">
              {selectedPrForComparison.itemsList.map((item, i) => (
                <div key={i} className="flex justify-between items-center text-[11px] text-slate-700">
                  <span>
                    • <strong>{item.itemName}</strong> - {item.specification}
                  </span>
                  <span className="font-mono font-bold">
                    {item.quantity} {item.unit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD PR */}
      {showAddPrModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-slate-900 text-base">New Purchase Requisition (PR)</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddPrModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateRequisition} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Requisition Purpose / Scope *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Science Lab Compound Microscopes &amp; Prepared Slides"
                  value={prForm.purpose}
                  onChange={(e) => setPrForm({ ...prForm, purpose: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Department</label>
                  <select
                    value={prForm.department}
                    onChange={(e) =>
                      setPrForm({
                        ...prForm,
                        department: e.target.value as ProcurementRequisition['department'],
                      })
                    }
                    className="w-full p-2 border rounded-lg bg-white"
                  >
                    <option value="Science Labs">Science Labs</option>
                    <option value="IT & Robotics">IT &amp; Robotics</option>
                    <option value="General Store & Stationery">General Store &amp; Stationery</option>
                    <option value="Estate & Maintenance">Estate &amp; Maintenance</option>
                    <option value="Sports Directorate">Sports Directorate</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Estimated Budget (PKR)</label>
                  <input
                    type="number"
                    required
                    value={prForm.estimatedCost}
                    onChange={(e) => setPrForm({ ...prForm, estimatedCost: Number(e.target.value) })}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border space-y-2">
                <div className="font-bold text-slate-800">Primary Item Details</div>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Item Description"
                    value={prForm.itemName1}
                    onChange={(e) => setPrForm({ ...prForm, itemName1: e.target.value })}
                    className="p-1.5 border rounded col-span-2 bg-white"
                  />
                  <input
                    type="number"
                    placeholder="Quantity"
                    value={prForm.itemQty1}
                    onChange={(e) => setPrForm({ ...prForm, itemQty1: Number(e.target.value) })}
                    className="p-1.5 border rounded bg-white"
                  />
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 space-y-2">
                <div className="font-bold text-amber-900">Bidding Vendor Quotations</div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Vendor A Name"
                    value={prForm.vendor1Name}
                    onChange={(e) => setPrForm({ ...prForm, vendor1Name: e.target.value })}
                    className="p-1.5 border rounded bg-white"
                  />
                  <input
                    type="number"
                    placeholder="Quoted Total PKR"
                    value={prForm.vendor1Price}
                    onChange={(e) => setPrForm({ ...prForm, vendor1Price: Number(e.target.value) })}
                    className="p-1.5 border rounded bg-white"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddPrModal(false)}
                  className="px-4 py-2 border rounded-lg font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold shadow-sm"
                >
                  Submit Requisition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
