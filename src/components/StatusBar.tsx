import { Wifi, Database, Activity, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

export function StatusBar() {
  const [status, setStatus] = useState({
    connection: 'online' as 'online' | 'offline',
    database: 'connected' as 'connected' | 'disconnected',
    latency: 45,
    lastSync: new Date()
  });

  useEffect(() => {
    // Simulate status updates
    const interval = setInterval(() => {
      setStatus(prev => ({
        ...prev,
        latency: Math.floor(Math.random() * 50) + 30,
        lastSync: new Date()
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getLatencyColor = (latency: number) => {
    if (latency < 50) return 'text-green-600';
    if (latency < 100) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="flex items-center gap-4 px-4 py-1.5 bg-muted/30 border-t border-border/40 text-xs">
      {/* Connection Status */}
      <div className="flex items-center gap-1.5">
        {status.connection === 'online' ? (
          <>
            <Wifi className="w-3.5 h-3.5 text-green-600" />
            <span className="text-muted-foreground">Đang kết nối</span>
          </>
        ) : (
          <>
            <AlertCircle className="w-3.5 h-3.5 text-red-600" />
            <span className="text-muted-foreground">Mất kết nối</span>
          </>
        )}
      </div>

      <div className="h-3 w-px bg-border/60" />

      {/* Database Status */}
      <div className="flex items-center gap-1.5">
        <Database className="w-3.5 h-3.5 text-blue-600" />
        <span className="text-muted-foreground">Database: </span>
        <span className={status.database === 'connected' ? 'text-green-600' : 'text-red-600'}>
          {status.database === 'connected' ? 'Hoạt động' : 'Lỗi'}
        </span>
      </div>

      <div className="h-3 w-px bg-border/60" />

      {/* Latency */}
      <div className="flex items-center gap-1.5">
        <Activity className="w-3.5 h-3.5 text-purple-600" />
        <span className="text-muted-foreground">Độ trễ: </span>
        <span className={getLatencyColor(status.latency)}>{status.latency}ms</span>
      </div>

      <div className="h-3 w-px bg-border/60" />

      {/* Last Sync */}
      <div className="flex items-center gap-1.5 ml-auto">
        <span className="text-muted-foreground">
          Đồng bộ lần cuối: {status.lastSync.toLocaleTimeString('vi-VN')}
        </span>
      </div>
    </div>
  );
}
