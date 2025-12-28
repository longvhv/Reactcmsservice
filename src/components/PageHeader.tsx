import { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description?: string | ReactNode;
  action?: ReactNode;
  badge?: ReactNode;
}

export function PageHeader({ title, description, action, badge }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-foreground">{title}</h1>
            {badge}
          </div>
          {description && (
            <div className="text-muted-foreground mt-1">{description}</div>
          )}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}