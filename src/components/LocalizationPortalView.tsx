import React, { useState } from 'react';
import {
  Globe,
  CheckCircle,
  Languages,
  Printer,
  Sparkles,
  UserCheck,
  BookOpen,
  GraduationCap,
  ShieldCheck,
  FileText,
  Edit3,
  RotateCcw,
} from 'lucide-react';
import {
  SUPPORTED_LANGUAGES,
  SupportedLanguage,
  TRANSLATIONS,
} from '../data/localizationData';

interface LocalizationPortalViewProps {
  onPrintLocalizationDossier?: (data: {
    language: SupportedLanguage;
    customDict: Record<string, string>;
  }) => void;
}

export default function LocalizationPortalView({
  onPrintLocalizationDossier,
}: LocalizationPortalViewProps) {
  const [selectedLang, setSelectedLang] = useState<SupportedLanguage>('en');
  const [translations, setTranslations] = useState(TRANSLATIONS);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState('');

  const currentLangInfo = SUPPORTED_LANGUAGES.find((l) => l.code === selectedLang)!;
  const currentDict = translations[selectedLang];

  const handleEditKey = (key: string) => {
    setEditingKey(key);
    setTempValue(currentDict[key] || '');
  };

  const handleSaveKey = () => {
    if (!editingKey) return;
    setTranslations({
      ...translations,
      [selectedLang]: {
        ...translations[selectedLang],
        [editingKey]: tempValue,
      },
    });
    setEditingKey(null);
  };

  const handleResetDefaults = () => {
    setTranslations(TRANSLATIONS);
  };

  return (
    <div id="localization-portal-view" className="space-y-4 text-xs">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-[#002147] to-teal-950 rounded-xl p-5 text-white shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-teal-500/20 rounded-lg text-teal-300 border border-teal-500/30">
              <Globe className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold tracking-tight">
              Multi-Language Parent &amp; Teacher Portal Localization Hub
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-400 text-slate-950">
              Phase 17
            </span>
          </div>
          <p className="text-slate-200 text-xs max-w-2xl">
            Native English, Amharic (አማርኛ) and Afan Oromo (Afaan Oromoo) tri-lingual portal localization with script typography &amp; broadcast slips.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (onPrintLocalizationDossier) {
              onPrintLocalizationDossier({
                language: selectedLang,
                customDict: currentDict,
              });
            } else {
              alert(`Printing Localized Communication Dossier in ${currentLangInfo.name}`);
            }
          }}
          className="px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
        >
          <Printer className="w-4 h-4" />
          <span>{currentDict.btn_print_dossier}</span>
        </button>
      </div>

      {/* Language Selector Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {SUPPORTED_LANGUAGES.map((lang) => {
          const isSelected = selectedLang === lang.code;
          return (
            <div
              key={lang.code}
              onClick={() => setSelectedLang(lang.code)}
              className={`p-4 rounded-xl border-2 cursor-pointer transition flex justify-between items-center ${
                isSelected
                  ? 'border-teal-600 bg-teal-50/50 shadow-sm'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{lang.flagSymbol}</span>
                  <span className="font-bold text-slate-900 text-sm">{lang.name}</span>
                </div>
                <div className="font-semibold text-teal-900 text-xs">{lang.nativeName}</div>
                <div className="text-[10px] text-slate-500">{lang.scriptName} • {lang.dir.toUpperCase()}</div>
              </div>

              {isSelected && (
                <CheckCircle className="w-5 h-5 text-teal-600" />
              )}
            </div>
          );
        })}
      </div>

      {/* Live Tri-Lingual Portal Preview Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Parent Portal Preview Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 shadow-xs">
          <div className="flex justify-between items-center border-b pb-2">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
              <UserCheck className="w-4 h-4 text-blue-600" />
              <span>{currentDict.nav_parent_portal}</span>
            </div>
            <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] rounded font-bold">
              Parent View
            </span>
          </div>

          <div className="space-y-2">
            <div className="p-2.5 bg-slate-50 rounded border flex justify-between items-center">
              <span className="font-medium text-slate-700">{currentDict.parent_child_attendance}</span>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">
                96% Present
              </span>
            </div>

            <div className="p-2.5 bg-slate-50 rounded border flex justify-between items-center">
              <span className="font-medium text-slate-700">{currentDict.parent_fee_status}</span>
              <span className="px-2 py-0.5 bg-blue-100 text-blue-900 rounded font-bold text-[10px]">
                Paid (Rs. 24,500)
              </span>
            </div>

            <div className="p-2.5 bg-slate-50 rounded border flex justify-between items-center">
              <span className="font-medium text-slate-700">{currentDict.parent_academic_report}</span>
              <span className="px-2 py-0.5 bg-purple-100 text-purple-900 rounded font-bold text-[10px]">
                Grade A+ (GPA 3.92)
              </span>
            </div>

            <div className="p-2.5 bg-slate-50 rounded border flex justify-between items-center">
              <span className="font-medium text-slate-700">{currentDict.parent_daily_diary}</span>
              <span className="px-2 py-0.5 bg-amber-100 text-amber-900 rounded font-bold text-[10px]">
                3 Assigned Tasks
              </span>
            </div>
          </div>
        </div>

        {/* Teacher Academic Console Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 shadow-xs">
          <div className="flex justify-between items-center border-b pb-2">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span>{currentDict.nav_teacher_portal}</span>
            </div>
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] rounded font-bold">
              Teacher View
            </span>
          </div>

          <div className="space-y-2">
            <div className="p-2.5 bg-slate-50 rounded border flex justify-between items-center">
              <span className="font-medium text-slate-700">{currentDict.teacher_mark_attendance}</span>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">
                Class 10-A Done
              </span>
            </div>

            <div className="p-2.5 bg-slate-50 rounded border flex justify-between items-center">
              <span className="font-medium text-slate-700">{currentDict.teacher_upload_marks}</span>
              <span className="px-2 py-0.5 bg-purple-100 text-purple-900 rounded font-bold text-[10px]">
                Mid-Term Physics
              </span>
            </div>

            <div className="p-2.5 bg-slate-50 rounded border flex justify-between items-center">
              <span className="font-medium text-slate-700">{currentDict.teacher_substitute_log}</span>
              <span className="px-2 py-0.5 bg-teal-100 text-teal-900 rounded font-bold text-[10px]">
                Period 4 Chemistry
              </span>
            </div>
          </div>
        </div>

        {/* Student E-Learning Portal Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 shadow-xs">
          <div className="flex justify-between items-center border-b pb-2">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
              <GraduationCap className="w-4 h-4 text-purple-600" />
              <span>{currentDict.nav_student_portal}</span>
            </div>
            <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-[10px] rounded font-bold">
              Student View
            </span>
          </div>

          <div className="space-y-2">
            <div className="p-2.5 bg-slate-50 rounded border flex justify-between items-center">
              <span className="font-medium text-slate-700">{currentDict.student_my_courses}</span>
              <span className="px-2 py-0.5 bg-purple-100 text-purple-900 rounded font-bold text-[10px]">
                6 Enrolled Subjects
              </span>
            </div>

            <div className="p-2.5 bg-slate-50 rounded border flex justify-between items-center">
              <span className="font-medium text-slate-700">{currentDict.student_assignments}</span>
              <span className="px-2 py-0.5 bg-amber-100 text-amber-900 rounded font-bold text-[10px]">
                2 Due Tomorrow
              </span>
            </div>

            <div className="p-2.5 bg-slate-50 rounded border flex justify-between items-center">
              <span className="font-medium text-slate-700">{currentDict.student_library_books}</span>
              <span className="px-2 py-0.5 bg-slate-200 text-slate-800 rounded font-bold text-[10px]">
                1 Book Checked Out
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Translation Dictionary Editor */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-xs">
        <div className="flex justify-between items-center border-b pb-3">
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <Languages className="w-4 h-4 text-teal-600" />
              <span>Translation Dictionary Editor: {currentLangInfo.name} ({currentLangInfo.nativeName})</span>
            </h3>
            <p className="text-slate-500 text-[11px]">
              Customize strings live for {currentLangInfo.name} language interface rendering.
            </p>
          </div>

          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-3 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded font-semibold text-xs flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Object.entries(currentDict).map(([key, val]) => (
            <div key={key} className="p-3 bg-slate-50 rounded-lg border flex justify-between items-center gap-2">
              <div className="space-y-0.5 overflow-hidden">
                <div className="font-mono text-[10px] text-slate-400 font-semibold">{key}</div>
                <div className="font-bold text-slate-900 text-xs truncate">{val}</div>
              </div>

              <button
                type="button"
                onClick={() => handleEditKey(key)}
                className="p-1.5 bg-white hover:bg-teal-50 text-slate-600 hover:text-teal-700 rounded border transition"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Key Modal / Form */}
      {editingKey && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xl max-w-md w-full space-y-3">
            <h4 className="font-bold text-slate-900 text-sm">Edit Translation String</h4>
            <div className="text-[11px] font-mono text-teal-900 bg-teal-50 p-2 rounded border">{editingKey}</div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                String for {currentLangInfo.name} ({currentLangInfo.nativeName}):
              </label>
              <textarea
                rows={3}
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                className="w-full p-2 border rounded text-xs font-medium"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button
                type="button"
                onClick={() => setEditingKey(null)}
                className="px-4 py-1.5 border rounded font-semibold text-slate-600"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveKey}
                className="px-5 py-1.5 bg-teal-600 text-white rounded font-bold hover:bg-teal-700"
              >
                Save String
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
