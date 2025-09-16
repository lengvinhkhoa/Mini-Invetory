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