import { useState } from 'react';
import { Database, Trash2 } from 'lucide-react';
import { seedDatabase } from '../services/api';

export function DevTools() {
  const [seeding, setSeeding] = useState(false);
  const [message, setMessage] = useState('');

  const handleSeed = async () => {
    setSeeding(true);
    setMessage('');
    
    try {
      const result = await seedDatabase();
      
      if (result.success) {
        setMessage(`✅ ${result.message} Refresh the page.`);
      } else {
        setMessage(`❌ Error seeding database`);
      }
    } catch (error) {
      setMessage(`❌ Error: ${error}`);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-border rounded-lg shadow-lg p-4 max-w-sm z-50">
      <div className="flex items-center gap-2 mb-3">
        <Database className="w-5 h-5 text-blue-600" />
        <h3 className="font-semibold">Công cụ phát triển</h3>
      </div>
      
      <button
        onClick={handleSeed}
        disabled={seeding}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {seeding ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            Đang tạo dữ liệu...
          </>
        ) : (
          <>
            <Database className="w-4 h-4" />
            Tạo dữ liệu mẫu
          </>
        )}
      </button>
      
      {message && (
        <p className="mt-3 text-sm text-muted-foreground">{message}</p>
      )}
      
      <p className="mt-3 text-xs text-muted-foreground">
        Nhấn để tạo dữ liệu mẫu gồm người dùng, danh mục và 17 bài viết đa dạng để kiểm thử.
      </p>
    </div>
  );
}