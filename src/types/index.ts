export interface Term {
  key: string;
  zh_CN: string;
  zh_HK?: string;
  en_US?: string;
  [key: string]: string | undefined;
}

export interface TranslatedTerm extends Term {
  code: string;
  type: string;
  group: string;
}

export interface TranslationResponse {
  success: boolean;
  data: Term;
}