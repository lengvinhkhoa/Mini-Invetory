import axios from 'axios';

const AI_PARSER_URL = 'https://api.openrouter.ai/parse'; // Replace with the actual endpoint

// Hàm parse file với AI, nhận thêm options
export const parseFileWithAI = async (file: File, options?: Record<string, any>): Promise<any> => {
    // Đọc file thành text
    const fileContent = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsText(file);
    });
    try {
        const response = await axios.post(AI_PARSER_URL, {
            data: fileContent,
            options: options || {},
        });
        return response.data;
    } catch (error) {
        console.error('Error parsing file with AI:', error);
        throw new Error('Failed to parse file with AI');
    }
};

export const analyzeFile = async (fileContent: string): Promise<any> => {
    try {
        const response = await axios.post(AI_PARSER_URL, {
            data: fileContent,
        });
        return response.data;
    } catch (error) {
        console.error('Error analyzing file with AI parser:', error);
        throw new Error('Failed to analyze file');
    }
};

export const suggestCorrections = async (fileContent: string): Promise<any> => {
    try {
        const response = await axios.post(`${AI_PARSER_URL}/suggest`, {
            data: fileContent,
        });
        return response.data;
    } catch (error) {
        console.error('Error suggesting corrections with AI parser:', error);
        throw new Error('Failed to suggest corrections');
    }
};