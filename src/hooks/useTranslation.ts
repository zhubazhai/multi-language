import { useState } from "react";
import { toast } from "sonner";
import { translateTerms } from "@/lib/api";
import { Term, TranslatedTerm } from "@/types";

export function useTranslation() {
  const [isLoading, setIsLoading] = useState(false);
  const [translatedTerms, setTranslatedTerms] = useState<TranslatedTerm[]>([]);

  // Process URL to extract term prefix
  const extractTermPrefix = (url: string): string => {
    try {
      // Extract part after #
      const m = url.match(/#\/([^?]+)/);

      const pathPart = m ? m[1] : url.split("#")[1] || "";
      return pathPart.replace(/-/g, "_").replace(/\//g, "_");
    } catch (error) {
      console.error("Error extracting term prefix:", error);
      toast.error("提取词条前缀失败");
      return "";
    }
  };

  // Deduplicate terms - prioritize default terms
  const deduplicateTerms = (
    defaultTerms: Term[],
    translatedTerms: Term[]
  ): Term[] => {
    const defaultTermsMap = new Map(
      defaultTerms.map((term) => [term.key, term])
    );

    return translatedTerms.map((term) =>
      defaultTermsMap.has(term.key) ? defaultTermsMap.get(term.key)! : term
    );
  };

  // Process terms to add code, type and group
  const processTerms = (
    terms: Term[],
    prefix: string,
    translatedMap: Term[]
  ): TranslatedTerm[] => {
    return Object.entries(terms).map(([key, term]) => {
      console.log(key, term, "term", translatedMap[key]);
      return {
        zh_CN: translatedMap[key],
        en_US: term,
        code: `${prefix}_${term.key}`,
        type: "front",
        group: prefix,
      };
    });
  };

  // Main translation function
  const translate = async (
    generatedTerms: string,
    url: string,
    defaultTerms: string
  ) => {
    setIsLoading(true);

    try {
      // Extract term prefix from URL
      const termPrefix = extractTermPrefix(url);
      if (!termPrefix) {
        toast.error("无法从URL提取词条前缀，请检查URL格式");
        return;
      }

      const translationResponses = await translateTerms(generatedTerms);
      const translationObj = new Function(`return ${translationResponses}`)();
      const defaultObj = new Function(`return ${defaultTerms}`)();
      const translatedMap = new Function(`return ${generatedTerms}`)();
      const uniqueTerms = { ...translationObj, ...translatedTerms };
      console.log(translationResponses, "99999", uniqueTerms);

      const processedTerms = processTerms(
        uniqueTerms,
        termPrefix,
        translatedMap
      );

      // Update state with translated terms
      setTranslatedTerms(processedTerms);
      toast.success(`成功翻译 ${processedTerms.length} 个词条`);

      return processedTerms;
    } catch (error) {
      console.error("Translation error:", error);
      toast.error("翻译过程中出错，请重试");
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
    processTerms,
  };
}
