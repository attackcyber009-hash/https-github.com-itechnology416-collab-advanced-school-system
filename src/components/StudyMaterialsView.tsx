import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookMarked,
  Plus,
  Trash2,
  Download,
  Search,
  Filter,
  FileText,
  FileVideo,
  Presentation,
  CheckCircle,
  Eye,
  Info,
  Calendar,
  User,
  ExternalLink,
  BookOpen,
  FolderOpen,
  ArrowRight,
  UploadCloud,
  Check
} from 'lucide-react';
import { StudyMaterial, ClassInfo } from '../types';

interface StudyMaterialsViewProps {
  materials: StudyMaterial[];
  classes: ClassInfo[];
  onAddMaterial: (mat: StudyMaterial) => void;
  onDeleteMaterial: (id: string) => void;
  initialAction?: 'browse' | 'upload';
}

export default function StudyMaterialsView({
  materials,
  classes,
  onAddMaterial,
  onDeleteMaterial,
  initialAction = 'browse'
}: StudyMaterialsViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'browse' | 'upload'>(initialAction);

  useEffect(() => {
    setActiveSubTab(initialAction);
  }, [initialAction]);

  // Filters for Browse Repository
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('All');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');

  // Preview Document Modal State
  const [previewMaterial, setPreviewMaterial] = useState<StudyMaterial | null>(null);

  // Form State for uploading new materials
  const [uploadForm, setUploadForm] = useState({
    title: '',
    className: classes[0]?.name || 'Class One',
    subject: 'Mathematics',
    teacherName: 'Prof. Tariq Mahmood',
    fileType: 'PDF' as StudyMaterial['fileType'],
    fileSize: '4.2 MB',
    description: '',
  });

  const [dragActive, setDragActive] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Extract all unique subjects found in the materials list
  const uniqueSubjects = Array.from(new Set(materials.map((m) => m.subject)));

  // Filter study materials dynamically
  const filteredMaterials = materials.filter((mat) => {
    const matchesSearch =
      mat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (mat.description && mat.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      mat.teacherName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesClass = selectedClass === 'All' || mat.className === selectedClass;
    const matchesSubject = selectedSubject === 'All' || mat.subject === selectedSubject;
    const matchesType = selectedType === 'All' || mat.fileType === selectedType;

    return matchesSearch && matchesClass && matchesSubject && matchesType;
  });

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFileName(file.name);
      
      // Auto-extract mock size and type
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      const ext = file.name.split('.').pop()?.toUpperCase() || 'PDF';
      const fileTypeVal = ['PDF', 'DOCX', 'PPTX', 'VIDEO'].includes(ext) 
        ? ext as StudyMaterial['fileType'] 
        : 'PDF';

      setUploadForm((prev) => ({
        ...prev,
        title: prev.title || file.name.substring(0, file.name.lastIndexOf('.')) || file.name,
        fileType: fileTypeVal,
        fileSize: `${sizeMB} MB`
      }));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFileName(file.name);

      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      const ext = file.name.split('.').pop()?.toUpperCase() || 'PDF';
      const fileTypeVal = ['PDF', 'DOCX', 'PPTX', 'VIDEO'].includes(ext)
        ? ext as StudyMaterial['fileType']
        : 'PDF';

      setUploadForm((prev) => ({
        ...prev,
        title: prev.title || file.name.substring(0, file.name.lastIndexOf('.')) || file.name,
        fileType: fileTypeVal,
        fileSize: `${sizeMB} MB`
      }));
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadForm.title.trim()) {
      alert('Please provide a title for the study material.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          
          // Construct item
          const newMaterial: StudyMaterial = {
            id: `mat-${Date.now()}`,
            title: uploadForm.title,
            className: uploadForm.className,
            subject: uploadForm.subject,
            teacherName: uploadForm.teacherName,
            fileType: uploadForm.fileType,
            fileSize: uploadForm.fileSize,
            uploadDate: new Date().toISOString().split('T')[0],
            description: uploadForm.description || 'No description provided.',
            downloadUrl: '#'
          };

          onAddMaterial(newMaterial);
          setIsUploading(false);
          setSelectedFileName(null);
          setUploadForm({
            title: '',
            className: classes[0]?.name || 'Class One',
            subject: 'Mathematics',
            teacherName: 'Prof. Tariq Mahmood',
            fileType: 'PDF',
            fileSize: '4.2 MB',
            description: '',
          });

          setActiveSubTab('browse');
          alert('Study resource uploaded successfully to repository!');
          return 100;
        }
        return prev + 25;
      });
    }, 250);
  };

  // Icon selector based on fileType
  const renderFileTypeIcon = (type: StudyMaterial['fileType'], sizeClass = 'w-5 h-5') => {
    switch (type) {
      case 'PDF':
        return <FileText className={`${sizeClass} text-rose-500`} />;
      case 'PPTX':
        return <Presentation className={`${sizeClass} text-amber-500`} />;
      case 'VIDEO':
        return <FileVideo className={`${sizeClass} text-violet-500`} />;
      default:
        return <BookOpen className={`${sizeClass} text-sky-500`} />;
    }
  };

  return (
    <div id="study-materials-management-hub" className="space-y-5">
      {/* Upper Module Info Bar */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#002147] to-indigo-900/10 text-[#002147] flex items-center justify-center font-bold shadow-xs">
            <BookMarked className="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-800">
                Institutional Study Materials Library
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-[#002147] text-amber-300 border border-amber-500/20">
                LMS Repository
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Manage and index online lectures, syllabus documents, question banks, and learning worksheets for students across all classes.
            </p>
          </div>
        </div>

        {/* Action shortcut trigger */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveSubTab('upload')}
            className="px-3.5 py-1.5 bg-[#002147] hover:bg-slate-900 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-sm transition cursor-pointer"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>Upload Study Material</span>
          </button>
        </div>
      </div>

      {/* Sub-Tabs Switcher */}
      <div className="bg-white rounded-lg border border-slate-200 p-1 shadow-xs flex flex-wrap items-center gap-1 text-xs font-medium">
        <button
          type="button"
          onClick={() => setActiveSubTab('browse')}
          className={`px-4 py-2 rounded-md transition flex items-center gap-1.5 ${
            activeSubTab === 'browse'
              ? 'bg-[#002147] text-white font-bold shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FolderOpen className="w-4 h-4 text-amber-400" />
          <span>Browse Repository ({materials.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('upload')}
          className={`px-4 py-2 rounded-md transition flex items-center gap-1.5 ${
            activeSubTab === 'upload'
              ? 'bg-[#002147] text-white font-bold shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <UploadCloud className="w-4 h-4 text-teal-400" />
          <span>Upload Materials</span>
        </button>
      </div>

      {/* Inner Workspaces */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSubTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.15 }}
          className="space-y-4"
        >
          {/* ========================================== */}
          {/* SUBTAB 1: BROWSE REPOSITORY                */}
          {/* ========================================== */}
          {activeSubTab === 'browse' && (
            <div className="space-y-4">
              {/* Complex filter toolbar */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs grid grid-cols-1 md:grid-cols-12 gap-3 text-xs">
                {/* Search query input */}
                <div className="md:col-span-4 relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search by title, teacher, description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white text-xs outline-none focus:ring-1 focus:ring-slate-400 font-medium text-slate-800"
                  />
                </div>

                {/* Class selector */}
                <div className="md:col-span-3">
                  <div className="flex items-center gap-1.5 bg-slate-50 border rounded-lg px-2.5 py-1.5">
                    <Filter className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-bold text-slate-500 mr-1">Class:</span>
                    <select
                      value={selectedClass}
                      onChange={(e) => setSelectedClass(e.target.value)}
                      className="bg-transparent text-slate-800 font-semibold outline-none flex-1 cursor-pointer"
                    >
                      <option value="All">All Classes</option>
                      {classes.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Subject selector */}
                <div className="md:col-span-3">
                  <div className="flex items-center gap-1.5 bg-slate-50 border rounded-lg px-2.5 py-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-bold text-slate-500 mr-1">Subject:</span>
                    <select
                      value={selectedSubject}
                      onChange={(e) => setSelectedSubject(e.target.value)}
                      className="bg-transparent text-slate-800 font-semibold outline-none flex-1 cursor-pointer"
                    >
                      <option value="All">All Subjects</option>
                      {uniqueSubjects.map((sub) => (
                        <option key={sub} value={sub}>
                          {sub}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* File Type Filter */}
                <div className="md:col-span-2">
                  <div className="flex items-center gap-1.5 bg-slate-50 border rounded-lg px-2.5 py-1.5">
                    <span className="font-bold text-slate-500">Format:</span>
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="bg-transparent text-slate-800 font-semibold outline-none flex-1 cursor-pointer"
                    >
                      <option value="All">All</option>
                      <option value="PDF">PDF</option>
                      <option value="PPTX">PPTX</option>
                      <option value="DOCX">DOC</option>
                      <option value="VIDEO">Video</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Browse Grid View */}
              {filteredMaterials.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400 space-y-3">
                  <BookMarked className="w-12 h-12 text-slate-300 mx-auto" />
                  <div className="space-y-1">
                    <p className="font-bold text-slate-700 text-sm">No materials match your query</p>
                    <p className="text-xs text-slate-500">
                      Try resetting filters or adjusting search parameters.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedClass('All');
                      setSelectedSubject('All');
                      setSelectedType('All');
                    }}
                    className="px-4 py-2 border rounded font-bold text-xs hover:bg-slate-50 transition cursor-pointer"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredMaterials.map((mat) => (
                    <div
                      key={mat.id}
                      className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-md transition flex flex-col justify-between overflow-hidden text-xs"
                    >
                      <div className="p-4 space-y-3">
                        {/* Upper Info Head */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <div className="p-2 rounded bg-slate-100">
                              {renderFileTypeIcon(mat.fileType)}
                            </div>
                            <div>
                              <span className="text-[9px] font-black uppercase bg-[#002147] text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/10">
                                {mat.className}
                              </span>
                              <span className="text-[10px] text-slate-400 font-semibold block mt-0.5 font-mono">
                                {mat.subject}
                              </span>
                            </div>
                          </div>

                          <span className="text-[10px] text-slate-400 font-mono">
                            {mat.fileSize}
                          </span>
                        </div>

                        {/* Title and descriptions */}
                        <div className="space-y-1">
                          <h4 className="font-bold text-slate-800 text-sm hover:text-indigo-950 transition cursor-pointer line-clamp-1" title={mat.title}>
                            {mat.title}
                          </h4>
                          <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                            {mat.description || 'Syllabus worksheets uploaded for self-learning purposes.'}
                          </p>
                        </div>

                        {/* Teacher & upload details block */}
                        <div className="grid grid-cols-2 gap-1 pt-2 border-t border-slate-100 text-[10px] text-slate-500 font-mono">
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3 text-slate-400" />
                            <span className="truncate">{mat.teacherName}</span>
                          </div>
                          <div className="text-right flex items-center justify-end gap-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            <span>{mat.uploadDate}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action trigger footer */}
                      <div className="bg-slate-50 px-4 py-2.5 border-t border-slate-100 flex items-center justify-between gap-3 text-[11px]">
                        <button
                          type="button"
                          onClick={() => setPreviewMaterial(mat)}
                          className="text-indigo-950 hover:text-indigo-900 font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#002147]" />
                          <span>Interactive Preview</span>
                        </button>

                        <div className="flex items-center gap-2">
                          <a
                            href={mat.downloadUrl || '#'}
                            onClick={(e) => {
                              if (mat.downloadUrl === '#') {
                                e.preventDefault();
                                alert(`Simulating download stream for: "${mat.title}"`);
                              }
                            }}
                            className="p-1 text-sky-800 hover:text-sky-950 hover:bg-sky-100 rounded transition"
                            title="Download Material"
                          >
                            <Download className="w-4 h-4" />
                          </a>

                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete "${mat.title}"?`)) {
                                onDeleteMaterial(mat.id);
                                alert('Material deleted successfully from repository.');
                              }
                            }}
                            className="p-1 text-rose-600 hover:text-rose-950 hover:bg-rose-100 rounded transition cursor-pointer"
                            title="Delete Material"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ========================================== */}
          {/* SUBTAB 2: UPLOAD MATERIALS                  */}
          {/* ========================================== */}
          {activeSubTab === 'upload' && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4 text-xs">
                <div className="border-b pb-2">
                  <h3 className="font-bold text-slate-800 flex items-center gap-1.5">
                    <UploadCloud className="w-4 h-4 text-teal-500" />
                    <span>Upload Learning Resource</span>
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Drop PDF guides, lecture slideshows, word assignments, or video file indicators into the institution's digital library index.
                  </p>
                </div>

                <form onSubmit={handleUploadSubmit} className="space-y-4">
                  {/* File drag-drop zones */}
                  <div
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition ${
                      dragActive ? 'border-[#002147] bg-indigo-50/20' : 'border-slate-300 hover:border-slate-400 bg-slate-50'
                    }`}
                  >
                    <input
                      id="upload-file-selector"
                      type="file"
                      className="hidden"
                      onChange={handleFileSelect}
                      accept=".pdf,.docx,.doc,.pptx,.ppt,.mp4"
                    />
                    
                    <div className="space-y-2">
                      <div className="w-12 h-12 bg-[#002147]/5 text-[#002147] rounded-full flex items-center justify-center mx-auto">
                        <UploadCloud className="w-6 h-6 text-amber-500" />
                      </div>
                      
                      {selectedFileName ? (
                        <div className="space-y-1">
                          <p className="font-bold text-emerald-800">File Selected ✓</p>
                          <p className="text-[11px] text-slate-600 font-mono font-bold">{selectedFileName}</p>
                          <button
                            type="button"
                            onClick={() => setSelectedFileName(null)}
                            className="text-xs text-rose-500 hover:underline font-bold mt-1"
                          >
                            Remove File
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <p className="font-bold text-slate-700">Drag &amp; Drop study file here</p>
                          <p className="text-[10px] text-slate-400">or click the button below to browse local storage</p>
                          <div className="pt-2">
                            <label
                              htmlFor="upload-file-selector"
                              className="px-3 py-1.5 bg-[#002147] text-white hover:bg-slate-900 rounded font-bold text-[10px] transition cursor-pointer inline-block"
                            >
                              Browse Files
                            </label>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Form inputs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Document Title *</label>
                      <input
                        type="text"
                        required
                        value={uploadForm.title}
                        onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                        placeholder="e.g. Chapter 4 Integration Practice Sheet"
                        className="w-full p-2 border border-slate-300 rounded font-semibold text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Target Class *</label>
                      <select
                        value={uploadForm.className}
                        onChange={(e) => setUploadForm({ ...uploadForm, className: e.target.value })}
                        className="w-full p-2 border border-slate-300 rounded bg-white font-semibold text-slate-800"
                      >
                        {classes.map((c) => (
                          <option key={c.id} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Subject *</label>
                      <select
                        value={uploadForm.subject}
                        onChange={(e) => setUploadForm({ ...uploadForm, subject: e.target.value })}
                        className="w-full p-2 border border-slate-300 rounded bg-white font-semibold text-slate-800"
                      >
                        <option value="Mathematics">Mathematics</option>
                        <option value="English">English</option>
                        <option value="Urdu">Urdu</option>
                        <option value="General Science">General Science</option>
                        <option value="Islamiat">Islamiat</option>
                        <option value="Computer & AI">Computer &amp; AI</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Assigned Teacher Name *</label>
                      <input
                        type="text"
                        required
                        value={uploadForm.teacherName}
                        onChange={(e) => setUploadForm({ ...uploadForm, teacherName: e.target.value })}
                        placeholder="Teacher Name"
                        className="w-full p-2 border border-slate-300 rounded font-semibold text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">File Format Index *</label>
                      <select
                        value={uploadForm.fileType}
                        onChange={(e) => setUploadForm({ ...uploadForm, fileType: e.target.value as any })}
                        className="w-full p-2 border border-slate-300 rounded bg-white font-semibold text-slate-800"
                      >
                        <option value="PDF">PDF Document</option>
                        <option value="PPTX">PowerPoint Presentation</option>
                        <option value="DOCX">Microsoft Word Document</option>
                        <option value="VIDEO">Video Lecture URL/MP4</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Calculated File Size</label>
                      <input
                        type="text"
                        value={uploadForm.fileSize}
                        onChange={(e) => setUploadForm({ ...uploadForm, fileSize: e.target.value })}
                        placeholder="e.g. 12.4 MB"
                        className="w-full p-2 border border-slate-300 rounded font-semibold text-slate-800 bg-slate-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Brief Syllabus Description</label>
                    <textarea
                      rows={3}
                      value={uploadForm.description}
                      onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                      placeholder="Specify description, learning goals, or textbook matching guidelines..."
                      className="w-full p-2 border border-slate-300 rounded font-medium text-slate-800"
                    />
                  </div>

                  {isUploading && (
                    <div className="space-y-2 bg-emerald-50 border border-emerald-200 p-3.5 rounded-lg animate-pulse">
                      <div className="flex items-center justify-between font-bold text-emerald-950">
                        <span>Uploading file to cloud server library...</span>
                        <span className="font-mono">{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-emerald-600 h-1.5 transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFileName(null);
                        setUploadForm({
                          title: '',
                          className: classes[0]?.name || 'Class One',
                          subject: 'Mathematics',
                          teacherName: 'Prof. Tariq Mahmood',
                          fileType: 'PDF',
                          fileSize: '4.2 MB',
                          description: '',
                        });
                        setActiveSubTab('browse');
                      }}
                      className="px-4 py-2 border rounded font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={isUploading}
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded shadow-xs transition cursor-pointer"
                    >
                      Submit Study Resource
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* DOCUMENT VIEWER / PREVIEW MODAL */}
      {previewMaterial && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 rounded-xl overflow-hidden shadow-2xl max-w-4xl w-full border border-slate-800 flex flex-col text-xs text-slate-300 h-[85vh]">
            {/* Modal header */}
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded bg-slate-800">
                  {renderFileTypeIcon(previewMaterial.fileType, 'w-6 h-6')}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">{previewMaterial.title}</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Class: {previewMaterial.className} | Subject: {previewMaterial.subject} | Uploaded by: {previewMaterial.teacherName}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setPreviewMaterial(null)}
                className="text-slate-400 hover:text-white font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Simulated document sandbox viewer */}
            <div className="flex-1 bg-slate-800 p-6 overflow-y-auto flex items-center justify-center relative">
              <div className="bg-white rounded shadow-lg max-w-md w-full p-8 text-slate-800 text-center space-y-4">
                <BookMarked className="w-16 h-16 text-indigo-900 mx-auto" />
                <div className="space-y-2">
                  <h4 className="text-base font-black text-slate-900">THE EDUCATORS SCHOOLS</h4>
                  <p className="text-xs text-slate-400 font-mono">Academic Library &amp; LMS Portal</p>
                </div>

                <div className="border-y py-4 my-2 text-left space-y-2 text-xs font-medium text-slate-600">
                  <div>
                    <strong className="text-slate-900">Resource:</strong> {previewMaterial.title}
                  </div>
                  <div>
                    <strong className="text-slate-900">Description:</strong> {previewMaterial.description}
                  </div>
                  <div>
                    <strong className="text-slate-900">Class Scope:</strong> {previewMaterial.className} ({previewMaterial.subject})
                  </div>
                  <div>
                    <strong className="text-slate-900">File Signature:</strong> {previewMaterial.fileType} format, {previewMaterial.fileSize}
                  </div>
                </div>

                <div className="text-[10px] text-emerald-700 bg-emerald-50 rounded p-2.5 border border-emerald-200 font-bold flex items-center justify-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Secure file virus check passed. Ready for distribution.</span>
                </div>
              </div>
            </div>

            {/* Modal footer */}
            <div className="p-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-mono">
                Digitally authenticated on {previewMaterial.uploadDate}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    alert(`Simulating document print stream for ${previewMaterial.title}`);
                  }}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded"
                >
                  Print document
                </button>

                <a
                  href={previewMaterial.downloadUrl || '#'}
                  onClick={(e) => {
                    if (previewMaterial.downloadUrl === '#') {
                      e.preventDefault();
                      alert(`Simulating download for: "${previewMaterial.title}"`);
                    }
                  }}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Resource</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
