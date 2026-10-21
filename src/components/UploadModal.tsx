import React, { useState, useRef } from 'react';
import { X, Upload, FileText, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Project } from '../api.js';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (paper: any) => void;
  projects: Project[];
  uploadFunction: (formData: FormData) => Promise<any>;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onUploadSuccess,
  projects,
  uploadFunction,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [authors, setAuthors] = useState('');
  const [projectId, setProjectId] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

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
      const selected = e.dataTransfer.files[0];
      handleFileSelected(selected);
    }
  };

  const handleFileSelected = (selected: File) => {
    if (!selected.name.toLowerCase().endsWith('.pdf')) {
      setError('Please select a valid PDF document (.pdf).');
      return;
    }
    setError(null);
    setFile(selected);
    if (!title) {
      setTitle(selected.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' '));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please choose a PDF file to upload.');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title.trim());
    if (authors.trim()) formData.append('authors', authors.trim());
    if (projectId) formData.append('projectId', projectId);
    formData.append('isPublic', String(isPublic));

    try {
      const res = await uploadFunction(formData);
      onUploadSuccess(res.paper);
      onClose();
    } catch (err: any) {
      setError(err.message || 'PDF upload and processing failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#252B3A]/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-[#E8E6E0] shadow-xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#E8E6E0] flex items-center justify-between bg-[#F8F7F3]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#EFF4F0] text-[#354D43] flex items-center justify-center shadow-2xs">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#252B3A]">Upload & Ingest Academic PDF</h3>
              <p className="text-xs text-[#737B89]">Auto-extracts text streams, methodology & limitations</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-1.5 rounded-lg text-[#737B89] hover:text-[#252B3A] hover:bg-[#E8E6E0] transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Drag & Drop Zone */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-colors ${
              dragActive 
                ? 'border-[#8FA998] bg-[#EFF4F0]' 
                : file 
                  ? 'border-[#8FA998] bg-[#EFF4F0]/60' 
                  : 'border-[#E8E6E0] hover:border-[#8FA998] bg-[#F8F7F3]/60'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileSelected(e.target.files[0]);
                }
              }}
            />

            {file ? (
              <div className="space-y-1.5">
                <FileText className="w-8 h-8 text-[#354D43] mx-auto" />
                <p className="text-xs font-bold text-[#252B3A]">{file.name}</p>
                <p className="text-[10px] text-[#737B89]">{(file.size / (1024 * 1024)).toFixed(2)} MB • Ready for Ingestion</p>
                <p className="text-[10px] text-[#354D43] font-semibold hover:underline">Click or drop to replace</p>
              </div>
            ) : (
              <div className="space-y-1.5">
                <Upload className="w-8 h-8 text-[#737B89] mx-auto opacity-70" />
                <p className="text-xs font-semibold text-[#252B3A]">Drop PDF paper here, or click to browse</p>
                <p className="text-[10px] text-[#737B89]">PDF documents up to 30MB supported with %PDF- header check</p>
              </div>
            )}
          </div>

          {/* Metadata overrides */}
          <div className="space-y-3 text-xs">
            <div>
              <label className="font-semibold text-[#252B3A] block mb-1">Paper Title (Optional override)</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Defaults to detected paper title"
                className="w-full bg-[#F8F7F3] border border-[#E8E6E0] rounded-xl px-3.5 py-2.5 text-xs text-[#252B3A] placeholder-[#737B89] focus:bg-white focus:outline-hidden focus:border-[#8FA998] focus:ring-2 focus:ring-[#8FA998]/15 transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-[#252B3A] block mb-1">Authors (comma separated)</label>
                <input
                  type="text"
                  value={authors}
                  onChange={(e) => setAuthors(e.target.value)}
                  placeholder="e.g. Dr. Jane Doe, Marcus Vance"
                  className="w-full bg-[#F8F7F3] border border-[#E8E6E0] rounded-xl px-3.5 py-2.5 text-xs text-[#252B3A] placeholder-[#737B89] focus:bg-white focus:outline-hidden focus:border-[#8FA998] focus:ring-2 focus:ring-[#8FA998]/15 transition-all"
                />
              </div>

              <div>
                <label className="font-semibold text-[#252B3A] block mb-1">Assign to Workspace</label>
                <select
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className="w-full bg-[#F8F7F3] border border-[#E8E6E0] rounded-xl px-3.5 py-2.5 text-xs text-[#252B3A] focus:bg-white focus:outline-hidden focus:border-[#8FA998] focus:ring-2 focus:ring-[#8FA998]/15 transition-all"
                >
                  <option value="">None (Unassigned)</option>
                  {projects.map((proj) => (
                    <option key={proj.id} value={proj.id}>
                      {proj.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-1 flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer text-[#252B3A]">
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="rounded border-[#E8E6E0] text-[#354D43] focus:ring-[#8FA998] w-4 h-4 cursor-pointer"
                />
                <span className="text-[11px] font-medium text-[#737B89]">Make publicly readable across all workspace users</span>
              </label>
            </div>
          </div>

          {/* Submit CTA */}
          <div className="pt-3 flex items-center justify-end gap-2 border-t border-[#E8E6E0]">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-3.5 py-2 text-xs font-semibold text-[#737B89] hover:text-[#252B3A] transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!file || loading}
              className="px-4 py-2 bg-[#354D43] hover:bg-[#2A3E36] disabled:opacity-40 text-white text-xs font-semibold rounded-xl shadow-xs flex items-center gap-2 transition cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Parsing & Synthesizing...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Upload & Index</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
