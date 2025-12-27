import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-2 px-6 py-3 border-b border-border/40 bg-card/30 backdrop-blur-sm">
      <button 
        onClick={items[0]?.onClick}
        className="p-1.5 hover:bg-muted/60 rounded-lg transition-colors group"
      >
        <Home className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
      </button>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
          {index === items.length - 1 ? (
            <span className="text-sm font-medium text-foreground">
              {item.label}
            </span>
          ) : (
            <button
              onClick={item.onClick}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.label}
            </button>
          )}
        </div>
      ))}
    </nav>
  );
}
