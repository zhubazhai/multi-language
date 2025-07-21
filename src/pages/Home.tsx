import { useState } from 'react';
import TranslationForm from '@/components/TranslationForm';
import TermsTable from '@/components/TermsTable';
import { TranslatedTerm } from '@/types';

export default function Home() {
  const [terms, setTerms] = useState<TranslatedTerm[]>([]);

  const handleTermsGenerated = (generatedTerms: TranslatedTerm[]) => {
    setTerms(generatedTerms);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            <i className="fa-solid fa-language text-blue-600 mr-2"></i>
            词条翻译工具
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            输入路由URL和默认词条，自动翻译为多语言版本并生成标准化词条编码
          </p>
        </header>

        <main className="space-y-8">
          <TranslationForm onTermsGenerated={handleTermsGenerated} />
          <TermsTable terms={terms} />
        </main>

        <footer className="mt-16 text-center text-gray-500 text-sm">
          <p>© 2025 词条翻译工具 | 简约大气设计</p>
        </footer>
      </div>
    </div>
  );
}