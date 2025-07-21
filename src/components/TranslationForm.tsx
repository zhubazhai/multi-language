import { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { cn } from '@/lib/utils';

interface TranslationFormProps {
  onTermsGenerated: (terms: any[]) => void;
}

export default function TranslationForm({ onTermsGenerated }: TranslationFormProps) {
  const [url, setUrl] = useState('http://localhost:9999/#/tcl/tof/settle/policy/lc-credit-limit-adjust-detail?id=LCA2025071700008');
  const [defaultTerms, setDefaultTerms] = useState('[{"key":"credit_limit_adjust","zh_CN":"信用额度调整"},{"key":"process_flow","zh_CN":"处理流程"},{"key":"application_number","zh_CN":"申请单号"}]');
  const [generatedTerms, setGeneratedTerms] = useState('');
  
  const { translate, isLoading, extractTermPrefix } = useTranslation();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim() || !defaultTerms.trim()) {
      alert('请输入URL和默认词条');
      return;
    }
    
    const terms = await translate(defaultTerms, url);
    if (terms) {
      setGeneratedTerms(JSON.stringify(terms, null, 2));
      onTermsGenerated(terms);
    }
  };
  
  // Preview the term prefix
  const termPrefix = extractTermPrefix(url);
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">路由URL</label>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          placeholder="输入包含#的URL"
        />
        {termPrefix && (
          <div className="text-sm text-gray-500 mt-1">
            <span className="font-medium">提取的词条前缀:</span> {termPrefix}
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">默认词条 (JSON格式)</label>
        <textarea
          value={defaultTerms}
          onChange={(e) => setDefaultTerms(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 min-h-[120px]"
          placeholder='例如: [{"key":"credit_limit_adjust","zh_CN":"信用额度调整"},{"key":"process_flow","zh_CN":"处理流程"}]'
        />
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">生成的多语言词条</label>
        <textarea
          value={generatedTerms}
          readOnly
          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 min-h-[120px]"
        />
      </div>
      
      <button
        type="submit"
        disabled={isLoading}
        className={cn(
          "w-full py-3 px-4 rounded-lg font-medium transition duration-200",
          isLoading 
            ? "bg-blue-400 cursor-not-allowed" 
            : "bg-blue-600 hover:bg-blue-700 text-white"
        )}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <i className="fa-solid fa-spinner fa-spin mr-2"></i>
            翻译中...
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <i className="fa-solid fa-language mr-2"></i>
            生成翻译词条
          </div>
        )}
      </button>
    </form>
  );
}