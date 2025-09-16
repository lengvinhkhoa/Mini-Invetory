import React from 'react';
import ExcelUploader from './ExcelUploader';
import CsvUploader from './CsvUploader';
import TemplateDownloader from './TemplateDownloader';
import AIParser from './AIParser';

const GoodsImportPage: React.FC = () => {
    return (
        <div>
            <h1>Import Goods</h1>
            <p>Please upload your goods data in either Excel or CSV format.</p>
            <ExcelUploader />
            <CsvUploader />
            <TemplateDownloader />
            <AIParser />
        </div>
    );
};

export default GoodsImportPage;