import React from 'react';
import { ArticleEditor } from './ArticleEditor';

interface ReporterArticleEditorProps {
  articleId?: number;
  articleType?: string;
  onBack: () => void;
  onSave?: (data: any, saveAndContinue?: boolean) => void;
}

/**
 * Wrapper around ArticleEditor to adapt props for Reporter Portal
 * ArticleEditor expects: { articleId, onClose, onSave }
 * Reporter expects: { articleId, articleType, onBack, onSave(data, saveAndContinue) }
 */
export function ReporterArticleEditor({ 
  articleId, 
  articleType, 
  onBack, 
  onSave 
}: ReporterArticleEditorProps) {
  
  const handleSave = (data: any, saveAndContinue?: boolean) => {
    if (onSave) {
      onSave(data, saveAndContinue);
    }
  };

  return (
    <ArticleEditor
      articleId={articleId}
      onClose={onBack}
      onSave={handleSave}
    />
  );
}
