import { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { cn } from "@/lib/utils";

interface TranslationFormProps {
  onTermsGenerated: (terms: any[]) => void;
}

export default function TranslationForm({
  onTermsGenerated,
}: TranslationFormProps) {
  const [url, setUrl] = useState(
    "http://localhost:9999/#/tcl/tof/settle/policy/lc-credit-limit-adjust-detail?id=LCA2025071700008"
  );
  const [defaultTerms, setDefaultTerms] = useState(
    '{credit_limit_adjust:"信用额度调整"}'
  );
  const [generatedTerms, setGeneratedTerms] = useState("");

  const { translate, isLoading, extractTermPrefix } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!url.trim() || !generatedTerms.trim()) {
      alert("请输入URL和词条");
      return;
    }

    const terms = await translate(generatedTerms, url, defaultTerms);
    console.log("Translation result:", terms)
    if (terms) {
      onTermsGenerated(terms);
    }
  };

  // Preview the term prefix
  const termPrefix = extractTermPrefix(url);

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 space-y-6 bg-white border border-gray-100 shadow-sm rounded-xl"
    >
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          路由URL
        </label>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full px-4 py-2 transition duration-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="输入包含#的URL"
        />
        {termPrefix && (
          <div className="mt-1 text-sm text-gray-500">
            <span className="font-medium">提取的词条前缀:</span> {termPrefix}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          默认词条 (JSON格式)
        </label>
        <textarea
          value={defaultTerms}
          onChange={(e) => setDefaultTerms(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 min-h-[120px]"
          placeholder='例如: {"credit_limit_adjust":"信用额度调整"}'
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          生成的多语言词条
        </label>
        <textarea
          value={generatedTerms}
          onChange={(e) => setGeneratedTerms(e.target.value)}
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
            <i className="mr-2 fa-solid fa-spinner fa-spin"></i>
            翻译中...
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <i className="mr-2 fa-solid fa-language"></i>
            生成翻译词条
          </div>
        )}
      </button>
    </form>
  );
}
