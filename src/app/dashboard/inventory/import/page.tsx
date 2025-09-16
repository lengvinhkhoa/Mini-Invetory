'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Download, FileSpreadsheet, Brain, CheckCircle2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface ImportedItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  quantity: number;
  warehouse: string;
  status: 'success' | 'warning' | 'error';
  message?: string;
}

export default function ImportPage() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [progress, setProgress] = useState(0);
  const [importResults, setImportResults] = useState<ImportedItem[]>([]);
  const [useAI, setUseAI] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const validTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'text/csv'
      ];
      
      if (validTypes.includes(file.type)) {
        setUploadedFile(file);
      } else {
        alert('Vui lòng chọn file Excel (.xlsx) hoặc CSV (.csv)');
      }
    }
  };

  const downloadTemplate = (type: 'excel' | 'csv') => {
    // Tạo template data mẫu
    const templateData = [
      ['Tên sản phẩm', 'SKU', 'Danh mục', 'Giá bán', 'Số lượng', 'Kho', 'Mô tả'],
      ['iPhone 15 Pro', 'IP15P-256', 'Điện thoại', '29990000', '10', 'KHO-HN', 'iPhone 15 Pro 256GB'],
      ['Samsung Galaxy S24', 'SGS24-128', 'Điện thoại', '22990000', '15', 'KHO-HCM', 'Samsung Galaxy S24 128GB'],
      ['MacBook Air M3', 'MBA-M3-512', 'Laptop', '35990000', '5', 'KHO-HN', 'MacBook Air M3 512GB']
    ];

    if (type === 'csv') {
      const csvContent = templateData.map(row => row.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'template_hang_hoa.csv';
      link.click();
    } else {
      // Sẽ implement Excel template download
      alert('Tính năng tải template Excel sẽ được hoàn thiện sớm');
    }
  };

  const processImport = async () => {
    if (!uploadedFile) return;

    setIsProcessing(true);
    setProgress(0);
    setProcessingStep('Đang đọc file...');

    try {
      // Simulate processing steps
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProgress(25);
      setProcessingStep('Đang phân tích dữ liệu...');

      await new Promise(resolve => setTimeout(resolve, 1000));
      setProgress(50);
      
      if (useAI) {
        setProcessingStep('Đang sử dụng AI để chuẩn hóa dữ liệu...');
        await new Promise(resolve => setTimeout(resolve, 2000));
        setProgress(75);
      }

      setProcessingStep('Đang lưu vào cơ sở dữ liệu...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProgress(100);

      // Mock import results
      const mockResults: ImportedItem[] = [
        {
          id: '1',
          name: 'iPhone 15 Pro',
          sku: 'IP15P-256',
          category: 'Điện thoại',
          price: 29990000,
          quantity: 10,
          warehouse: 'KHO-HN',
          status: 'success'
        },
        {
          id: '2',
          name: 'Samsung Galaxy S24',
          sku: 'SGS24-128',
          category: 'Điện thoại',
          price: 22990000,
          quantity: 15,
          warehouse: 'KHO-HCM',
          status: 'warning',
          message: 'SKU đã tồn tại, đã cập nhật số lượng'
        }
      ];

      setImportResults(mockResults);
      setProcessingStep('Hoàn thành!');
      
    } catch (error) {
      console.error('Import error:', error);
      alert('Có lỗi xảy ra trong quá trình import');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Nhập hàng hóa</h1>
        <p className="text-muted-foreground">
          Import hàng hóa từ file Excel hoặc CSV vào hệ thống
        </p>
      </div>

      {/* Template Download Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Tải template mẫu
          </CardTitle>
          <CardDescription>
            Tải về file mẫu để chuẩn bị dữ liệu hàng hóa của bạn
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Button
            variant="outline"
            onClick={() => downloadTemplate('excel')}
            className="flex items-center gap-2"
          >
            <FileSpreadsheet className="h-4 w-4" />
            Template Excel (.xlsx)
          </Button>
          <Button
            variant="outline"
            onClick={() => downloadTemplate('csv')}
            className="flex items-center gap-2"
          >
            <FileSpreadsheet className="h-4 w-4" />
            Template CSV (.csv)
          </Button>
        </CardContent>
      </Card>

      {/* File Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload file hàng hóa
          </CardTitle>
          <CardDescription>
            Chọn file Excel (.xlsx) hoặc CSV (.csv) chứa dữ liệu hàng hóa
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">
                Kéo thả file vào đây hoặc click để chọn file
              </p>
              <p className="text-xs text-muted-foreground">
                Hỗ trợ: .xlsx, .xls, .csv (tối đa 10MB)
              </p>
            </label>
          </div>

          {uploadedFile && (
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                Đã chọn file: <strong>{uploadedFile.name}</strong> ({(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)
              </AlertDescription>
            </Alert>
          )}

          {/* AI Processing Option */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="use-ai"
              checked={useAI}
              onChange={(e) => setUseAI(e.target.checked)}
              className="rounded"
            />
            <label htmlFor="use-ai" className="text-sm font-medium">
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                Sử dụng AI để tự động chuẩn hóa dữ liệu (OpenRouter GPT)
              </div>
              <p className="text-xs text-muted-foreground">
                AI sẽ giúp chuyển đổi file không đúng format thành format chuẩn của hệ thống
              </p>
            </label>
          </div>

          <Button
            onClick={processImport}
            disabled={!uploadedFile || isProcessing}
            className="w-full"
          >
            {isProcessing ? 'Đang xử lý...' : 'Bắt đầu Import'}
          </Button>
        </CardContent>
      </Card>

      {/* Processing Progress */}
      {isProcessing && (
        <Card>
          <CardHeader>
            <CardTitle>Đang xử lý</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{processingStep}</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Import Results */}
      {importResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Kết quả Import</CardTitle>
            <CardDescription>
              Đã import thành công {importResults.filter(r => r.status === 'success').length} sản phẩm
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {importResults.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{item.name}</h4>
                      <Badge variant={
                        item.status === 'success' ? 'default' :
                        item.status === 'warning' ? 'secondary' : 'destructive'
                      }>
                        {item.status === 'success' ? 'Thành công' :
                         item.status === 'warning' ? 'Cảnh báo' : 'Lỗi'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      SKU: {item.sku} | Danh mục: {item.category} | Số lượng: {item.quantity}
                    </p>
                    {item.message && (
                      <p className="text-xs text-muted-foreground mt-1">{item.message}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{item.price.toLocaleString('vi-VN')} đ</p>
                    <p className="text-sm text-muted-foreground">{item.warehouse}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}