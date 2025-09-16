export const isValidExcelFormat = (fileName: string): boolean => {
    const excelFileExtensions = ['.xlsx', '.xls'];
    return excelFileExtensions.some(ext => fileName.endsWith(ext));
};

export const isValidCsvFormat = (fileName: string): boolean => {
    return fileName.endsWith('.csv');
};

export const validateFileContent = (data: any[], expectedStructure: string[]): boolean => {
    if (data.length === 0) return false;

    const headers = Object.keys(data[0]);
    return expectedStructure.every(expected => headers.includes(expected));
};

// Định nghĩa cấu trúc mẫu của hàng hoá
export const EXPECTED_GOODS_STRUCTURE = [
    'name', // Tên sản phẩm
    'quantity', // Số lượng  
    'price', // Giá
    'category', // Danh mục
    'description' // Mô tả
];

// Kiểm tra file có đúng format hàng hoá không
export const isValidGoodsFormat = (data: any[]): boolean => {
    return validateFileContent(data, EXPECTED_GOODS_STRUCTURE);
};