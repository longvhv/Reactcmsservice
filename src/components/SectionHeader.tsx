import { ReactNode } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface SectionHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}

export function SectionHeader({ title, description, action, icon }: SectionHeaderProps) {
  const { t } = useLanguage();
  
  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <h3 className="text-foreground flex items-center gap-2">
          {icon}
          <span>{t(title)}</span>
        </h3>
        {description && (
          <p className="text-muted-foreground text-sm mt-1">{t(description)}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}