import React, { useState } from 'react';
import { parseCsvFile } from '../services/fileParser';
import { isValidGoodsFormat } from '../utils/formatChecker';
import AIParser from './AIParser';

const CsvUploader: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [showAIParser, setShowAIParser] = useState(false);
    const [parsedData, setParsedData] = useState<any[] | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            if (selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv')) {
                setFile(selectedFile);
                setError(null);
                setShowAIParser(false);
                setSuccessMessage(null);
            } else {
                setError('Vui lòng upload file CSV hợp lệ.');
                setFile(null);
            }
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setError('Vui lòng chọn file trước.');
            return;
        }
        
        try {
            setError(null);
            setSuccessMessage(null);
            
            // Parse file CSV
            const data = await parseCsvFile(file);
            setParsedData(data);
            
            // Kiểm tra format
            if (isValidGoodsFormat(data)) {
                setSuccessMessage('File CSV đã được upload và phân tích thành công! Dữ liệu đúng định dạng hệ thống.');
                // TODO: Gửi dữ liệu lên server
                console.log('Parsed CSV data:', data);
            } else {
                setError('File không đúng định dạng mong đợi. Vui lòng sử dụng AI Parser để phân tích.');
                setShowAIParser(true);
            }
        } catch (err) {
            setError('Lỗi khi phân tích file CSV: ' + (err as Error).message);
        }
    };

    return (
        <div style={{ marginBottom: 20, padding: 16, border: '1px solid #ddd', borderRadius: 8 }}>
            <h2>Upload File CSV</h2>
            <input 
                type="file" 
                accept=".csv" 
                onChange={handleFileChange}
                style={{ marginBottom: 12 }}
            />
            <br />
            <button 
                onClick={handleUpload} 
                disabled={!file}
                style={{ 
                    padding: '8px 16px', 
                    backgroundColor: file ? '#28a745' : '#ccc',
                    color: 'white',
                    border: 'none',
                    borderRadius: 4,
                    cursor: file ? 'pointer' : 'not-allowed'
                }}
            >
                Upload và Phân tích
            </button>
            
            {error && <p style={{ color: 'red', marginTop: 8 }}>{error}</p>}
            {successMessage && <p style={{ color: 'green', marginTop: 8 }}>{successMessage}</p>}
            
            {showAIParser && file && (
                <div style={{ marginTop: 16, padding: 12, backgroundColor: '#f8f9fa', borderRadius: 4 }}>
                    <h3>Sử dụng AI Parser để phân tích file</h3>
                    <AIParser file={file} />
                </div>
            )}
        </div>
    );
};

export default CsvUploader;