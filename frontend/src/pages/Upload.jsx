import React, { useState, useRef, useEffect } from 'react';
import { Upload as UploadIcon, X, FileImage, AlertCircle, CheckCircle, Brain, Tag, FileText, Image as ImageIcon } from 'lucide-react';
import api from '../services/api';

export default function Upload() {
  const fileInputRef = useRef(null);

  // File States
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  // UI / Network States
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState('idle'); // 'idle' | 'uploading' | 'processing' | 'success' | 'error'
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [aiMetadata, setAiMetadata] = useState(null);

  // Clean up preview URL memory when component unmounts or file changes
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Handle Drag Events
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (status === 'uploading' || status === 'processing') return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  // Handle Input File Select
  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  // Validate and Create Preview
  const processFile = (file) => {
    setErrorMsg('');
    setAiMetadata(null);
    setStatus('idle');

    // 1. File Type Check
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      setErrorMsg('Unsupported file type. Please select a JPEG, PNG, or WEBP image.');
      return;
    }

    // 2. File Size Check (10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setErrorMsg('Image file size exceeds the 10MB limit.');
      return;
    }

    setSelectedFile(file);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const clearSelection = () => {
    setSelectedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl('');
    setUploadProgress(0);
    setStatus('idle');
    setErrorMsg('');
    setAiMetadata(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Trigger Upload request
  const handleUpload = async () => {
    if (!selectedFile) return;

    setStatus('uploading');
    setUploadProgress(0);
    setErrorMsg('');

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      // 1. Upload File (capturing progress)
      const response = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
          if (percentCompleted === 100) {
            // Once files are uploaded, pipeline processing is happening
            setStatus('processing');
          }
        },
      });

      // 2. Complete Processing
      setAiMetadata(response.data.image);
      setStatus('success');
    } catch (error) {
      setStatus('error');
      setErrorMsg(
        error.response?.data?.detail || 
        'An error occurred during file upload or AI processing.'
      );
    }
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="relative min-h-[75vh] py-4">
      {/* Background Decorative Blur */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl animate-pulse-slow pointer-events-none"></div>

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white to-dark-300 bg-clip-text text-transparent">
            Upload & Analyze Image
          </h1>
          <p className="text-dark-400 mt-2 max-w-xl mx-auto">
            Drag and drop an image. Our automated AI Pipeline will compress, classify, tag, and index your image for semantic searching.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Left Column: Selector & Drag zone */}
          <div className="space-y-6">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative cursor-pointer min-h-[300px] flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-2xl transition-all duration-300 ${
                isDragging 
                  ? 'border-brand-500 bg-brand-500/5 scale-[1.01]' 
                  : 'border-dark-800 hover:border-dark-700 bg-dark-900/30'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileSelect}
                disabled={status === 'uploading' || status === 'processing'}
              />

              {previewUrl ? (
                <div className="relative w-full h-[250px] rounded-xl overflow-hidden group" onClick={(e) => e.stopPropagation()}>
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-xl"
                  />
                  <div className="absolute inset-0 bg-dark-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={clearSelection}
                      className="p-2.5 bg-red-600/90 hover:bg-red-500 text-white rounded-full transition-transform active:scale-95"
                      title="Clear Selection"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="inline-flex p-4 rounded-full bg-dark-900/80 border border-dark-800 text-dark-400 mb-4 animate-bounce-slow">
                    <UploadIcon className="w-8 h-8 text-brand-450" />
                  </div>
                  <p className="text-sm font-semibold mb-1.5">Drag & drop your image here</p>
                  <p className="text-xs text-dark-500 mb-4">or click to browse local files</p>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded bg-dark-800 text-dark-400">
                    JPG, PNG, WEBP (Max 10MB)
                  </span>
                </div>
              )}
            </div>

            {/* Selection info details */}
            {selectedFile && (
              <div className="flex items-center justify-between p-4 rounded-xl bg-dark-900 border border-dark-800">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2.5 rounded-lg bg-brand-500/10 border border-brand-500/20 text-brand-400 shrink-0">
                    <FileImage className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{selectedFile.name}</p>
                    <p className="text-xs text-dark-550">{formatBytes(selectedFile.size)}</p>
                  </div>
                </div>
                {status !== 'uploading' && status !== 'processing' && (
                  <button onClick={clearSelection} className="text-dark-500 hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            )}

            {/* Error notifications */}
            {errorMsg && (
              <div className="flex items-start gap-2.5 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200 text-sm">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Submit / Upload Actions */}
            {selectedFile && status !== 'success' && (
              <button
                onClick={handleUpload}
                disabled={status === 'uploading' || status === 'processing'}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-medium text-sm transition-all focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-brand-500/20 active:scale-[0.98]"
              >
                <Brain className="w-4 h-4 animate-pulse" />
                <span>Upload & Run AI Pipeline</span>
              </button>
            )}
          </div>

          {/* Right Column: Upload Progress & AI Result Metadata Panels */}
          <div className="space-y-6">
            {/* 1. Progress State Dashboard */}
            {(status === 'uploading' || status === 'processing') && (
              <div className="p-6 rounded-2xl glass-panel border-dark-800 shadow-xl space-y-6">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Brain className="w-5 h-5 text-brand-400 animate-spin" />
                  Pipeline Processing
                </h3>

                {/* Progress bar info */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-dark-300">
                    <span>
                      {status === 'uploading' 
                        ? `Uploading File (${uploadProgress}%)` 
                        : 'Analyzing Image...'}
                    </span>
                    <span>{status === 'uploading' ? 'Phase 1/2' : 'Phase 2/2'}</span>
                  </div>
                  <div className="h-2 w-full bg-dark-900 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        status === 'uploading' ? 'bg-brand-500' : 'bg-indigo-500 animate-pulse'
                      }`}
                      style={{ width: `${status === 'uploading' ? uploadProgress : 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Pipeline Checklist */}
                <div className="space-y-3.5 text-xs text-dark-400">
                  <div className="flex items-center gap-2.5">
                    <div className="h-2 w-2 rounded-full bg-brand-500 animate-ping"></div>
                    <span className={status === 'uploading' ? 'font-semibold text-white' : 'text-dark-500'}>
                      Lossless image compression & thumbnail generation
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className={`h-2 w-2 rounded-full ${status === 'processing' ? 'bg-indigo-500 animate-ping' : 'bg-dark-800'}`}></div>
                    <span className={status === 'processing' ? 'font-semibold text-white' : 'text-dark-500'}>
                      AI caption generation & automatic filename extraction
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className={`h-2 w-2 rounded-full ${status === 'processing' ? 'bg-indigo-500 animate-ping' : 'bg-dark-800'}`}></div>
                    <span className={status === 'processing' ? 'font-semibold text-white' : 'text-dark-500'}>
                      Category classification, tag generations & vector indexing
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* 2. Success Metadata Dashboard */}
            {status === 'success' && aiMetadata && (
              <div className="p-6 rounded-2xl glass-panel border-emerald-500/20 shadow-xl space-y-6 animate-fade-in">
                <div className="flex items-center gap-2.5 text-emerald-400">
                  <CheckCircle className="w-6 h-6 shrink-0" />
                  <div>
                    <h3 className="text-lg font-bold">Successfully Processed!</h3>
                    <p className="text-xs text-dark-450">Image indexed into semantic search database</p>
                  </div>
                </div>

                <hr className="border-dark-800/80" />

                {/* AI Details */}
                <div className="space-y-4 text-sm">
                  {/* Generated Caption */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs text-dark-400 font-semibold uppercase tracking-wider">
                      <FileText className="w-3.5 h-3.5 text-brand-400" />
                      AI Generated Caption
                    </div>
                    <p className="p-3 bg-dark-900/60 rounded-xl border border-dark-800 italic text-white leading-relaxed">
                      "{aiMetadata.caption || 'No caption generated'}"
                    </p>
                  </div>

                  {/* Auto details */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="block text-xs text-dark-400 font-semibold uppercase tracking-wider mb-1">
                        Category
                      </span>
                      <span className="inline-block px-3 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-350 text-xs font-semibold">
                        {aiMetadata.category || 'Unclassified'}
                      </span>
                    </div>
                    <div>
                      <span className="block text-xs text-dark-400 font-semibold uppercase tracking-wider mb-1">
                        File Dimensions
                      </span>
                      <span className="text-xs font-medium text-dark-200">
                        {aiMetadata.width} x {aiMetadata.height} px
                      </span>
                    </div>
                  </div>

                  {/* Filename generated */}
                  <div className="space-y-1">
                    <span className="block text-xs text-dark-400 font-semibold uppercase tracking-wider">
                      AI Generated Filename
                    </span>
                    <p className="text-xs font-mono bg-dark-900 p-2.5 rounded-lg border border-dark-850 truncate text-dark-300">
                      {aiMetadata.generated_filename}
                    </p>
                  </div>

                  {/* Tags generated */}
                  <div className="space-y-2">
                    <span className="flex items-center gap-1 text-xs text-dark-400 font-semibold uppercase tracking-wider">
                      <Tag className="w-3.5 h-3.5 text-brand-400" />
                      AI Tags
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {aiMetadata.tags && aiMetadata.tags.length > 0 ? (
                        aiMetadata.tags.map((t, idx) => (
                          <span key={idx} className="px-2.5 py-1 rounded bg-dark-800 border border-dark-750 text-dark-200 text-xs font-medium">
                            {t}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-dark-500 italic">No tags assigned</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Upload Another Button */}
                <button
                  onClick={clearSelection}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-dark-800 hover:bg-dark-700 text-white font-medium text-xs border border-dark-700 hover:border-dark-600 transition-colors"
                >
                  <ImageIcon className="w-4 h-4" />
                  <span>Upload Another Image</span>
                </button>
              </div>
            )}

            {/* 3. Empty State Guidance */}
            {status === 'idle' && !selectedFile && (
              <div className="p-6 rounded-2xl border border-dark-850 bg-dark-900/10 text-center space-y-4">
                <Brain className="w-10 h-10 text-dark-750 mx-auto" />
                <div>
                  <h4 className="text-sm font-semibold">Ready for Upload</h4>
                  <p className="text-xs text-dark-500 max-w-xs mx-auto mt-1 leading-relaxed">
                    Select an image on the left to review its specifications before initiating the AI extraction pipeline.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
