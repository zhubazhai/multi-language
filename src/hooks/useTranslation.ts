import { useState } from 'react';
import { toast } from 'sonner';
import { translateTerms } from '@/lib/api';
import { Term, TranslatedTerm } from '@/types';

export function useTranslation() {
  const [isLoading, setIsLoading] = useState(false);
  const [translatedTerms, setTranslatedTerms] = useState<TranslatedTerm[]>([]);
  
  // Process URL to extract term prefix
  const extractTermPrefix = (url: string): string => {
    try {
      // Extract part after #
      const hashIndex = url.indexOf('#');
      if (hashIndex === -1) return '';
      
      let pathPart = url.substring(hashIndex + 1);
      
      // Remove part after ? if exists
      const queryIndex = pathPart.indexOf('?');
      if (queryIndex !== -1) {
        pathPart = pathPart.substring(0, queryIndex);
      }
      
      // Replace - and / with underscores
      return pathPart.replace(/-/g, '_').replace(/\//g, '_');
    } catch (error) {
      console.error('Error extracting term prefix:', error);
      toast.error('提取词条前缀失败');
      return '';
    }
  };
  
  // Deduplicate terms - prioritize default terms
  const deduplicateTerms = (defaultTerms: Term[], translatedTerms: Term[]): Term[] => {
    const defaultTermsMap = new Map(defaultTerms.map(term => [term.key, term]));
    
    return translatedTerms.map(term => 
      defaultTermsMap.has(term.key) ? defaultTermsMap.get(term.key)! : term
    );
  };
  
  // Process terms to add code, type and group
  const processTerms = (terms: Term[], prefix: string): TranslatedTerm[] => {
    return terms.map(term => ({
      ...term,
      code: `${prefix}_${term.key}`,
      type: 'front',
      group: prefix
    }));
  };
  
  // Main translation function
  const translate = async (defaultTermsStr: string, url: string) => {
    setIsLoading(true);
    
    try {
      // Parse default terms from JSON string
      let defaultTerms: Term[] = [];
      try {
        defaultTerms = JSON.parse(defaultTermsStr);
        if (!Array.isArray(defaultTerms)) {
          defaultTerms = [defaultTerms];
        }
      } catch (error) {
        toast.error('默认词条格式错误，请输入有效的JSON');
        return;
      }
      
      // Extract term prefix from URL
      const termPrefix = extractTermPrefix(url);
      if (!termPrefix) {
        toast.error('无法从URL提取词条前缀，请检查URL格式');
        return;
      }
      
      // Translate each term using Kimi API (mock in this implementation)
      const translationPromises = defaultTerms.map(term => translateTerms(term));
      const translationResponses = await Promise.all(translationPromises);
      
      // Extract translated terms
      const rawTranslatedTerms = translationResponses
        .filter(response => response.success)
        .map(response => response.data);
      
      // Deduplicate and process terms
      const uniqueTerms = deduplicateTerms(defaultTerms, rawTranslatedTerms);
      const processedTerms = processTerms(uniqueTerms, termPrefix);
      
      // Update state with translated terms
      setTranslatedTerms(processedTerms);
      toast.success(`成功翻译 ${processedTerms.length} 个词条`);
      
      return processedTerms;
    } catch (error) {
      console.error('Translation error:', error);
      toast.error('翻译过程中出错，请重试');
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    isLoading,
    translatedTerms,
    translate,
    extractTermPrefix,
    deduplicateTerms,
    processTerms
  };
}