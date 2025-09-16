import React from 'react';

const TemplateDownloader: React.FC = () => {
    const downloadTemplate = () => {
        const link = document.createElement('a');
        link.href = '/path/to/template.xlsx'; // Update with the actual path to the template
        link.download = 'template.xlsx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div>
            <h2>Download Template</h2>
            <p>Click the button below to download the template file for importing goods.</p>
            <button onClick={downloadTemplate}>Download Template</button>
        </div>
    );
};

export default TemplateDownloader;