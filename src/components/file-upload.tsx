'use client';

import { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileSpreadsheet, X, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
  selectedFile: File | null;
  isProcessing?: boolean;
  uploadProgress?: number;
}

interface FileValidation {
  isValid: boolean;
  message: string;
  type: 'success' | 'warning' | 'error';
}

export default function FileUpload({ 
  onFileSelect, 
  onFileRemove, 
  selectedFile, 
  isProcessing = false,
  uploadProgress = 0 
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [validation, setValidation] = useState<FileValidation | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'application/vnd.ms-excel', // .xls
    'text/csv' // .csv
  ];

  const maxFileSize = 10 * 1024 * 1024; // 10MB

  const validateFile = (file: File): FileValidation => {
    if (!validTypes.includes(file.type)) {
      return {
        isValid: false,
        message: 'Định dạng file không được hỗ trợ. Vui lòng chọn file Excel (.xlsx, .xls) hoặc CSV (.csv)',
        type: 'error'
      };
    }

    if (file.size > maxFileSize) {
      return {
        isValid: false,
        message: `File quá lớn. Kích thước tối đa là ${maxFileSize / 1024 / 1024}MB`,
        type: 'error'
      };
    }

    if (file.size === 0) {
      return {
        isValid: false,
        message: 'File trống. Vui lòng chọn file có dữ liệu',
        type: 'error'
      };
    }

    // Warning for very large files
    if (file.size > 5 * 1024 * 1024) {
      return {
        isValid: true,
        message: 'File khá lớn, quá trình xử lý có thể mất thời gian',
        type: 'warning'
      };
    }

    return {
      isValid: true,
      message: 'File hợp lệ và sẵn sàng để import',
      type: 'success'
    };
  };

  const handleFileSelect = (file: File) => {
    const validationResult = validateFile(file);
    setValidation(validationResult);

    if (validationResult.isValid) {
      onFileSelect(file);
    }
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
    
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    return <FileSpreadsheet className="h-8 w-8 text-green-600" />;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const removeFile = () => {
    setValidation(null);
    onFileRemove();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        {!selectedFile ? (
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragOver 
                ? 'border-primary bg-primary/5' 
                : 'border-muted-foreground/25 hover:border-muted-foreground/50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileInputChange}
              className="hidden"
              id="file-upload"
              disabled={isProcessing}
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <Upload className={`mx-auto h-12 w-12 ${isDragOver ? 'text-primary' : 'text-muted-foreground'}`} />
              <p className="mt-4 text-lg font-medium">
                {isDragOver ? 'Thả file vào đây' : 'Kéo thả file vào đây hoặc click để chọn'}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Hỗ trợ: Excel (.xlsx, .xls) và CSV (.csv)
              </p>
              <p className="text-xs text-muted-foreground">
                Kích thước tối đa: 10MB
              </p>
            </label>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 border rounded-lg bg-muted/20">
              {getFileIcon(selectedFile.name)}
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{selectedFile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {formatFileSize(selectedFile.size)} • {selectedFile.type.split('/').pop()?.toUpperCase()}
                </p>
              </div>
              {!isProcessing && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={removeFile}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {isProcessing && uploadProgress > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Đang xử lý file...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="w-full" />
              </div>
            )}

            {validation && (
              <Alert className={`${
                validation.type === 'error' ? 'border-destructive bg-destructive/10' :
                validation.type === 'warning' ? 'border-yellow-500 bg-yellow-50' :
                'border-green-500 bg-green-50'
              }`}>
                {validation.type === 'error' ? (
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                ) : validation.type === 'warning' ? (
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                ) : (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                )}
                <AlertDescription className={`${
                  validation.type === 'error' ? 'text-destructive' :
                  validation.type === 'warning' ? 'text-yellow-800' :
                  'text-green-800'
                }`}>
                  {validation.message}
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}