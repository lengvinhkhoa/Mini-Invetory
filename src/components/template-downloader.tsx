'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileSpreadsheet, FileText, Eye, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TemplateField {
  name: string;
  required: boolean;
  type: string;
  description: string;
  example: string;
}

const templateFields: TemplateField[] = [
  {
    name: 'Tên sản phẩm',
    required: true,
    type: 'Text',
    description: 'Tên đầy đủ của sản phẩm',
    example: 'iPhone 15 Pro Max'
  },
  {
    name: 'SKU',
    required: true,
    type: 'Text',
    description: 'Mã SKU duy nhất cho sản phẩm',
    example: 'IP15PM-512-BLUE'
  },
  {
    name: 'Danh mục',
    required: true,
    type: 'Text',
    description: 'Danh mục sản phẩm',
    example: 'Điện thoại'
  },
  {
    name: 'Giá bán',
    required: true,
    type: 'Number',
    description: 'Giá bán của sản phẩm (VNĐ)',
    example: '29990000'
  },
  {
    name: 'Số lượng',
    required: true,
    type: 'Number',
    description: 'Số lượng tồn kho hiện tại',
    example: '100'
  },
  {
    name: 'Kho',
    required: true,
    type: 'Text',
    description: 'Mã kho lưu trữ sản phẩm',
    example: 'KHO-HN-01'
  },
  {
    name: 'Mô tả',
    required: false,
    type: 'Text',
    description: 'Mô tả chi tiết sản phẩm',
    example: 'iPhone 15 Pro Max 512GB màu xanh dương'
  },
  {
    name: 'Giá nhập',
    required: false,
    type: 'Number',
    description: 'Giá nhập của sản phẩm (VNĐ)',
    example: '25000000'
  },
  {
    name: 'Nhà cung cấp',
    required: false,
    type: 'Text',
    description: 'Tên nhà cung cấp',
    example: 'Apple Vietnam'
  },
  {
    name: 'Trạng thái',
    required: false,
    type: 'Text',
    description: 'Trạng thái sản phẩm (active/inactive)',
    example: 'active'
  }
];

const sampleData = [
  {
    'Tên sản phẩm': 'iPhone 15 Pro',
    'SKU': 'IP15P-256-GRAY',
    'Danh mục': 'Điện thoại',
    'Giá bán': '29990000',
    'Số lượng': '50',
    'Kho': 'KHO-HN-01',
    'Mô tả': 'iPhone 15 Pro 256GB màu xám',
    'Giá nhập': '25000000',
    'Nhà cung cấp': 'Apple Vietnam',
    'Trạng thái': 'active'
  },
  {
    'Tên sản phẩm': 'Samsung Galaxy S24 Ultra',
    'SKU': 'SGS24U-512-BLACK',
    'Danh mục': 'Điện thoại',
    'Giá bán': '33990000',
    'Số lượng': '30',
    'Kho': 'KHO-HCM-01',
    'Mô tả': 'Samsung Galaxy S24 Ultra 512GB màu đen',
    'Giá nhập': '28000000',
    'Nhà cung cấp': 'Samsung Vietnam',
    'Trạng thái': 'active'
  },
  {
    'Tên sản phẩm': 'MacBook Pro M3',
    'SKU': 'MBP-M3-1TB-SILVER',
    'Danh mục': 'Laptop',
    'Giá bán': '55990000',
    'Số lượng': '15',
    'Kho': 'KHO-HN-01',
    'Mô tả': 'MacBook Pro M3 1TB màu bạc',
    'Giá nhập': '48000000',
    'Nhà cung cấp': 'Apple Vietnam',
    'Trạng thái': 'active'
  }
];

