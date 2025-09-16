import React, { useState } from 'react';
import { parseFileWithAI } from '../services/aiParser';

const AIParser: React.FC<{ file: File | null }> = ({ file }) => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleParse = async () => {
        if (!file) {
            setError('No file selected for parsing.');
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const parsedData = await parseFileWithAI(file);
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
            <button onClick={handleParse} disabled={loading}>
                {loading ? 'Parsing...' : 'Parse with AI'}
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
        </div>
    );
};

export default AIParser;