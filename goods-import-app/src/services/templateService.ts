import fs from 'fs';
import path from 'path';

const TEMPLATE_FILE_NAME = 'goods_template.xlsx';
const TEMPLATE_FILE_PATH = path.join(__dirname, '..', '..', 'templates', TEMPLATE_FILE_NAME);

/**
 * Function to get the template file for download
 * @returns {string} - Path to the template file
 */
export const getTemplateFile = (): string => {
    return TEMPLATE_FILE_PATH;
};

/**
 * Function to check if the template file exists
 * @returns {boolean} - True if the template file exists, false otherwise
 */
export const templateExists = (): boolean => {
    return fs.existsSync(TEMPLATE_FILE_PATH);
};

/**
 * Function to serve the template file for download
 * @returns {Promise<Buffer>} - Promise resolving to the template file buffer
 */
export const serveTemplateFile = async (): Promise<Buffer> => {
    if (!templateExists()) {
        throw new Error('Template file does not exist.');
    }
    return fs.promises.readFile(TEMPLATE_FILE_PATH);
};