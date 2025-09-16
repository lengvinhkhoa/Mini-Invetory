import React, { useState } from 'react';
import { parseFileWithAI } from '../services/aiParser';

const AIParser: React.FC<{ file: File | null }> = ({ file }) => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any | null>(null);
    const [error, setError] = useState<string | null>(null);
    // Tuỳ chọn parser
    const [addSKU, setAddSKU] = useState(false);
    const [suggestPriceCol, setSuggestPriceCol] = useState(false);
    const [customOptions, setCustomOptions] = useState('');

    const handleParse = async () => {
        if (!file) {
            setError('No file selected for parsing.');
            return;
        }
        setLoading(true);
        setError(null);
        setResult(null);
        try {
            // Truyền tuỳ chọn parser vào API
            const options = {
                addSKU,
                suggestPriceCol,
                customOptions,
            };
            const parsedData = await parseFileWithAI(file, options);
            setResult(parsedData);
        } catch (err) {
            setError('Error parsing file with AI: ' + (err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>AI Parser</h2>
            <div style={{ marginBottom: 12 }}>
                <label>
                    <input type="checkbox" checked={addSKU} onChange={e => setAddSKU(e.target.checked)} /> Thêm SKU tự động
                </label>
                <br />
                <label>
                    <input type="checkbox" checked={suggestPriceCol} onChange={e => setSuggestPriceCol(e.target.checked)} /> Đề xuất cột giá hợp lý
                </label>
                <br />
                <label>
                    Tuỳ chọn khác:
                    <input type="text" value={customOptions} onChange={e => setCustomOptions(e.target.value)} placeholder="VD: Đề xuất cột tên sản phẩm..." style={{ marginLeft: 8 }} />
                </label>
            </div>
            <button onClick={handleParse} disabled={loading}>
                {loading ? 'Đang phân tích...' : 'Phân tích với AI'}
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {result && (
                <div style={{ marginTop: 16 }}>
                    <h3>Kết quả phân tích:</h3>
                    <pre>{JSON.stringify(result, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};

export default AIParser;