import { Plus, Trash2 } from 'lucide-react';
import type { TabsSectionData } from '@/src/types/content-section';
import { generateSectionId } from '../../../sections/index';
import { useState } from 'react';

interface Props { section: TabsSectionData; onChange: (u: Partial<TabsSectionData>) => void; }

export function TabsSectionEditor({ section, onChange }: Props) {
  const [activeTab, setActiveTab] = useState(section.tabs[0]?.id || '');
  const updateTab = (id: string, field: string, value: string) => {
    onChange({ tabs: section.tabs.map(t => t.id === id ? { ...t, [field]: value } : t) });
  };
  const addTab = () => {
    const newTab = { id: generateSectionId(), tabTitle: `Tab ${section.tabs.length + 1}`, content: '' };
    onChange({ tabs: [...section.tabs, newTab] });
    setActiveTab(newTab.id);
  };
  const removeTab = (id: string) => {
    if (section.tabs.length <= 1) return;
    const newTabs = section.tabs.filter(t => t.id !== id);
    onChange({ tabs: newTabs });
    if (activeTab === id) setActiveTab(newTabs[0]?.id || '');
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-1 border-b border-gray-200 dark:border-gray-700 pb-1">
        {section.tabs.map(tab => (
          <div key={tab.id} className={`flex items-center gap-1 px-3 py-1.5 rounded-t-lg text-xs cursor-pointer transition-colors ${activeTab === tab.id ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 border-b-2 border-blue-500' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            onClick={() => setActiveTab(tab.id)}>
            <input type="text" value={tab.tabTitle} onChange={e => { e.stopPropagation(); updateTab(tab.id, 'tabTitle', e.target.value); }}
              className="bg-transparent border-none focus:outline-none text-xs w-20 text-center" onClick={e => e.stopPropagation()} />
            <button onClick={e => { e.stopPropagation(); removeTab(tab.id); }} disabled={section.tabs.length <= 1}
              className="text-gray-400 hover:text-red-500 disabled:opacity-30"><Trash2 className="w-3 h-3" /></button>
          </div>
        ))}
        <button onClick={addTab} className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"><Plus className="w-3.5 h-3.5" /></button>
      </div>
      {section.tabs.map(tab => tab.id === activeTab && (
        <textarea key={tab.id} value={tab.content} onChange={e => updateTab(tab.id, 'content', e.target.value)} placeholder="Nội dung tab..."
          rows={6} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-y" />
      ))}
      <div className="flex gap-1">
        {(['default', 'pills', 'underline'] as const).map(s => (
          <button key={s} onClick={() => onChange({ tabStyle: s })}
            className={`px-2 py-1 rounded text-xs capitalize ${section.tabStyle === s ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{s}</button>
        ))}
      </div>
    </div>
  );
}