export default function TemplateDownloader() {
  const [isDownloading, setIsDownloading] = useState<string | null>(null);

  const generateCSVContent = (includeAllFields = true): string => {
    const fields = includeAllFields 
      ? templateFields.map(f => f.name)
      : templateFields.filter(f => f.required).map(f => f.name);
    
    const header = fields.join(',');
    const rows = sampleData.map(row => 
      fields.map(field => `"${row[field as keyof typeof row] || ''}"`).join(',')
    );
    
    return [header, ...rows].join('\n');
  };

  const downloadCSV = async (type: 'basic' | 'full') => {
    setIsDownloading('csv');
    
    try {
      const includeAllFields = type === 'full';
      const csvContent = generateCSVContent(includeAllFields);
      const bom = '\uFEFF'; // UTF-8 BOM for Excel compatibility
      const blob = new Blob([bom + csvContent], { 
        type: 'text/csv;charset=utf-8;' 
      });
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `template_hang_hoa_${type}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Cleanup
      setTimeout(() => URL.revokeObjectURL(link.href), 100);
    } catch (error) {
      console.error('Error downloading CSV:', error);
      alert('Có lỗi xảy ra khi tải file CSV');
    } finally {
      setIsDownloading(null);
    }
  };

  const downloadExcel = async (type: 'basic' | 'full') => {
    setIsDownloading('excel');
    
    try {
      // For now, we'll simulate Excel download
      // In a real implementation, you'd use a library like xlsx or exceljs
      const csvContent = generateCSVContent(type === 'full');
      const blob = new Blob(['\uFEFF' + csvContent], { 
        type: 'application/vnd.ms-excel;charset=utf-8;' 
      });
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `template_hang_hoa_${type}.xls`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setTimeout(() => URL.revokeObjectURL(link.href), 100);
    } catch (error) {
      console.error('Error downloading Excel:', error);
      alert('Có lỗi xảy ra khi tải file Excel');
    } finally {
      setIsDownloading(null);
    }
  };

  const previewData = () => {
    const preview = sampleData.slice(0, 2);
    console.table(preview);
    alert('Dữ liệu mẫu đã được in ra console. Mở Developer Tools để xem chi tiết.');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Tải template mẫu
        </CardTitle>
        <CardDescription>
          Tải về file mẫu để chuẩn bị dữ liệu hàng hóa theo định dạng chuẩn của hệ thống
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="download" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="download">Tải template</TabsTrigger>
            <TabsTrigger value="structure">Cấu trúc file</TabsTrigger>
            <TabsTrigger value="preview">Xem mẫu</TabsTrigger>
          </TabsList>
          
          <TabsContent value="download" className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Chọn template phù hợp với nhu cầu của bạn. Template cơ bản chỉ chứa các trường bắt buộc, 
                template đầy đủ chứa tất cả các trường có thể.
              </AlertDescription>
            </Alert>

            <div className="grid gap-4 md:grid-cols-2">
              {/* CSV Templates */}
              <div className="space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Template CSV
                </h4>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    onClick={() => downloadCSV('basic')}
                    disabled={isDownloading === 'csv'}
                    className="w-full justify-start"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {isDownloading === 'csv' ? 'Đang tải...' : 'CSV Cơ bản (chỉ trường bắt buộc)'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => downloadCSV('full')}
                    disabled={isDownloading === 'csv'}
                    className="w-full justify-start"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {isDownloading === 'csv' ? 'Đang tải...' : 'CSV Đầy đủ (tất cả trường)'}
                  </Button>
                </div>
              </div>

              {/* Excel Templates */}
              <div className="space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <FileSpreadsheet className="h-4 w-4" />
                  Template Excel
                </h4>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    onClick={() => downloadExcel('basic')}
                    disabled={isDownloading === 'excel'}
                    className="w-full justify-start"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {isDownloading === 'excel' ? 'Đang tải...' : 'Excel Cơ bản (.xls)'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => downloadExcel('full')}
                    disabled={isDownloading === 'excel'}
                    className="w-full justify-start"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {isDownloading === 'excel' ? 'Đang tải...' : 'Excel Đầy đủ (.xls)'}
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="structure" className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-border">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border p-2 text-left">Tên trường</th>
                    <th className="border border-border p-2 text-center">Bắt buộc</th>
                    <th className="border border-border p-2 text-center">Kiểu dữ liệu</th>
                    <th className="border border-border p-2 text-left">Mô tả</th>
                    <th className="border border-border p-2 text-left">Ví dụ</th>
                  </tr>
                </thead>
                <tbody>
                  {templateFields.map((field, index) => (
                    <tr key={index} className="hover:bg-muted/50">
                      <td className="border border-border p-2 font-medium">
                        {field.name}
                      </td>
                      <td className="border border-border p-2 text-center">
                        <Badge variant={field.required ? 'destructive' : 'secondary'}>
                          {field.required ? 'Bắt buộc' : 'Tùy chọn'}
                        </Badge>
                      </td>
                      <td className="border border-border p-2 text-center">
                        <Badge variant="outline">
                          {field.type}
                        </Badge>
                      </td>
                      <td className="border border-border p-2 text-sm">
                        {field.description}
                      </td>
                      <td className="border border-border p-2 text-sm font-mono">
                        {field.example}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Dữ liệu mẫu</h4>
              <Button
                variant="outline"
                size="sm"
                onClick={previewData}
                className="flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                Xem trong console
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-border text-sm">
                <thead>
                  <tr className="bg-muted">
                    {templateFields.slice(0, 6).map((field) => (
                      <th key={field.name} className="border border-border p-2 text-left">
                        {field.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sampleData.map((row, index) => (
                    <tr key={index} className="hover:bg-muted/50">
                      <td className="border border-border p-2">{row['Tên sản phẩm']}</td>
                      <td className="border border-border p-2 font-mono">{row['SKU']}</td>
                      <td className="border border-border p-2">{row['Danh mục']}</td>
                      <td className="border border-border p-2 text-right">
                        {parseInt(row['Giá bán']).toLocaleString('vi-VN')} đ
                      </td>
                      <td className="border border-border p-2 text-center">{row['Số lượng']}</td>
                      <td className="border border-border p-2">{row['Kho']}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Đây là dữ liệu mẫu để tham khảo. File template thực tế sẽ có header nhưng không có dữ liệu, 
                bạn cần điền thông tin sản phẩm của mình vào.
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}