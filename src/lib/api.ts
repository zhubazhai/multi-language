import axios from 'axios';
import { Term, TranslationResponse } from '@/types';

// Mock Kimi API call since we don't have the actual API details
export const translateTerms = async (terms: Term): Promise<TranslationResponse> => {
  // In a real implementation, this would be an actual API call to Kimi
  console.log('Translating terms:', terms);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Mock translation - in real scenario, this would come from Kimi API
  const mockTranslations: Record<string, Term> = {
    "信用额度调整": {
      key: "credit_limit_adjust",
      zh_CN: "信用额度调整",
      zh_HK: "信用額度調整",
      en_US: "Credit Limit Adjustment"
    },
    "处理流程": {
      key: "process_flow",
      zh_CN: "处理流程",
      zh_HK: "處理流程",
      en_US: "Processing Flow"
    },
    "申请单号": {
      key: "application_number",
      zh_CN: "申请单号",
      zh_HK: "申請單號",
      en_US: "Application Number"
    },
    "审批状态": {
      key: "approval_status",
      zh_CN: "审批状态",
      zh_HK: "審批狀態",
      en_US: "Approval Status"
    },
    "客户名称": {
      key: "customer_name",
      zh_CN: "客户名称",
      zh_HK: "客戶名稱",
      en_US: "Customer Name"
    }
  };
  
  // Find mock translation or create simple one if not found
  const key = Object.keys(terms)[0];
  const translation = mockTranslations[key] || {
    key: key.toLowerCase().replace(/\s+/g, '_'),
    zh_CN: terms.zh_CN || '',
    zh_HK: terms.zh_CN ? terms.zh_CN.replace(/调整/, '調整').replace(/处理/, '處理') : '',
    en_US: terms.zh_CN ? key.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ') : ''
  };
  
  return {
    success: true,
    data: translation
  };
};