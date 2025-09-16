import React, { useState } from 'react';
import { parseCSV } from '../services/fileParser';
import { validateCSVFormat } from '../utils/formatChecker';
import { uploadToAIParser } from '../services/aiParser';

const CsvUploader: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            if (selectedFile.type === 'text/csv') {
                setFile(selectedFile);
                setError(null);
            } else {
                setError('Please upload a valid CSV file.');
                setFile(null);
            }
        }
    };

    const handleUpload = async () => {
        if (file) {
            const isValid = validateCSVFormat(file);
            if (!isValid) {
                const response = await uploadToAIParser(file);
                if (response.success) {
                    setSuccessMessage('File processed successfully with AI assistance.');
                } else {
                    setError('Failed to process the file with AI.');
                }
            } else {
                const parsedData = parseCSV(file);
                // Handle the parsed data as needed
                setSuccessMessage('File uploaded and parsed successfully.');
            }
        }
    };

    return (
        <div>
            <h2>Upload CSV File</h2>
            <input type="file" accept=".csv" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        </div>
    );
};

export default CsvUploader;