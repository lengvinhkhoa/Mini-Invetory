export interface FileUploadResponse {
    success: boolean;
    message: string;
    data?: any; // You can specify a more detailed type based on your data structure
}

export interface GoodsData {
    id: number;
    name: string;
    quantity: number;
    price: number;
    // Add other relevant fields as necessary
}

export interface TemplateFile {
    fileName: string;
    fileType: 'xlsx' | 'csv';
    downloadUrl: string;
}

export interface AIParserResponse {
    suggestions: string[];
    correctedData?: GoodsData[];
}