import { useState } from 'react';
import {
  Play, Pause, RotateCw, X, ChevronDown, ChevronUp,
  Zap, Wind, TrendingUp, Sparkles, Heart, Star,
  ArrowRight, ArrowDown, ArrowUp, ArrowLeft, Circle,
  Square, Triangle, Activity, Radio, Waves, Loader2,
  Move, RotateCcw, ZoomIn, ZoomOut, Eye, EyeOff
} from 'lucide-react';

interface Animation {
  id: string;
  name: string;
  type: 'entrance' | 'emphasis' | 'exit' | 'motion';
  duration: number;
  delay: number;
  easing: string;
  iteration: number | 'infinite';
  direction: 'normal' | 'reverse' | 'alternate';
}

interface AnimationPreset {
  id: string;
  name: string;
  description: string;
  type: 'entrance' | 'emphasis' | 'exit' | 'motion';
  icon: any;
  keyframes: string;
  defaultDuration: number;
  defaultEasing: string;
}

interface AnimationPanelProps {
  selectedElements: any[];
  onApplyAnimation: (animation: Animation) => void;
  onRemoveAnimation: () => void;
  onPreview: (animation: Animation) => void;
  currentAnimation?: Animation;
  onClose: () => void;
}

export function AnimationPanel({
  selectedElements,
  onApplyAnimation,
  onRemoveAnimation,
  onPreview,
  currentAnimation,
  onClose,
}: AnimationPanelProps) {
  const [activeTab, setActiveTab] = useState<'entrance' | 'emphasis' | 'exit' | 'motion'>('entrance');
  const [duration, setDuration] = useState(1000);
  const [delay, setDelay] = useState(0);
  const [easing, setEasing] = useState('ease-out');
  const [iteration, setIteration] = useState<number | 'infinite'>(1);
  const [direction, setDirection] = useState<'normal' | 'reverse' | 'alternate'>('normal');
  const [isPlaying, setIsPlaying] = useState(false);

  const animationPresets: AnimationPreset[] = [
    // Entrance Animations
    {
      id: 'fade-in',
      name: 'Fade In',
      description: 'Xuất hiện dần',
      type: 'entrance',
      icon: Eye,
      keyframes: 'fadeIn',
      defaultDuration: 600,
      defaultEasing: 'ease-out',
    },
    {
      id: 'slide-in-up',
      name: 'Slide Up',
      description: 'Trượt từ dưới lên',
      type: 'entrance',
      icon: ArrowUp,
      keyframes: 'slideInUp',
      defaultDuration: 800,
      defaultEasing: 'ease-out',
    },
    {
      id: 'slide-in-down',
      name: 'Slide Down',
      description: 'Trượt từ trên xuống',
      type: 'entrance',
      icon: ArrowDown,
      keyframes: 'slideInDown',
      defaultDuration: 800,
      defaultEasing: 'ease-out',
    },
    {
      id: 'slide-in-left',
      name: 'Slide Left',
      description: 'Trượt từ phải sang',
      type: 'entrance',
      icon: ArrowLeft,
      keyframes: 'slideInLeft',
      defaultDuration: 800,
      defaultEasing: 'ease-out',
    },
    {
      id: 'slide-in-right',
      name: 'Slide Right',
      description: 'Trượt từ trái sang',
      type: 'entrance',
      icon: ArrowRight,
      keyframes: 'slideInRight',
      defaultDuration: 800,
      defaultEasing: 'ease-out',
    },
    {
      id: 'zoom-in',
      name: 'Zoom In',
      description: 'Phóng to từ tâm',
      type: 'entrance',
      icon: ZoomIn,
      keyframes: 'zoomIn',
      defaultDuration: 600,
      defaultEasing: 'ease-out',
    },
    {
      id: 'bounce-in',
      name: 'Bounce In',
      description: 'Nảy vào',
      type: 'entrance',
      icon: TrendingUp,
      keyframes: 'bounceIn',
      defaultDuration: 1000,
      defaultEasing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
    {
      id: 'rotate-in',
      name: 'Rotate In',
      description: 'Xoay khi xuất hiện',
      type: 'entrance',
      icon: RotateCcw,
      keyframes: 'rotateIn',
      defaultDuration: 800,
      defaultEasing: 'ease-out',
    },
    // Emphasis Animations
    {
      id: 'pulse',
      name: 'Pulse',
      description: 'Hiệu ứng nhịp đập',
      type: 'emphasis',
      icon: Activity,
      keyframes: 'pulse',
      defaultDuration: 1000,
      defaultEasing: 'ease-in-out',
    },
    {
      id: 'shake',
      name: 'Shake',
      description: 'Rung ngang',
      type: 'emphasis',
      icon: Waves,
      keyframes: 'shake',
      defaultDuration: 600,
      defaultEasing: 'ease-in-out',
    },
    {
      id: 'bounce',
      name: 'Bounce',
      description: 'Nảy dọc',
      type: 'emphasis',
      icon: ArrowUp,
      keyframes: 'bounce',
      defaultDuration: 1000,
      defaultEasing: 'ease-in-out',
    },
    {
      id: 'swing',
      name: 'Swing',
      description: 'Lắc như con lắc',
      type: 'emphasis',
      icon: Radio,
      keyframes: 'swing',
      defaultDuration: 1000,
      defaultEasing: 'ease-in-out',
    },
    {
      id: 'tada',
      name: 'Tada',
      description: 'Thu hút chú ý',
      type: 'emphasis',
      icon: Sparkles,
      keyframes: 'tada',
      defaultDuration: 1000,
      defaultEasing: 'ease-in-out',
    },
    {
      id: 'jello',
      name: 'Jello',
      description: 'Hiệu ứng rung lắc',
      type: 'emphasis',
      icon: Waves,
      keyframes: 'jello',
      defaultDuration: 1000,
      defaultEasing: 'ease-in-out',
    },
    {
      id: 'heartbeat',
      name: 'Heartbeat',
      description: 'Nhịp tim đập',
      type: 'emphasis',
      icon: Heart,
      keyframes: 'heartbeat',
      defaultDuration: 1300,
      defaultEasing: 'ease-in-out',
    },
    {
      id: 'flash',
      name: 'Flash',
      description: 'Lóe sáng nhanh',
      type: 'emphasis',
      icon: Zap,
      keyframes: 'flash',
      defaultDuration: 500,
      defaultEasing: 'ease-in-out',
    },
    // Exit Animations
    {
      id: 'fade-out',
      name: 'Fade Out',
      description: 'Biến mất dần',
      type: 'exit',
      icon: EyeOff,
      keyframes: 'fadeOut',
      defaultDuration: 600,
      defaultEasing: 'ease-in',
    },
    {
      id: 'slide-out-up',
      name: 'Slide Out Up',
      description: 'Trượt lên trên',
      type: 'exit',
      icon: ArrowUp,
      keyframes: 'slideOutUp',
      defaultDuration: 800,
      defaultEasing: 'ease-in',
    },
    {
      id: 'slide-out-down',
      name: 'Slide Out Down',
      description: 'Trượt xuống dưới',
      type: 'exit',
      icon: ArrowDown,
      keyframes: 'slideOutDown',
      defaultDuration: 800,
      defaultEasing: 'ease-in',
    },
    {
      id: 'zoom-out',
      name: 'Zoom Out',
      description: 'Thu nhỏ về tâm',
      type: 'exit',
      icon: ZoomOut,
      keyframes: 'zoomOut',
      defaultDuration: 600,
      defaultEasing: 'ease-in',
    },
    {
      id: 'rotate-out',
      name: 'Rotate Out',
      description: 'Xoay khi biến mất',
      type: 'exit',
      icon: RotateCw,
      keyframes: 'rotateOut',
      defaultDuration: 800,
      defaultEasing: 'ease-in',
    },
    // Motion Animations
    {
      id: 'float',
      name: 'Float',
      description: 'Lơ lửng lên xuống',
      type: 'motion',
      icon: Wind,
      keyframes: 'float',
      defaultDuration: 3000,
      defaultEasing: 'ease-in-out',
    },
    {
      id: 'spin',
      name: 'Spin',
      description: 'Xoay liên tục',
      type: 'motion',
      icon: Loader2,
      keyframes: 'spin',
      defaultDuration: 2000,
      defaultEasing: 'linear',
    },
    {
      id: 'wiggle',
      name: 'Wiggle',
      description: 'Lắc qua lắc lại',
      type: 'motion',
      icon: Waves,
      keyframes: 'wiggle',
      defaultDuration: 1000,
      defaultEasing: 'ease-in-out',
    },
    {
      id: 'slide-horizontal',
      name: 'Slide Horizontal',
      description: 'Chuyển động trái phải',
      type: 'motion',
      icon: ArrowRight,
      keyframes: 'slideHorizontal',
      defaultDuration: 2000,
      defaultEasing: 'ease-in-out',
    },
  ];

  const easingOptions = [
    { value: 'linear', label: 'Linear' },
    { value: 'ease', label: 'Ease' },
    { value: 'ease-in', label: 'Ease In' },
    { value: 'ease-out', label: 'Ease Out' },
    { value: 'ease-in-out', label: 'Ease In-Out' },
    { value: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)', label: 'Bounce' },
    { value: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)', label: 'Elastic' },
  ];

  const filteredPresets = animationPresets.filter(p => p.type === activeTab);

  const handleApplyPreset = (preset: AnimationPreset) => {
    const animation: Animation = {
      id: preset.id,
      name: preset.name,
      type: preset.type,
      duration: duration || preset.defaultDuration,
      delay,
      easing: easing || preset.defaultEasing,
      iteration,
      direction,
    };

    onApplyAnimation(animation);
  };

  const handlePreview = (preset: AnimationPreset) => {
    const animation: Animation = {
      id: preset.id,
      name: preset.name,
      type: preset.type,
      duration: duration || preset.defaultDuration,
      delay,
      easing: easing || preset.defaultEasing,
      iteration: 1,
      direction: 'normal',
    };

    setIsPlaying(true);
    onPreview(animation);
    
    setTimeout(() => {
      setIsPlaying(false);
    }, animation.duration + animation.delay);
  };

  if (selectedElements.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="flex items-center justify-center w-20 h-20 bg-muted rounded-full mb-4">
          <Sparkles className="w-10 h-10 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Chưa chọn phần tử</h3>
        <p className="text-sm text-muted-foreground max-w-md">
          Chọn một phần tử trên canvas để áp dụng hiệu ứng
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Hiệu ứng</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-muted transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-muted/50 rounded-lg">
          {[
            { id: 'entrance' as const, label: 'Xuất hiện', icon: ZoomIn },
            { id: 'emphasis' as const, label: 'Nhấn mạnh', icon: Sparkles },
            { id: 'exit' as const, label: 'Thoát', icon: ZoomOut },
            { id: 'motion' as const, label: 'Chuyển động', icon: Move },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex flex-col items-center gap-1 px-2 py-2 rounded-md text-xs font-medium transition-all
                ${activeTab === tab.id
                  ? 'bg-background shadow-sm text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
                }
              `}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Animation Presets */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-3 mb-6">
          {filteredPresets.map((preset) => {
            const Icon = preset.icon;
            return (
              <div
                key={preset.id}
                className="group relative p-4 bg-muted/30 rounded-xl border border-border hover:border-primary hover:shadow-lg transition-all cursor-pointer"
              >
                {/* Preview Icon */}
                <div className="flex items-center justify-center h-16 mb-3">
                  <Icon className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>

                {/* Info */}
                <div className="text-center mb-3">
                  <h4 className="font-semibold text-sm mb-1">{preset.name}</h4>
                  <p className="text-xs text-muted-foreground">{preset.description}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePreview(preset)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-background border border-border rounded-lg hover:bg-muted transition-colors"
                  >
                    <Play className="w-3 h-3" />
                    <span className="text-xs font-medium">Xem trước</span>
                  </button>
                  <button
                    onClick={() => handleApplyPreset(preset)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <Zap className="w-3 h-3" />
                    <span className="text-xs font-medium">Áp dụng</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Current Animation */}
        {currentAnimation && (
          <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span className="text-sm font-semibold">Hiệu ứng hiện tại</span>
              </div>
              <button
                onClick={onRemoveAnimation}
                className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="text-sm">
              <p className="font-medium mb-1">{currentAnimation.name}</p>
              <p className="text-xs text-muted-foreground">
                {currentAnimation.duration}ms · {currentAnimation.easing}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Settings */}
      <div className="p-4 border-t border-border bg-muted/30">
        <details className="group">
          <summary className="flex items-center justify-between cursor-pointer list-none mb-3">
            <span className="text-sm font-semibold">Cài đặt hiệu ứng</span>
            <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" />
          </summary>

          <div className="space-y-4">
            {/* Duration */}
            <div>
              <label className="block text-xs font-medium mb-2">Thời lượng (ms)</label>
              <input
                type="range"
                min="100"
                max="5000"
                step="100"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                <span>100ms</span>
                <span className="font-mono font-semibold text-foreground">{duration}ms</span>
                <span>5000ms</span>
              </div>
            </div>

            {/* Delay */}
            <div>
              <label className="block text-xs font-medium mb-2">Độ trễ (ms)</label>
              <input
                type="range"
                min="0"
                max="3000"
                step="100"
                value={delay}
                onChange={(e) => setDelay(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                <span>0ms</span>
                <span className="font-mono font-semibold text-foreground">{delay}ms</span>
                <span>3000ms</span>
              </div>
            </div>

            {/* Easing */}
            <div>
              <label className="block text-xs font-medium mb-2">Đường cong</label>
              <select
                value={easing}
                onChange={(e) => setEasing(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm"
              >
                {easingOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Iteration */}
            <div>
              <label className="block text-xs font-medium mb-2">Lặp lại</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={iteration === 'infinite' ? 1 : iteration}
                  onChange={(e) => setIteration(Number(e.target.value))}
                  disabled={iteration === 'infinite'}
                  className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-sm disabled:opacity-50"
                />
                <button
                  onClick={() => setIteration(iteration === 'infinite' ? 1 : 'infinite')}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-colors
                    ${iteration === 'infinite'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background border border-border hover:bg-muted'
                    }
                  `}
                >
                  Lặp vô hạn
                </button>
              </div>
            </div>

            {/* Direction */}
            <div>
              <label className="block text-xs font-medium mb-2">Hướng</label>
              <div className="grid grid-cols-3 gap-2">
                {(['normal', 'reverse', 'alternate'] as const).map((dir) => (
                  <button
                    key={dir}
                    onClick={() => setDirection(dir)}
                    className={`
                      px-3 py-2 rounded-lg text-xs font-medium transition-colors capitalize
                      ${direction === dir
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-background border border-border hover:bg-muted'
                      }
                    `}
                  >
                    {dir}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </details>
      </div>
    </div>
  );
}