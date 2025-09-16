interface ParsedProduct {
  name: string;
  sku: string;
  category: string;
  price: number;
  quantity: number;
  warehouse: string;
  description?: string;
  costPrice?: number;
  supplier?: string;
  status?: string;
}

interface AIParseResult {
  success: boolean;
  data: ParsedProduct[];
  errors: string[];
  warnings: string[];
  originalHeaders: string[];
  mapping: Record<string, string>;
}

interface OpenRouterResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

class AIParserService {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://openrouter.ai/api/v1';
  private readonly model = 'microsoft/wizardlm-2-8x22b'; // GPT OSS 120B free model
  
  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.OPENROUTER_API_KEY || '';
  }

  /**
   * Parse raw data using AI to convert to standard format
   */
  async parseWithAI(rawData: any[][], originalHeaders: string[]): Promise<AIParseResult> {
    try {
      if (!this.apiKey) {
        throw new Error('OpenRouter API key is required for AI parsing');
      }

      const prompt = this.buildParsingPrompt(rawData, originalHeaders);
      const aiResponse = await this.callOpenRouter(prompt);
      
      return this.processAIResponse(aiResponse, originalHeaders);
    } catch (error) {
      console.error('AI parsing error:', error);
      return {
        success: false,
        data: [],
        errors: [error instanceof Error ? error.message : 'AI parsing failed'],
        warnings: [],
        originalHeaders,
        mapping: {}
      };
    }
  }

  /**
   * Build prompt for AI to understand and convert data
   */
  private buildParsingPrompt(rawData: any[][], originalHeaders: string[]): string {
    const sampleRows = rawData.slice(0, 5); // Take first 5 rows for analysis
    const dataPreview = sampleRows.map(row => 
      originalHeaders.map((header, index) => `${header}: ${row[index] || ''}`).join(' | ')
    ).join('\n');

    return `
Bạn là một AI chuyên gia về phân tích và chuyển đổi dữ liệu hàng hóa. 
Tôi có một file dữ liệu với các cột như sau: ${originalHeaders.join(', ')}

Dữ liệu mẫu:
${dataPreview}

Hãy phân tích và chuyển đổi dữ liệu này thành format chuẩn với các trường sau:
- name (tên sản phẩm) - BẮT BUỘC
- sku (mã SKU) - BẮT BUỘC  
- category (danh mục) - BẮT BUỘC
- price (giá bán, số) - BẮT BUỘC
- quantity (số lượng, số) - BẮT BUỘC
- warehouse (mã kho) - BẮT BUỘC
- description (mô tả) - TÙY CHỌN
- costPrice (giá nhập, số) - TÙY CHỌN
- supplier (nhà cung cấp) - TÙY CHỌN
- status (trạng thái) - TÙY CHỌN

Quy tắc chuyển đổi:
1. Tự động nhận diện và map các cột tương ứng
2. Làm sạch dữ liệu (loại bỏ khoảng trắng thừa, ký tự đặc biệt)
3. Chuyển đổi giá tiền về số (loại bỏ dấu phẩy, đơn vị tiền tệ)
4. Chuẩn hóa tên danh mục
5. Tạo SKU tự động nếu không có (dựa trên tên sản phẩm)
6. Gán kho mặc định "KHO-MAIN" nếu không có thông tin kho

Trả về kết quả theo format JSON:
{
  "mapping": {
    "originalColumn": "standardField"
  },
  "data": [
    {
      "name": "string",
      "sku": "string", 
      "category": "string",
      "price": number,
      "quantity": number,
      "warehouse": "string",
      "description": "string",
      "costPrice": number,
      "supplier": "string",
      "status": "string"
    }
  ],
  "warnings": ["warning messages"],
  "errors": ["error messages"]
}

Chỉ trả về JSON, không thêm text giải thích nào khác.
`;
  }

  /**
   * Call OpenRouter API
   */
  private async callOpenRouter(prompt: string): Promise<string> {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://mini-inventory.com',
        'X-Title': 'Mini Inventory - AI Parser'
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.1,
        max_tokens: 4000,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`);
    }

    const result: OpenRouterResponse = await response.json();
    
    if (!result.choices || result.choices.length === 0) {
      throw new Error('No response from AI model');
    }

    return result.choices[0].message.content;
  }

  /**
   * Process AI response and validate data
   */
  private processAIResponse(aiResponse: string, originalHeaders: string[]): AIParseResult {
    try {
      // Clean up response (remove markdown code blocks if any)
      const cleanResponse = aiResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsed = JSON.parse(cleanResponse);

      // Validate required fields for each product
      const validatedData: ParsedProduct[] = [];
      const errors: string[] = [];
      const warnings: string[] = parsed.warnings || [];

      if (!parsed.data || !Array.isArray(parsed.data)) {
        throw new Error('AI response does not contain valid data array');
      }

      parsed.data.forEach((item: any, index: number) => {
        const validationResult = this.validateProduct(item, index + 1);
        
        if (validationResult.isValid) {
          validatedData.push(validationResult.product);
        } else {
          errors.push(...validationResult.errors);
        }
        
        warnings.push(...validationResult.warnings);
      });

      return {
        success: errors.length === 0,
        data: validatedData,
        errors,
        warnings,
        originalHeaders,
        mapping: parsed.mapping || {}
      };

    } catch (error) {
      console.error('Error processing AI response:', error);
      return {
        success: false,
        data: [],
        errors: [`Failed to parse AI response: ${error instanceof Error ? error.message : 'Unknown error'}`],
        warnings: [],
        originalHeaders,
        mapping: {}
      };
    }
  }

  /**
   * Validate a single product object
   */
  private validateProduct(item: any, rowNumber: number): {
    isValid: boolean;
    product: ParsedProduct;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required fields validation
    if (!item.name || typeof item.name !== 'string' || item.name.trim() === '') {
      errors.push(`Row ${rowNumber}: Tên sản phẩm là bắt buộc`);
    }

    if (!item.sku || typeof item.sku !== 'string' || item.sku.trim() === '') {
      errors.push(`Row ${rowNumber}: SKU là bắt buộc`);
    }

    if (!item.category || typeof item.category !== 'string' || item.category.trim() === '') {
      errors.push(`Row ${rowNumber}: Danh mục là bắt buộc`);
    }

    if (typeof item.price !== 'number' || item.price <= 0) {
      errors.push(`Row ${rowNumber}: Giá bán phải là số dương`);
    }

    if (typeof item.quantity !== 'number' || item.quantity < 0) {
      errors.push(`Row ${rowNumber}: Số lượng phải là số không âm`);
    }

    if (!item.warehouse || typeof item.warehouse !== 'string' || item.warehouse.trim() === '') {
      errors.push(`Row ${rowNumber}: Mã kho là bắt buộc`);
    }

    // Warnings for optional fields
    if (item.costPrice && (typeof item.costPrice !== 'number' || item.costPrice <= 0)) {
      warnings.push(`Row ${rowNumber}: Giá nhập không hợp lệ, sẽ bỏ qua`);
      item.costPrice = undefined;
    }

    if (item.price && item.costPrice && item.price < item.costPrice) {
      warnings.push(`Row ${rowNumber}: Giá bán thấp hơn giá nhập`);
    }

    const product: ParsedProduct = {
      name: item.name?.trim() || '',
      sku: item.sku?.trim() || '',
      category: item.category?.trim() || '',
      price: Number(item.price) || 0,
      quantity: Number(item.quantity) || 0,
      warehouse: item.warehouse?.trim() || '',
      description: item.description?.trim() || undefined,
      costPrice: item.costPrice ? Number(item.costPrice) : undefined,
      supplier: item.supplier?.trim() || undefined,
      status: item.status?.trim() || 'active'
    };

    return {
      isValid: errors.length === 0,
      product,
      errors,
      warnings
    };
  }

  /**
   * Get available models from OpenRouter
   */
  async getAvailableModels(): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/models`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch models');
      }

      const data = await response.json();
      return data.data?.map((model: any) => model.id) || [];
    } catch (error) {
      console.error('Error fetching models:', error);
      return [];
    }
  }

  /**
   * Estimate cost for parsing
   */
  estimateCost(dataRowCount: number): { 
    estimatedTokens: number; 
    estimatedCostUSD: number; 
    isFree: boolean; 
  } {
    // Rough estimation: ~50 tokens per row for input + output
    const estimatedTokens = dataRowCount * 50 + 1000; // +1000 for system prompt
    
    // GPT OSS 120B is often free on OpenRouter
    const isFree = true;
    const estimatedCostUSD = 0;

    return {
      estimatedTokens,
      estimatedCostUSD,
      isFree
    };
  }
}

export default AIParserService;
export type { ParsedProduct, AIParseResult };