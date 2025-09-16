import React, { useState } from 'react';
import { uploadExcelFile } from '../services/fileParser';
import { useAIParser } from '../services/aiParser';

const ExcelUploader: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const { parseFile } = useAIParser();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            if (selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
                setFile(selectedFile);
                setError(null);
            } else {
                setError('Please upload a valid .xlsx file.');
            }
        }
    };

    const handleUpload = async () => {
        if (file) {
            try {
                await uploadExcelFile(file);
                alert('File uploaded successfully!');
            } catch (err) {
                setError('Error uploading file. Please try again.');
            }
        }
    };

    const handleAIParse = async () => {
        if (file) {
            const result = await parseFile(file);
            if (result) {
                alert('File parsed successfully with AI assistance!');
            } else {
                setError('AI parsing failed. Please check the file format.');
            }
        }
    };

    return (
        <div>
            <h2>Upload Excel File</h2>
            <input type="file" accept=".xlsx" onChange={handleFileChange} />
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button onClick={handleUpload}>Upload</button>
            <button onClick={handleAIParse}>Parse with AI</button>
        </div>
    );
};

export default ExcelUploader;