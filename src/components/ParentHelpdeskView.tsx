import React, { useState } from 'react';
import {
  LifeBuoy,
  MessageCircle,
  Clock,
  CheckCircle,
  AlertTriangle,
  User,
  Send,
  Plus,
  Search,
  Filter,
  Layers,
  Phone,
  Printer,
  ShieldAlert,
  Calendar,
  Building,
} from 'lucide-react';
import { ParentHelpdeskTicket } from '../types';
import { INITIAL_HELPDESK_TICKETS } from '../data/phase11Data';

interface ParentHelpdeskViewProps {
  onPrintTicketSummary?: (ticket: ParentHelpdeskTicket) => void;
}

export default function ParentHelpdeskView({ onPrintTicketSummary }: ParentHelpdeskViewProps) {
  const [tickets, setTickets] = useState<ParentHelpdeskTicket[]>(INITIAL_HELPDESK_TICKETS);
  const [selectedTicket, setSelectedTicket] = useState<ParentHelpdeskTicket>(INITIAL_HELPDESK_TICKETS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // New Reply State
  const [replyText, setReplyText] = useState('');

  // New Ticket Form State
  const [studentName, setStudentName] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [className, setClassName] = useState('Class 9-A');
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('0300-1234567');
  const [category, setCategory] = useState<ParentHelpdeskTicket['category']>('Transport & Van Delay');
  const [priority, setPriority] = useState<ParentHelpdeskTicket['priority']>('Urgent (4hr SLA)');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');

  const filteredTickets = tickets.filter((t) => {
    const matchSearch =
      t.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.parentName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = selectedCategory === 'ALL' || t.category === selectedCategory;
    const matchStatus = selectedStatus === 'ALL' || t.status === selectedStatus;
    return matchSearch && matchCat && matchStatus;
  });

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    const updated = {
      ...selectedTicket,
      messages: [
        ...selectedTicket.messages,
        {
          senderRole: 'School Officer' as const,
          senderName: 'Principal Desk / Helpdesk Officer',
          timestamp: 'Just now',
          text: replyText,
        },
      ],
    };

    setTickets(tickets.map((t) => (t.id === selectedTicket.id ? updated : t)));
    setSelectedTicket(updated);
    setReplyText('');
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !description || !studentName) return;

    let assignedDept: ParentHelpdeskTicket['assignedDepartment'] = 'Principal Office';
    let officer = 'Principal Desk Support';

    if (category === 'Transport & Van Delay') {
      assignedDept = 'Transport Wing';
      officer = 'Subedar (R) Farooq (Transport Head)';
    } else if (category === 'Fee Challan & Concession Query') {
      assignedDept = 'Accounts & Billing';
      officer = 'Kashif Mehmood (Bursar)';
    } else if (category === 'Academic & Homework Support') {
      assignedDept = 'Academic Coordinator';
      officer = 'Academic Supervisory Board';
    } else if (category === 'Hostel & Food Service') {
      assignedDept = 'Hostel Warden';
      officer = 'Warden Shafiq';
    }

    const newTicket: ParentHelpdeskTicket = {
      id: `TCK-${Date.now().toString().slice(-6)}`,
      ticketNumber: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      studentName,
      studentRollNo: rollNo || '01',
      className,
      parentName: parentName || 'Respected Guardian',
      parentPhone,
      category,
      priority,
      subject,
      description,
      assignedOfficer: officer,
      assignedDepartment: assignedDept,
      status: 'Open / Acknowledged',
      createdAt: 'Today, Just now',
      slaDeadline: priority.includes('4hr') ? 'In 4 hours' : 'Within 24 hours',
      messages: [
        {
          senderRole: 'Parent',
          senderName: parentName || 'Parent',
          timestamp: 'Just now',
          text: description,
        },
      ],
    };

    setTickets([newTicket, ...tickets]);
    setSelectedTicket(newTicket);
    setIsCreatingNew(false);
    setSubject('');
    setDescription('');
    setStudentName('');
  };

  const handleUpdateStatus = (status: ParentHelpdeskTicket['status']) => {
    const updated = { ...selectedTicket, status };
    setTickets(tickets.map((t) => (t.id === selectedTicket.id ? updated : t)));
    setSelectedTicket(updated);
  };

  return (
    <div id="parent-helpdesk-view" className="space-y-4">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-[#002147] to-indigo-950 rounded-xl p-5 text-white shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-indigo-500/20 rounded-lg text-indigo-300 border border-indigo-500/30">
              <LifeBuoy className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold tracking-tight">
              Parent-School Helpdesk &amp; SLA Ticket Redressal Center
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-400 text-slate-950">
              Phase 11
            </span>
          </div>
          <p className="text-slate-200 text-xs max-w-2xl">
            Centralized parent inquiry ticketing system with SLA turnaround time monitoring for transport delays, fee concession waivers, homework guidance, and boarding requests.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setIsCreatingNew(!isCreatingNew)}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>{isCreatingNew ? 'Close Form' : 'Log New Parent Ticket'}</span>
          </button>
        </div>
      </div>

      {/* New Ticket Form Modal/Drawer */}
      {isCreatingNew && (
        <div className="bg-white p-5 rounded-xl border-2 border-indigo-300 shadow-md space-y-4 text-xs">
          <div className="flex justify-between items-center border-b pb-2">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-indigo-600" />
              <span>Register New Parent Inquiry / Grievance Ticket</span>
            </h3>
            <span className="text-[10px] text-slate-500">Auto-routes to department lead with SLA timer</span>
          </div>

          <form onSubmit={handleCreateTicket} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Student Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ali Ahmed"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Class &amp; Section</label>
                <select
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  className="w-full p-2 border rounded-lg bg-white"
                >
                  <option value="Class 9-A">Class 9-A (Science)</option>
                  <option value="Class 10-B">Class 10-B (Matric)</option>
                  <option value="Class 8-Green">Class 8-Green</option>
                  <option value="Class 7-Blue">Class 7-Blue</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Parent / Guardian Name</label>
                <input
                  type="text"
                  placeholder="e.g. Tariq Mehmood"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Parent Phone Number</label>
                <input
                  type="text"
                  value={parentPhone}
                  onChange={(e) => setParentPhone(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Inquiry Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full p-2 border rounded-lg bg-white"
                >
                  <option value="Transport & Van Delay">Transport &amp; Van Delay</option>
                  <option value="Fee Challan & Concession Query">Fee Challan &amp; Concession Query</option>
                  <option value="Academic & Homework Support">Academic &amp; Homework Support</option>
                  <option value="Hostel & Food Service">Hostel &amp; Food Service</option>
                  <option value="Discipline & Bullying Report">Discipline &amp; Bullying Report</option>
                  <option value="Medical & Leave Request">Medical &amp; Leave Request</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Resolution SLA Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full p-2 border rounded-lg bg-white"
                >
                  <option value="Urgent (4hr SLA)">Urgent (4hr SLA - High Escalation)</option>
                  <option value="High (24hr SLA)">High (24hr SLA)</option>
                  <option value="Normal (48hr SLA)">Normal (48hr SLA)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Subject Summary *</label>
              <input
                type="text"
                required
                placeholder="e.g. Van driver not stopping at designated corner"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full p-2 border rounded-lg"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Detailed Complaint / Request Description *</label>
              <textarea
                rows={3}
                required
                placeholder="Provide full details of the parent request..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2.5 border rounded-lg"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button
                type="button"
                onClick={() => setIsCreatingNew(false)}
                className="px-4 py-2 border rounded-lg font-bold text-slate-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded-lg font-bold"
              >
                Submit Ticket &amp; Notify Department
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main 2-Column Split: Tickets List (Left) + Active Ticket Detail Thread (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Tickets Browser (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-3 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-2">
            <h3 className="font-bold text-slate-900 text-sm">Tickets Queue ({filteredTickets.length})</h3>
            <span className="text-[10px] text-slate-500 font-semibold">Real-Time SLA Tracking</span>
          </div>

          <div className="space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search ticket #, student, subject..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 border rounded-lg text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="p-1.5 border rounded bg-white text-[11px] font-medium"
              >
                <option value="ALL">All Categories</option>
                <option value="Transport & Van Delay">Transport</option>
                <option value="Fee Challan & Concession Query">Fee / Accounts</option>
                <option value="Academic & Homework Support">Academics</option>
                <option value="Hostel & Food Service">Hostel</option>
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="p-1.5 border rounded bg-white text-[11px] font-medium"
              >
                <option value="ALL">All Statuses</option>
                <option value="Open / Acknowledged">Open / Acknowledged</option>
                <option value="Under Investigation">Under Investigation</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
          </div>

          <div className="space-y-2 max-h-[620px] overflow-y-auto pr-1">
            {filteredTickets.map((t) => (
              <div
                key={t.id}
                onClick={() => setSelectedTicket(t)}
                className={`p-3 rounded-xl border cursor-pointer transition space-y-1.5 ${
                  selectedTicket.id === t.id
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="font-mono font-bold text-indigo-900 text-[11px]">
                    {t.ticketNumber}
                  </span>
                  <span
                    className={`px-2 py-0.2 rounded-full font-bold text-[9px] ${
                      t.priority.includes('Urgent')
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {t.priority}
                  </span>
                </div>

                <div className="font-bold text-slate-900 text-xs line-clamp-1">{t.subject}</div>

                <div className="text-[11px] text-slate-600 flex justify-between items-center">
                  <span>{t.studentName} ({t.className})</span>
                  <span
                    className={`px-1.5 py-0.2 rounded font-semibold text-[10px] ${
                      t.status === 'Resolved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : t.status === 'Under Investigation'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {t.status}
                  </span>
                </div>

                <div className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>SLA: {t.slaDeadline}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Selected Ticket Conversation & Resolution Thread (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4 text-xs">
          {/* Header */}
          <div className="flex flex-wrap justify-between items-start gap-2 border-b pb-3">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono font-bold text-indigo-900 text-sm">
                  {selectedTicket.ticketNumber}
                </span>
                <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded font-semibold text-[10px]">
                  {selectedTicket.category}
                </span>
                <span
                  className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                    selectedTicket.status === 'Resolved'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {selectedTicket.status}
                </span>
              </div>
              <h2 className="text-base font-extrabold text-slate-900 mt-1">{selectedTicket.subject}</h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  if (onPrintTicketSummary) onPrintTicketSummary(selectedTicket);
                  else alert(`Printing Official Grievance Dossier for ${selectedTicket.ticketNumber}`);
                }}
                className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-xs flex items-center gap-1"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Dossier</span>
              </button>
            </div>
          </div>

          {/* Ticket Metadata Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-3 bg-slate-50 rounded-lg border text-[11px]">
            <div>
              <div className="text-slate-500 text-[10px]">Student / Roll:</div>
              <div className="font-bold text-slate-900">{selectedTicket.studentName} (#{selectedTicket.studentRollNo})</div>
              <div className="text-slate-600">{selectedTicket.className}</div>
            </div>
            <div>
              <div className="text-slate-500 text-[10px]">Parent Guardian:</div>
              <div className="font-bold text-slate-900">{selectedTicket.parentName}</div>
              <div className="text-slate-600 font-mono">{selectedTicket.parentPhone}</div>
            </div>
            <div>
              <div className="text-slate-500 text-[10px]">Assigned Officer:</div>
              <div className="font-bold text-indigo-900">{selectedTicket.assignedOfficer}</div>
              <div className="text-slate-600">{selectedTicket.assignedDepartment}</div>
            </div>
            <div>
              <div className="text-slate-500 text-[10px]">SLA Target Deadline:</div>
              <div className="font-bold text-rose-700">{selectedTicket.slaDeadline}</div>
              <div className="text-slate-600">Created: {selectedTicket.createdAt}</div>
            </div>
          </div>

          {/* Messages & Actions Conversation Thread */}
          <div className="space-y-3">
            <div className="font-bold text-slate-800 text-xs">Official Case Resolution Trail:</div>

            <div className="space-y-2.5 max-h-[340px] overflow-y-auto p-2 bg-slate-50/50 rounded-lg border border-slate-100">
              {selectedTicket.messages.map((msg, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-lg border text-xs space-y-1 ${
                    msg.senderRole === 'Parent'
                      ? 'bg-white border-slate-200'
                      : 'bg-indigo-50/70 border-indigo-200'
                  }`}
                >
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-bold text-slate-900 flex items-center gap-1">
                      <User className="w-3 h-3 text-indigo-600" />
                      {msg.senderName} ({msg.senderRole})
                    </span>
                    <span className="text-slate-400">{msg.timestamp}</span>
                  </div>
                  <p className="text-slate-800 leading-relaxed">{msg.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Reply & Status Resolution Action Box */}
          <form onSubmit={handleSendReply} className="space-y-2 pt-2 border-t">
            <div className="flex justify-between items-center">
              <label className="font-bold text-slate-700">Official Officer Response:</label>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-500 font-semibold">Change Status:</span>
                <button
                  type="button"
                  onClick={() => handleUpdateStatus('Under Investigation')}
                  className="px-2 py-0.5 bg-blue-100 hover:bg-blue-200 text-blue-900 rounded font-bold text-[10px]"
                >
                  Investigating
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateStatus('Resolved')}
                  className="px-2 py-0.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 rounded font-bold text-[10px]"
                >
                  Mark Resolved
                </button>
              </div>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type official communication reply or investigation findings..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="flex-1 p-2 border rounded-lg text-xs"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded-lg font-bold flex items-center gap-1"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send &amp; Notify Parent</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
