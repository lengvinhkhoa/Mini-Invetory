# Goods Import Application

## Overview
The Goods Import Application is designed to facilitate the import of goods data through Excel and CSV files. It provides users with an intuitive interface to upload their files, validate formats, and utilize AI assistance for correcting any discrepancies in the data.

## Features
- **File Upload**: Users can upload goods data in both Excel (.xlsx) and CSV (.csv) formats.
- **Template Download**: A downloadable template is available to help users format their data correctly before uploading.
- **AI Integration**: The application integrates with an AI parser to assist users in formatting their uploaded files if they do not meet the required format.
- **Validation**: The application checks the format of uploaded files and ensures they conform to the expected structure.

## Project Structure
```
goods-import-app
├── src
│   ├── app.ts                  # Entry point of the application
│   ├── components
│   │   ├── GoodsImportPage.tsx # Main page for importing goods
│   │   ├── ExcelUploader.tsx    # Component for uploading Excel files
│   │   ├── CsvUploader.tsx      # Component for uploading CSV files
│   │   ├── TemplateDownloader.tsx # Component for downloading the template
│   │   └── AIParser.tsx         # Component for AI assistance in file formatting
│   ├── services
│   │   ├── fileParser.ts        # Functions for parsing uploaded files
│   │   ├── aiParser.ts          # Functions for interacting with the AI parser
│   │   └── templateService.ts    # Functions for managing the template file
│   ├── utils
│   │   └── formatChecker.ts      # Utility functions for format validation
│   └── types
│       └── index.ts             # TypeScript interfaces and types
├── package.json                 # npm configuration file
├── tsconfig.json                # TypeScript configuration file
└── README.md                    # Project documentation
```

## Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd goods-import-app
   ```
3. Install the dependencies:
   ```
   npm install
   ```

## Usage
1. Start the application:
   ```
   npm start
   ```
2. Open your browser and navigate to `http://localhost:3000` to access the Goods Import Application.

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.