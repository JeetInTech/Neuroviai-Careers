import React, { useState, useRef } from 'react';
import { Upload, FileText, Loader2, AlertCircle, CheckCircle, X } from 'lucide-react';
import api from '../lib/api';

interface ParsedCVData {
  personal_info: {
    full_name?: string;
    email?: string;
    phone?: string;
    address?: string;
    linkedin_url?: string;
    github_url?: string;
    portfolio_url?: string;
    summary?: string;
  };
  experience: Array<{
    title?: string;
    company?: string;
    location?: string;
    start_date?: string;
    end_date?: string;
    current?: boolean;
    description?: string;
    achievements?: string[];
  }>;
  education: Array<{
    degree?: string;
    field_of_study?: string;
    institution?: string;
    location?: string;
    start_date?: string;
    end_date?: string;
    gpa?: string;
    description?: string;
  }>;
  skills: Array<{
    name?: string;
    level?: number;
    category?: string;
  }>;
  projects: Array<{
    name?: string;
    description?: string;
    technologies?: string[];
    url?: string;
    github_url?: string;
    highlights?: string[];
  }>;
  certifications: Array<Record<string, unknown>>;
  languages: Array<Record<string, unknown>>;
  raw_text?: string;
}

interface DocumentUploadProps {
  onDataExtracted: (data: ParsedCVData) => void;
  onClose?: () => void;
}

export default function DocumentUpload({ onDataExtracted, onClose }: DocumentUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFile = async (file: File) => {
    setError(null);
    setSuccess(false);
    setFileName(file.name);

    // Validate file type
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    const validExtensions = ['.pdf', '.doc', '.docx'];
    const hasValidExtension = validExtensions.some(ext => 
      file.name.toLowerCase().endsWith(ext)
    );

    if (!validTypes.includes(file.type) && !hasValidExtension) {
      setError('Please upload a PDF, DOC, or DOCX file');
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size exceeds 10MB limit');
      return;
    }

    try {
      setIsUploading(true);
      const result = await api.parseDocument(file);
      
      if (result.success && result.data) {
        setSuccess(true);
        onDataExtracted(result.data);
        
        // Auto-close after success
        setTimeout(() => {
          if (onClose) onClose();
        }, 1500);
      } else {
        throw new Error('Failed to parse document');
      }
    } catch (err) {
      console.error('Error parsing document:', err);
      setError(err instanceof Error ? err.message : 'Failed to parse document');
    } finally {
      setIsUploading(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 relative">
        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        )}

        {/* Header */}
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
            <FileText className="h-8 w-8 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Upload Your CV</h2>
          <p className="text-gray-600 mt-2">
            Upload your existing resume and we'll extract the data automatically
          </p>
        </div>

        {/* Drop Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
          className={`
            border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
            transition-all duration-200
            ${isDragging 
              ? 'border-indigo-500 bg-indigo-50' 
              : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
            }
            ${isUploading ? 'pointer-events-none opacity-60' : ''}
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={handleFileSelect}
            className="hidden"
          />

          {isUploading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="h-12 w-12 text-indigo-600 animate-spin mb-4" />
              <p className="text-gray-600">Parsing {fileName}...</p>
              <p className="text-sm text-gray-400 mt-2">
                Extracting data from your document
              </p>
            </div>
          ) : success ? (
            <div className="flex flex-col items-center">
              <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
              <p className="text-green-600 font-medium">Successfully extracted!</p>
              <p className="text-sm text-gray-500 mt-2">
                Your CV data has been loaded
              </p>
            </div>
          ) : (
            <>
              <Upload className={`h-12 w-12 mx-auto mb-4 ${isDragging ? 'text-indigo-600' : 'text-gray-400'}`} />
              <p className="text-gray-700 font-medium mb-2">
                {isDragging ? 'Drop your file here' : 'Drag & drop your CV here'}
              </p>
              <p className="text-gray-500 text-sm mb-4">
                or click to browse
              </p>
              <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                <span className="px-2 py-1 bg-gray-100 rounded">PDF</span>
                <span className="px-2 py-1 bg-gray-100 rounded">DOC</span>
                <span className="px-2 py-1 bg-gray-100 rounded">DOCX</span>
              </div>
            </>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-700 font-medium">Upload failed</p>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Tips for best results:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Use a text-based PDF, not a scanned image</li>
            <li>• Make sure your CV has clear section headers</li>
            <li>• Maximum file size: 10MB</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
