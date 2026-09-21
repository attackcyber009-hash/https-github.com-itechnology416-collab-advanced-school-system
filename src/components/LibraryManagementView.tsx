import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Plus,
  ArrowUpRight,
  RotateCcw,
  Barcode,
  Library,
  BookMarked,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Printer,
  Download,
  FileText,
  UserCheck,
  Calendar,
  Layers,
  Sparkles,
  QrCode,
  Tag,
  BookUp2,
  Coins,
} from 'lucide-react';
import { BookCatalogItem, BookIssueReturnRecord, Student, StaffMember } from '../types';
import { INITIAL_BOOKS, INITIAL_BOOK_CIRCULATION_LOGS } from '../data/phase7Data';

interface LibraryManagementViewProps {
  students: Student[];
  staff?: StaffMember[];
  onPrintBookLabel?: (book: BookCatalogItem) => void;
}

export default function LibraryManagementView({
  students,
  staff = [],
  onPrintBookLabel,
}: LibraryManagementViewProps) {
  const [books, setBooks] = useState<BookCatalogItem[]>(INITIAL_BOOKS);
  const [circulationLogs, setCirculationLogs] = useState<BookIssueReturnRecord[]>(
    INITIAL_BOOK_CIRCULATION_LOGS
  );

  const [activeTab, setActiveTab] = useState<'catalog' | 'circulation' | 'issue_return' | 'opac'>(
    'catalog'
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  // Modals state
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [selectedBookForIssue, setSelectedBookForIssue] = useState<BookCatalogItem | null>(null);

  // New Book Form
  const [newBook, setNewBook] = useState<Partial<BookCatalogItem>>({
    title: '',
    titleUrdu: '',
    author: '',
    publisher: 'Oxford University Press Pakistan',
    edition: '1st Edition',
    category: 'Science & Tech',
    language: 'English',
    shelfLocation: 'Rack S1 - Shelf 1',
    totalCopies: 5,
    availableCopies: 5,
    pricePkr: 1200,
    barcode: '9780199000000',
    status: 'Available',
  });

  // Issue Book Form
  const [issueForm, setIssueForm] = useState({
    borrowerType: 'Student' as 'Student' | 'Staff',
    borrowerId: students[0]?.id || '',
    borrowerName: students[0]?.name || '',
    classNameOrDept: students[0]?.className || 'Class One',
    days: 14,
  });

  // Stats
  const totalTitles = books.length;
  const totalVolumeCopies = books.reduce((acc, b) => acc + b.totalCopies, 0);
  const currentlyIssued = circulationLogs.filter((c) => c.status === 'Issued' || c.status === 'Overdue').length;
  const overdueCount = circulationLogs.filter((c) => c.status === 'Overdue').length;

  const filteredBooks = books.filter((b) => {
    const matchesSearch =
      b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.titleUrdu && b.titleUrdu.includes(searchTerm)) ||
      b.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.accessionNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.isbn.includes(searchTerm) ||
      b.shelfLocation.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || b.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || b.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleCreateBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBook.title || !newBook.author) {
      alert('Please provide Book Title and Author Name');
      return;
    }

    const created: BookCatalogItem = {
      id: `bk-${Date.now()}`,
      isbn: newBook.isbn || `978-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      accessionNo: `LIB-2024-${String(books.length + 101).padStart(4, '0')}`,
      title: newBook.title || '',
      titleUrdu: newBook.titleUrdu || '',
      author: newBook.author || '',
      publisher: newBook.publisher || 'The Educators Publications',
      edition: newBook.edition || '1st Edition',
      category: (newBook.category as any) || 'Science & Tech',
      language: (newBook.language as any) || 'English',
      shelfLocation: newBook.shelfLocation || 'Rack A1 - Shelf 1',
      totalCopies: Number(newBook.totalCopies) || 1,
      availableCopies: Number(newBook.totalCopies) || 1,
      pricePkr: Number(newBook.pricePkr) || 500,
      barcode: newBook.barcode || `${Math.floor(1000000000000 + Math.random() * 900000000000)}`,
      status: 'Available',
    };

    setBooks([created, ...books]);
    setShowAddBookModal(false);
    alert(`Book "${created.title}" successfully added with Accession #${created.accessionNo}`);
  };

  const handleIssueBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookForIssue) return;

    if (selectedBookForIssue.availableCopies <= 0) {
      alert('No available copies left in stock for this book.');
      return;
    }

    const issueDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + (Number(issueForm.days) || 14));

    const newLog: BookIssueReturnRecord = {
      id: `circ-${Date.now()}`,
      issueCode: `ISS-2024-${Math.floor(1000 + Math.random() * 9000)}`,
      bookId: selectedBookForIssue.id,
      bookTitle: selectedBookForIssue.title,
      accessionNo: selectedBookForIssue.accessionNo,
      borrowerType: issueForm.borrowerType,
      borrowerId: issueForm.borrowerId,
      borrowerName: issueForm.borrowerName,
      classNameOrDept: issueForm.classNameOrDept,
      issueDate: issueDate.toISOString().split('T')[0],
      dueDate: dueDate.toISOString().split('T')[0],
      finePerDayPkr: 10,
      finePaidPkr: 0,
      status: 'Issued',
      issuedBy: 'Mrs. Saima (Librarian)',
    };

    setCirculationLogs([newLog, ...circulationLogs]);
    setBooks(
      books.map((b) =>
        b.id === selectedBookForIssue.id
          ? {
              ...b,
              availableCopies: b.availableCopies - 1,
              status: b.availableCopies - 1 === 0 ? 'Checked Out' : 'Available',
            }
          : b
      )
    );

    setShowIssueModal(false);
    alert(`Book "${selectedBookForIssue.title}" issued to ${issueForm.borrowerName}. Due Date: ${newLog.dueDate}`);
  };

  const handleReturnBook = (logId: string) => {
    const log = circulationLogs.find((l) => l.id === logId);
    if (!log) return;

    const returnDateStr = new Date().toISOString().split('T')[0];

    // Calculate overdue fine if any
    const due = new Date(log.dueDate).getTime();
    const returned = new Date(returnDateStr).getTime();
    const diffDays = Math.max(0, Math.ceil((returned - due) / (1000 * 3600 * 24)));
    const calculatedFine = diffDays * log.finePerDayPkr;

    setCirculationLogs(
      circulationLogs.map((l) =>
        l.id === logId
          ? {
              ...l,
              returnDate: returnDateStr,
              status: 'Returned',
              finePaidPkr: calculatedFine,
              conditionOnReturn: 'Good',
            }
          : l
      )
    );

    setBooks(
      books.map((b) =>
        b.id === log.bookId
          ? {
              ...b,
              availableCopies: Math.min(b.totalCopies, b.availableCopies + 1),
              status: 'Available',
            }
          : b
      )
    );

    alert(
      `Book "${log.bookTitle}" returned successfully! ${
        calculatedFine > 0 ? `Late Fine Collected: PKR ${calculatedFine}` : 'No fine incurred.'
      }`
    );
  };

  return (
    <div id="library-management-suite" className="space-y-4">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#002147] via-[#0b3366] to-[#124282] rounded-xl p-5 text-white shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-amber-400/20 rounded-lg text-amber-300 border border-amber-400/30">
              <Library className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold tracking-tight">
              Central Library &amp; E-Resource Repository (OPAC)
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-400 text-slate-900">
              Phase 7
            </span>
          </div>
          <p className="text-slate-200 text-xs max-w-2xl">
            Automated book accession cataloging, Barcode RFID circulation desk, fine calculations, course text allotments &amp; digital reading archives.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowAddBookModal(true)}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Book / Title</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedBookForIssue(books[0]);
              setShowIssueModal(true);
            }}
            className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
          >
            <BookUp2 className="w-4 h-4" />
            <span>Quick Issue Desk</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Summary Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Catalog Titles</div>
            <div className="text-xl font-black text-[#002147] mt-0.5">{totalTitles}</div>
            <div className="text-[10px] text-slate-400">{totalVolumeCopies} Total Physical Copies</div>
          </div>
          <div className="p-2.5 bg-blue-50 text-blue-700 rounded-lg">
            <BookMarked className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Currently Issued</div>
            <div className="text-xl font-black text-amber-600 mt-0.5">{currentlyIssued}</div>
            <div className="text-[10px] text-slate-400">Circulation in Active Loan</div>
          </div>
          <div className="p-2.5 bg-amber-50 text-amber-700 rounded-lg">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Overdue Alerts</div>
            <div className="text-xl font-black text-rose-600 mt-0.5">{overdueCount}</div>
            <div className="text-[10px] text-rose-500 font-semibold">PKR 10/day Late Penalty</div>
          </div>
          <div className="p-2.5 bg-rose-50 text-rose-700 rounded-lg">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">E-Library Resources</div>
            <div className="text-xl font-black text-emerald-600 mt-0.5">4 E-Books</div>
            <div className="text-[10px] text-emerald-600">Digital Access Active</div>
          </div>
          <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-lg">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-xl px-4 pt-2 gap-2 text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveTab('catalog')}
          className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition ${
            activeTab === 'catalog'
              ? 'border-[#002147] text-[#002147]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Book Catalog &amp; Accession Ledger ({filteredBooks.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('circulation')}
          className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition ${
            activeTab === 'circulation'
              ? 'border-[#002147] text-[#002147]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <RotateCcw className="w-4 h-4" />
          <span>Issue &amp; Return Circulation Logs ({circulationLogs.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('opac')}
          className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition ${
            activeTab === 'opac'
              ? 'border-[#002147] text-[#002147]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>Student OPAC &amp; Digital Reading Room</span>
        </button>
      </div>

      {/* TAB 1: BOOK CATALOG */}
      {activeTab === 'catalog' && (
        <div className="bg-white rounded-b-xl border border-slate-200 p-4 space-y-4 shadow-xs">
          {/* Filters Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by Title, Urdu Name, Author, ISBN, Accession #, Rack Location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#002147]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium"
              >
                <option value="All">All Categories</option>
                <option value="Science & Tech">Science &amp; Tech</option>
                <option value="Islamic Studies">Islamic Studies</option>
                <option value="Literature & Fiction">Literature &amp; Fiction</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Pakistan Studies & History">Pakistan Studies &amp; History</option>
                <option value="Course Textbooks">Course Textbooks</option>
                <option value="General Knowledge & Encyclopedias">General Knowledge</option>
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium"
              >
                <option value="All">All Statuses</option>
                <option value="Available">Available</option>
                <option value="Low Stock">Low Stock</option>
                <option value="Checked Out">Checked Out</option>
                <option value="Reference Only">Reference Only</option>
              </select>
            </div>
          </div>

          {/* Book Catalog Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#002147] text-white uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-3">Accession &amp; Barcode</th>
                  <th className="p-3">Title &amp; Subject</th>
                  <th className="p-3">Author &amp; Publisher</th>
                  <th className="p-3">Shelf Rack Location</th>
                  <th className="p-3 text-center">Stock (Avail/Total)</th>
                  <th className="p-3">Price (PKR)</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {filteredBooks.map((bk) => (
                  <tr key={bk.id} className="hover:bg-slate-50 transition">
                    <td className="p-3 font-mono font-bold text-slate-700">
                      <div className="text-[#002147]">{bk.accessionNo}</div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Barcode className="w-3 h-3" />
                        <span>{bk.barcode}</span>
                      </div>
                    </td>

                    <td className="p-3">
                      <div className="font-bold text-slate-900">{bk.title}</div>
                      {bk.titleUrdu && (
                        <div className="text-[11px] text-emerald-800 font-serif">{bk.titleUrdu}</div>
                      )}
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                        ISBN: {bk.isbn} • {bk.edition}
                      </div>
                    </td>

                    <td className="p-3">
                      <div className="font-medium text-slate-800">{bk.author}</div>
                      <div className="text-[10px] text-slate-500">{bk.publisher}</div>
                    </td>

                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-200 font-mono text-[11px]">
                        {bk.shelfLocation}
                      </span>
                    </td>

                    <td className="p-3 text-center font-mono">
                      <span
                        className={`font-bold ${
                          bk.availableCopies === 0 ? 'text-rose-600' : 'text-emerald-700'
                        }`}
                      >
                        {bk.availableCopies}
                      </span>
                      <span className="text-slate-400"> / {bk.totalCopies}</span>
                    </td>

                    <td className="p-3 font-mono font-semibold text-slate-800">
                      PKR {bk.pricePkr.toLocaleString()}
                    </td>

                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          bk.status === 'Available'
                            ? 'bg-emerald-100 text-emerald-800'
                            : bk.status === 'Low Stock'
                            ? 'bg-amber-100 text-amber-800'
                            : bk.status === 'Reference Only'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {bk.status}
                      </span>
                    </td>

                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {bk.status !== 'Reference Only' && bk.availableCopies > 0 && (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedBookForIssue(bk);
                              setShowIssueModal(true);
                            }}
                            className="px-2 py-1 bg-amber-500 hover:bg-amber-600 text-slate-900 rounded font-bold text-[10px] flex items-center gap-1 shadow-xs transition"
                            title="Issue to Student / Staff"
                          >
                            <BookUp2 className="w-3 h-3" />
                            <span>Issue</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            if (onPrintBookLabel) {
                              onPrintBookLabel(bk);
                            } else {
                              alert(`Printing Accession Tag & Barcode Label for: ${bk.title}\nAccession: ${bk.accessionNo}\nShelf: ${bk.shelfLocation}`);
                            }
                          }}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded"
                          title="Print Barcode Spine Label"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: CIRCULATION LOGS */}
      {activeTab === 'circulation' && (
        <div className="bg-white rounded-b-xl border border-slate-200 p-4 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>Active Book Loans &amp; Circulation History</span>
            </h3>
            <span className="text-xs text-slate-500">
              Standard Loan: 14 Days for Students, 30 Days for Faculty
            </span>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#002147] text-white uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-3">Issue Code</th>
                  <th className="p-3">Book Title &amp; Accession</th>
                  <th className="p-3">Borrower Details</th>
                  <th className="p-3">Issue Date</th>
                  <th className="p-3">Due Date</th>
                  <th className="p-3">Return Date</th>
                  <th className="p-3">Late Fine</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {circulationLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition">
                    <td className="p-3 font-mono font-bold text-slate-800">{log.issueCode}</td>

                    <td className="p-3">
                      <div className="font-bold text-slate-900">{log.bookTitle}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{log.accessionNo}</div>
                    </td>

                    <td className="p-3">
                      <div className="font-bold text-slate-800">{log.borrowerName}</div>
                      <div className="text-[10px] text-slate-500">
                        {log.borrowerType} • {log.classNameOrDept}
                      </div>
                    </td>

                    <td className="p-3 font-mono text-slate-600">{log.issueDate}</td>
                    <td className="p-3 font-mono text-amber-700 font-bold">{log.dueDate}</td>
                    <td className="p-3 font-mono text-slate-500">{log.returnDate || '—'}</td>

                    <td className="p-3 font-mono">
                      {log.finePaidPkr > 0 ? (
                        <span className="text-rose-600 font-bold">PKR {log.finePaidPkr}</span>
                      ) : (
                        <span className="text-slate-400">PKR 0</span>
                      )}
                    </td>

                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          log.status === 'Returned'
                            ? 'bg-emerald-100 text-emerald-800'
                            : log.status === 'Overdue'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>

                    <td className="p-3 text-right">
                      {log.status !== 'Returned' && (
                        <button
                          type="button"
                          onClick={() => handleReturnBook(log.id)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-[10px] flex items-center gap-1 shadow-xs transition"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Accept Return</span>
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

      {/* TAB 3: OPAC DIGITAL READING ROOM */}
      {activeTab === 'opac' && (
        <div className="bg-white rounded-b-xl border border-slate-200 p-6 space-y-6 shadow-xs">
          <div className="max-w-xl mx-auto text-center space-y-2">
            <h2 className="text-lg font-black text-[#002147] tracking-tight">
              Online Public Access Catalog (OPAC) &amp; Digital Repository
            </h2>
            <p className="text-slate-500 text-xs">
              Students and parents can browse digital e-books, past papers, curriculum guides and verify physical shelf availability in real time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {books.map((b) => (
              <div
                key={b.id}
                className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-sm transition bg-gradient-to-b from-slate-50 to-white flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-semibold text-[10px]">
                      {b.category}
                    </span>
                    <span
                      className={`text-[10px] font-bold ${
                        b.availableCopies > 0 ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {b.availableCopies > 0 ? `${b.availableCopies} Available on Shelf` : 'Checked Out'}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm">{b.title}</h3>
                  {b.titleUrdu && (
                    <div className="text-xs text-emerald-800 font-serif">{b.titleUrdu}</div>
                  )}
                  <p className="text-slate-600 text-xs">By {b.author}</p>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                  <span className="font-mono text-slate-500">{b.shelfLocation}</span>
                  {b.eBookPdfUrl ? (
                    <button
                      type="button"
                      onClick={() =>
                        alert(`Opening Digital E-Book Reader for "${b.title}" (PDF encrypted copy)`)
                      }
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-[10px] flex items-center gap-1 shadow-xs"
                    >
                      <Download className="w-3 h-3" />
                      <span>Read E-Book</span>
                    </button>
                  ) : (
                    <span className="text-[10px] text-slate-400 font-mono">Physical Copy</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL 1: ADD NEW BOOK */}
      {showAddBookModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#002147]" />
                <h3 className="font-bold text-slate-900 text-base">Register New Book in Library</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddBookModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateBook} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Book Title (English) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Oxford Secondary Science for Pakistan"
                  value={newBook.title}
                  onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:ring-1 focus:ring-[#002147]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Book Title (Urdu / Arabic)</label>
                <input
                  type="text"
                  placeholder="مثال: آکسفورڈ سیکنڈری سائنس"
                  value={newBook.titleUrdu}
                  onChange={(e) => setNewBook({ ...newBook, titleUrdu: e.target.value })}
                  className="w-full p-2 border rounded-lg font-serif text-right focus:ring-1 focus:ring-[#002147]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Author Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Terry Jennings"
                    value={newBook.author}
                    onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                    className="w-full p-2 border rounded-lg focus:ring-1 focus:ring-[#002147]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Publisher</label>
                  <input
                    type="text"
                    placeholder="e.g. Oxford University Press"
                    value={newBook.publisher}
                    onChange={(e) => setNewBook({ ...newBook, publisher: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category / Genre</label>
                  <select
                    value={newBook.category}
                    onChange={(e) => setNewBook({ ...newBook, category: e.target.value as any })}
                    className="w-full p-2 border rounded-lg bg-white"
                  >
                    <option value="Science & Tech">Science &amp; Tech</option>
                    <option value="Islamic Studies">Islamic Studies</option>
                    <option value="Literature & Fiction">Literature &amp; Fiction</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Pakistan Studies & History">Pakistan Studies &amp; History</option>
                    <option value="Course Textbooks">Course Textbooks</option>
                    <option value="General Knowledge & Encyclopedias">General Knowledge</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Shelf Location / Rack</label>
                  <input
                    type="text"
                    placeholder="e.g. Rack S2 - Shelf 3"
                    value={newBook.shelfLocation}
                    onChange={(e) => setNewBook({ ...newBook, shelfLocation: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Total Copies</label>
                  <input
                    type="number"
                    min="1"
                    value={newBook.totalCopies}
                    onChange={(e) =>
                      setNewBook({
                        ...newBook,
                        totalCopies: Number(e.target.value),
                        availableCopies: Number(e.target.value),
                      })
                    }
                    className="w-full p-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Price (PKR)</label>
                  <input
                    type="number"
                    min="0"
                    value={newBook.pricePkr}
                    onChange={(e) => setNewBook({ ...newBook, pricePkr: Number(e.target.value) })}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Language</label>
                  <select
                    value={newBook.language}
                    onChange={(e) => setNewBook({ ...newBook, language: e.target.value as any })}
                    className="w-full p-2 border rounded-lg bg-white"
                  >
                    <option value="English">English</option>
                    <option value="Urdu">Urdu</option>
                    <option value="Arabic">Arabic</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddBookModal(false)}
                  className="px-4 py-2 border rounded-lg font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#002147] hover:bg-[#0b3366] text-white rounded-lg font-bold shadow-sm"
                >
                  Save to Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ISSUE BOOK DESK */}
      {showIssueModal && selectedBookForIssue && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <BookUp2 className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-slate-900 text-base">Issue Book to Borrower</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowIssueModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-slate-50 border rounded-lg space-y-1 text-xs">
              <div className="font-bold text-slate-900">{selectedBookForIssue.title}</div>
              <div className="text-[11px] text-slate-500 font-mono">
                Accession: {selectedBookForIssue.accessionNo} • Rack: {selectedBookForIssue.shelfLocation}
              </div>
              <div className="text-[11px] font-bold text-emerald-700">
                Available Copies: {selectedBookForIssue.availableCopies}
              </div>
            </div>

            <form onSubmit={handleIssueBook} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Borrower Category</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="borrowerType"
                      checked={issueForm.borrowerType === 'Student'}
                      onChange={() => {
                        setIssueForm({
                          ...issueForm,
                          borrowerType: 'Student',
                          borrowerId: students[0]?.id || '',
                          borrowerName: students[0]?.name || '',
                          classNameOrDept: students[0]?.className || 'Class One',
                          days: 14,
                        });
                      }}
                    />
                    <span>Student</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="borrowerType"
                      checked={issueForm.borrowerType === 'Staff'}
                      onChange={() => {
                        setIssueForm({
                          ...issueForm,
                          borrowerType: 'Staff',
                          borrowerId: 'stf-1',
                          borrowerName: 'Prof. Tariq Mahmood',
                          classNameOrDept: 'Senior Faculty',
                          days: 30,
                        });
                      }}
                    />
                    <span>Faculty / Staff</span>
                  </label>
                </div>
              </div>

              {issueForm.borrowerType === 'Student' ? (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Select Student</label>
                  <select
                    value={issueForm.borrowerId}
                    onChange={(e) => {
                      const std = students.find((s) => s.id === e.target.value);
                      if (std) {
                        setIssueForm({
                          ...issueForm,
                          borrowerId: std.id,
                          borrowerName: std.name,
                          classNameOrDept: `${std.className} (Sec ${std.section})`,
                        });
                      }
                    }}
                    className="w-full p-2 border rounded-lg bg-white"
                  >
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.studentCode} - {s.name} ({s.className})
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Staff Member Name</label>
                  <input
                    type="text"
                    value={issueForm.borrowerName}
                    onChange={(e) => setIssueForm({ ...issueForm, borrowerName: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">Loan Period (Days)</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={issueForm.days}
                  onChange={(e) => setIssueForm({ ...issueForm, days: Number(e.target.value) })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowIssueModal(false)}
                  className="px-4 py-2 border rounded-lg font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 rounded-lg font-bold shadow-sm"
                >
                  Confirm Issue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
