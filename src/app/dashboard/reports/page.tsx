"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Download, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ReportsPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Báo cáo</h1>
          <p className="text-muted-foreground">
            Phân tích và thống kê dữ liệu kho hàng
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Chọn thời gian
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Xuất báo cáo
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tính năng đang phát triển</CardTitle>
          <CardDescription>
            Hệ thống báo cáo và phân tích sẽ sớm được hoàn thiện
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Đang phát triển</h3>
            <p className="text-muted-foreground mb-4">
              Các báo cáo chi tiết và biểu đồ phân tích sẽ sớm được cập nhật
            </p>
            <Button variant="outline" onClick={() => router.push('/dashboard')}>
              Quay lại Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}