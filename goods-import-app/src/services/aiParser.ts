import axios from 'axios';

const AI_PARSER_URL = 'https://api.openrouter.ai/parse'; // Replace with the actual endpoint

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