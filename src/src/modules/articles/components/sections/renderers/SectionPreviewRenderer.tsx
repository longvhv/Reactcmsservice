/**
 * SectionPreviewRenderer - Renders all sections for preview/detail view
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft, ChevronRight, ChevronDown, Check, X as XIcon, ThumbsUp, ThumbsDown,
  Info, AlertTriangle, CheckCircle, XCircle, Lightbulb, StickyNote, Zap,
  Download, FileText, Play, Music, ExternalLink, Copy, Clock
} from 'lucide-react';
import type { ContentSection, ContentSectionType } from '@/src/types/content-section';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, AreaChart, Area, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';

interface Props {
  sections: ContentSection[];
}

export function SectionPreviewRenderer({ sections }: Props) {
  const visibleSections = sections.filter(s => s.isVisible).sort((a, b) => a.order - b.order);

  if (visibleSections.length === 0) {
    return <div className="text-center py-12 text-gray-400">Chưa có nội dung</div>;
  }

  return (
    <div className="space-y-6">
      {visibleSections.map(section => (
        <div key={section.id} className={`${getSpacingClass(section.spacing)}`}>
          {section.title && <h3 className="mb-3 text-gray-900 dark:text-gray-100">{section.title}</h3>}
          <SectionRenderer section={section} />
        </div>
      ))}
    </div>
  );
}

function getSpacingClass(spacing: string): string {
  switch (spacing) {
    case 'none': return '';
    case 'small': return 'py-2';
    case 'large': return 'py-8';
    default: return 'py-4';
  }
}

function SectionRenderer({ section }: { section: ContentSection }) {
  switch (section.type) {
    case 'html': return <HtmlRenderer content={section.content} />;
    case 'image': return <ImageRenderer section={section} />;
    case 'divider': return <DividerRenderer section={section} />;
    case 'quote': return <QuoteRenderer section={section} />;
    case 'callout': return <CalloutRenderer section={section} />;
    case 'alert': return <AlertRenderer section={section} />;
    case 'slideshow': return <SlideshowRenderer section={section} />;
    case 'video': return <VideoRenderer section={section} />;
    case 'chart': return <ChartRenderer section={section} />;
    case 'timeline': return <TimelineRenderer section={section} />;
    case 'poll': return <PollRenderer section={section} />;
    case 'code': return <CodeRenderer section={section} />;
    case 'table': return <TableRenderer section={section} />;
    case 'accordion': return <AccordionRenderer section={section} />;
    case 'tabs': return <TabsRenderer section={section} />;
    case 'steps': return <StepsRenderer section={section} />;
    case 'numbers': return <NumbersRenderer section={section} />;
    case 'cta': return <CTARenderer section={section} />;
    case 'toggle-list': return <ToggleListRenderer section={section} />;
    case 'gallery': return <GalleryRenderer section={section} />;
    case 'audio': return <AudioRenderer section={section} />;
    case 'embed': return <EmbedRenderer section={section} />;
    case 'comparison': return <ComparisonRenderer section={section} />;
    case 'file-download': return <FileDownloadRenderer section={section} />;
    default: return <div className="text-gray-400 text-sm italic">Section type: {section.type}</div>;
  }
}

// ==================== RENDERERS ====================

function HtmlRenderer({ content }: { content: string }) {
  if (!content) return <p className="text-gray-400 italic">Chưa có nội dung...</p>;
  return <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: content }} />;
}

function ImageRenderer({ section }: { section: any }) {
  if (!section.imageUrl) return <div className="bg-gray-100 dark:bg-gray-800 rounded-lg h-48 flex items-center justify-center text-gray-400">No image</div>;
  const widthClass = section.width === 'small' ? 'max-w-sm' : section.width === 'medium' ? 'max-w-lg' : section.width === 'wide' ? 'max-w-3xl' : 'w-full';
  const alignClass = section.alignment === 'left' ? '' : section.alignment === 'right' ? 'ml-auto' : 'mx-auto';
  return (
    <figure className={`${widthClass} ${alignClass}`}>
      <img src={section.imageUrl} alt={section.alt} className="w-full rounded-lg" />
      {section.caption && <figcaption className="text-sm text-gray-500 mt-2 text-center">{section.caption}</figcaption>}
      {section.credit && <p className="text-xs text-gray-400 mt-1 text-center">Credit: {section.credit}</p>}
    </figure>
  );
}

function DividerRenderer({ section }: { section: any }) {
  const widthMap: Record<string, string> = { 'full': '100%', '3/4': '75%', '1/2': '50%', '1/4': '25%' };
  if (section.withText) {
    return (
      <div className="flex items-center gap-4" style={{ width: widthMap[section.dividerWidth], margin: '0 auto' }}>
        <hr className="flex-1" style={{ borderTopStyle: section.style === 'gradient' ? 'solid' : section.style, borderColor: section.color || '#d1d5db' }} />
        <span className="text-sm text-gray-500 px-2">{section.withText}</span>
        <hr className="flex-1" style={{ borderTopStyle: section.style === 'gradient' ? 'solid' : section.style, borderColor: section.color || '#d1d5db' }} />
      </div>
    );
  }
  return <hr style={{
    width: widthMap[section.dividerWidth], margin: '0 auto',
    borderTopWidth: 2, borderTopStyle: section.style === 'gradient' ? 'solid' : section.style,
    borderColor: section.color || '#d1d5db',
    ...(section.style === 'gradient' ? { borderImage: 'linear-gradient(to right, transparent, #3b82f6, transparent) 1' } : {}),
  }} />;
}

function QuoteRenderer({ section }: { section: any }) {
  const styles: Record<string, string> = {
    simple: 'border-l-4 border-blue-500 pl-6 py-2',
    boxed: 'bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm',
    bordered: 'border-2 border-gray-200 dark:border-gray-700 p-6 rounded-xl',
    gradient: 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-xl',
    'full-width': 'bg-gray-900 text-white p-8 rounded-xl',
  };
  return (
    <blockquote className={styles[section.quoteStyle] || styles.simple}>
      <p className="text-lg italic mb-3">&ldquo;{section.text}&rdquo;</p>
      <div className="flex items-center gap-2">
        {section.avatar && <img src={section.avatar} alt="" className="w-8 h-8 rounded-full" />}
        <div>
          <cite className="not-italic text-sm">&mdash; {section.author}</cite>
          {section.source && <span className="text-xs text-gray-500 ml-1">({section.source})</span>}
        </div>
      </div>
    </blockquote>
  );
}

function CalloutRenderer({ section }: { section: any }) {
  const configs: Record<string, { bg: string; icon: React.ElementType }> = {
    info: { bg: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300', icon: Info },
    warning: { bg: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300', icon: AlertTriangle },
    success: { bg: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300', icon: CheckCircle },
    error: { bg: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300', icon: XCircle },
    tip: { bg: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 text-purple-800 dark:text-purple-300', icon: Lightbulb },
    note: { bg: 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300', icon: StickyNote },
  };
  const cfg = configs[section.variant] || configs.info;
  const Icon = cfg.icon;
  return (
    <div className={`flex gap-3 p-4 rounded-xl border ${cfg.bg}`}>
      <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <div>
        {section.calloutTitle && <div className="mb-1">{section.calloutTitle}</div>}
        <div className="text-sm opacity-90">{section.content}</div>
      </div>
    </div>
  );
}

function AlertRenderer({ section }: { section: any }) {
  const configs: Record<string, { bg: string; icon: React.ElementType }> = {
    info: { bg: 'bg-blue-50 border-blue-300 text-blue-800', icon: Info },
    warning: { bg: 'bg-amber-50 border-amber-300 text-amber-800', icon: AlertTriangle },
    error: { bg: 'bg-red-50 border-red-300 text-red-800', icon: XCircle },
    success: { bg: 'bg-green-50 border-green-300 text-green-800', icon: CheckCircle },
    breaking: { bg: 'bg-red-100 border-red-400 text-red-900', icon: Zap },
  };
  const cfg = configs[section.variant] || configs.info;
  const Icon = cfg.icon;
  return (
    <div className={`flex items-start gap-3 p-4 rounded-xl border-l-4 ${cfg.bg} ${section.variant === 'breaking' ? 'animate-pulse-glow' : ''}`}>
      <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <div>
        <div>{section.alertTitle}</div>
        {section.message && <div className="text-sm mt-1 opacity-80">{section.message}</div>}
      </div>
    </div>
  );
}

function SlideshowRenderer({ section }: { section: any }) {
  const [current, setCurrent] = useState(0);
  const slides = section.slides || [];
  if (slides.length === 0) return <div className="bg-gray-100 dark:bg-gray-800 rounded-xl h-64 flex items-center justify-center text-gray-400">No slides</div>;

  useEffect(() => {
    if (!section.autoPlay || slides.length <= 1) return;
    const timer = setInterval(() => setCurrent(c => (c + 1) % slides.length), (section.interval || 5) * 1000);
    return () => clearInterval(timer);
  }, [section.autoPlay, section.interval, slides.length]);

  return (
    <div className="relative rounded-xl overflow-hidden bg-black">
      <div className="aspect-video relative">
        {slides.map((slide: any, i: number) => (
          <div key={slide.id} className={`absolute inset-0 transition-opacity duration-500 ${i === current ? 'opacity-100' : 'opacity-0'}`}>
            <img src={slide.imageUrl} alt={slide.alt} className="w-full h-full object-cover" />
            {slide.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <p className="text-white text-sm">{slide.caption}</p>
              </div>
            )}
          </div>
        ))}
      </div>
      {section.showArrows && slides.length > 1 && (
        <>
          <button onClick={() => setCurrent((current - 1 + slides.length) % slides.length)}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={() => setCurrent((current + 1) % slides.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg">
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}
      {section.showDots && slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_: any, i: number) => (
            <button key={i} onClick={() => setCurrent(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${i === current ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/75'}`} />
          ))}
        </div>
      )}
    </div>
  );
}

function VideoRenderer({ section }: { section: any }) {
  const getEmbedUrl = (url: string) => {
    const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
    const vi = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    if (vi) return `https://player.vimeo.com/video/${vi[1]}`;
    return null;
  };
  const embedUrl = getEmbedUrl(section.url);
  const ratioClass = section.aspectRatio === '4:3' ? 'aspect-[4/3]' : section.aspectRatio === '21:9' ? 'aspect-[21/9]' : 'aspect-video';

  return (
    <div>
      <div className={`${ratioClass} rounded-xl overflow-hidden bg-black`}>
        {embedUrl ? (
          <iframe src={embedUrl} className="w-full h-full" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
        ) : section.url ? (
          <video src={section.url} controls poster={section.poster} className="w-full h-full" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400"><Play className="w-12 h-12" /></div>
        )}
      </div>
      {section.caption && <p className="text-sm text-gray-500 mt-2 text-center">{section.caption}</p>}
    </div>
  );
}

function ChartRenderer({ section }: { section: any }) {
  const data = section.data.map((d: any) => ({ name: d.label, value: d.value, fill: d.color }));
  const height = section.chartHeight || 300;

  return (
    <div>
      {section.chartTitle && <h4 className="text-center text-gray-700 dark:text-gray-300 mb-4">{section.chartTitle}</h4>}
      <ResponsiveContainer width="100%" height={height}>
        {section.chartType === 'pie' || section.chartType === 'donut' ? (
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%"
              innerRadius={section.chartType === 'donut' ? 60 : 0} outerRadius={100}
              label={section.showValues ? ({ name, value }: any) => `${name}: ${value}` : false}>
              {data.map((entry: any, i: number) => <Cell key={i} fill={entry.fill || section.colorScheme[i % section.colorScheme.length]} />)}
            </Pie>
            {section.showLegend && <Legend />}
            <Tooltip />
          </PieChart>
        ) : section.chartType === 'line' ? (
          <LineChart data={data}>
            {section.showGrid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            {section.showLegend && <Legend />}
            <Line type="monotone" dataKey="value" stroke={section.colorScheme[0]} strokeWidth={2} dot={{ r: 4 }}
              isAnimationActive={section.animate} />
          </LineChart>
        ) : section.chartType === 'area' ? (
          <AreaChart data={data}>
            {section.showGrid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="value" stroke={section.colorScheme[0]} fill={`${section.colorScheme[0]}40`}
              isAnimationActive={section.animate} />
          </AreaChart>
        ) : section.chartType === 'radar' ? (
          <RadarChart cx="50%" cy="50%" outerRadius={100} data={data}>
            <PolarGrid />
            <PolarAngleAxis dataKey="name" />
            <PolarRadiusAxis />
            <Radar dataKey="value" stroke={section.colorScheme[0]} fill={`${section.colorScheme[0]}40`} />
          </RadarChart>
        ) : (
          <BarChart data={data}>
            {section.showGrid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            {section.showLegend && <Legend />}
            <Bar dataKey="value" isAnimationActive={section.animate} radius={[4, 4, 0, 0]}
              label={section.showValues ? { position: 'top' } : false}>
              {data.map((entry: any, i: number) => <Cell key={i} fill={entry.fill || section.colorScheme[i % section.colorScheme.length]} />)}
            </Bar>
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}

function TimelineRenderer({ section }: { section: any }) {
  return (
    <div className="relative pl-8">
      <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />
      {section.events.map((event: any, i: number) => (
        <div key={event.id} className="relative pb-8 last:pb-0">
          <div className="absolute left-[-22px] w-6 h-6 rounded-full border-2 border-white dark:border-gray-900 flex items-center justify-center"
            style={{ backgroundColor: event.color || '#3b82f6' }}>
            <div className="w-2 h-2 rounded-full bg-white" />
          </div>
          <div className="ml-4 bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-xs text-gray-500">{event.date}</span>
            </div>
            <h4 className="text-gray-900 dark:text-gray-100 mb-1">{event.eventTitle}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">{event.description}</p>
            {event.media && <img src={event.media} alt="" className="mt-3 rounded-lg max-h-40 object-cover" />}
          </div>
        </div>
      ))}
    </div>
  );
}

function PollRenderer({ section }: { section: any }) {
  const [voted, setVoted] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const totalVotes = section.options.reduce((sum: number, o: any) => sum + (o.votes || 0), 0) + (voted ? 1 : 0);

  const handleVote = () => {
    if (selected.length === 0) return;
    setVoted(true);
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
      <h4 className="text-gray-900 dark:text-gray-100 mb-4">{section.question || 'Untitled Poll'}</h4>
      {(!voted && !section.showResults) ? (
        <div className="space-y-2">
          {section.options.map((opt: any) => (
            <label key={opt.id} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
              selected.includes(opt.id) ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50'
            }`}>
              <input type={section.allowMultiple ? 'checkbox' : 'radio'} name="poll" checked={selected.includes(opt.id)}
                onChange={() => {
                  if (section.allowMultiple) {
                    setSelected(prev => prev.includes(opt.id) ? prev.filter(id => id !== opt.id) : [...prev, opt.id]);
                  } else {
                    setSelected([opt.id]);
                  }
                }} className="rounded" />
              <span className="text-sm">{opt.text}</span>
            </label>
          ))}
          <button onClick={handleVote} disabled={selected.length === 0}
            className="mt-3 px-6 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 transition-colors">
            Bình chọn
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {section.options.map((opt: any) => {
            const votes = opt.votes + (voted && selected.includes(opt.id) ? 1 : 0);
            const pct = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
            return (
              <div key={opt.id} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{opt.text} {selected.includes(opt.id) && <Check className="w-3 h-3 inline text-blue-600" />}</span>
                  <span className="text-gray-500">{pct}%</span>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700 ease-out" style={{ width: `${pct}%`, backgroundColor: opt.color || '#3b82f6' }} />
                </div>
              </div>
            );
          })}
          <p className="text-xs text-gray-500 mt-2">{totalVotes} phiếu bầu</p>
        </div>
      )}
    </div>
  );
}

function CodeRenderer({ section }: { section: any }) {
  const [copied, setCopied] = useState(false);
  const lines = section.code.split('\n');

  const handleCopy = () => {
    navigator.clipboard.writeText(section.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`rounded-xl overflow-hidden ${section.theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50 border border-gray-200'}`}>
      {section.filename && (
        <div className={`flex items-center justify-between px-4 py-2 border-b ${section.theme === 'dark' ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-600'}`}>
          <span className="text-xs font-mono">{section.filename}</span>
          <div className="flex items-center gap-2">
            <span className="text-xs px-1.5 py-0.5 rounded bg-gray-700/50 text-gray-400">{section.language}</span>
            <button onClick={handleCopy} className="text-xs hover:text-white transition-colors">
              {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      )}
      <div className="overflow-x-auto">
        <pre className={`p-4 text-sm font-mono ${section.theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
          {section.showLineNumbers ? (
            <table className="w-full">
              <tbody>
                {lines.map((line: string, i: number) => (
                  <tr key={i}>
                    <td className={`pr-4 select-none text-right ${section.theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} style={{ minWidth: '2.5em' }}>{i + 1}</td>
                    <td className="whitespace-pre">{line}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <code>{section.code}</code>
          )}
        </pre>
      </div>
    </div>
  );
}

function TableRenderer({ section }: { section: any }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-800">
            {section.headers.map((h: string, i: number) => (
              <th key={i} className={`px-4 py-3 text-left text-gray-700 dark:text-gray-300 ${section.bordered ? 'border-r border-gray-200 dark:border-gray-700 last:border-r-0' : ''}`}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {section.rows.map((row: string[], ri: number) => (
            <tr key={ri} className={`border-t border-gray-200 dark:border-gray-700 ${section.striped && ri % 2 ? 'bg-gray-50/50 dark:bg-gray-800/30' : ''} ${section.hoverable ? 'hover:bg-blue-50/50 dark:hover:bg-blue-900/10' : ''}`}>
              {row.map((cell: string, ci: number) => (
                <td key={ci} className={`px-4 py-3 text-gray-600 dark:text-gray-400 ${section.bordered ? 'border-r border-gray-200 dark:border-gray-700 last:border-r-0' : ''}`}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AccordionRenderer({ section }: { section: any }) {
  const [openItems, setOpenItems] = useState<Set<string>>(section.defaultOpenFirst && section.items[0] ? new Set([section.items[0].id]) : new Set());

  const toggle = (id: string) => {
    setOpenItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); }
      else {
        if (!section.allowMultipleOpen) next.clear();
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className={`space-y-2 ${section.accordionStyle === 'separated' ? 'space-y-3' : ''}`}>
      {section.items.map((item: any) => {
        const isOpen = openItems.has(item.id);
        return (
          <div key={item.id} className={`rounded-xl border overflow-hidden transition-all ${
            section.accordionStyle === 'filled' ? 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700' :
            'border-gray-200 dark:border-gray-700'
          }`}>
            <button onClick={() => toggle(item.id)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-left">
              <span className="text-sm text-gray-900 dark:text-gray-100">{item.accordionTitle}</span>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
              <div className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700 pt-3"
                dangerouslySetInnerHTML={{ __html: item.content }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function TabsRenderer({ section }: { section: any }) {
  const [activeTab, setActiveTab] = useState(section.tabs[0]?.id || '');

  const tabStyles: Record<string, { tab: string; active: string }> = {
    default: { tab: 'px-4 py-2 text-sm border-b-2 border-transparent', active: 'border-blue-500 text-blue-600' },
    pills: { tab: 'px-4 py-2 text-sm rounded-lg', active: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' },
    underline: { tab: 'px-4 py-2 text-sm border-b-2 border-transparent', active: 'border-blue-500 text-blue-600' },
  };
  const style = tabStyles[section.tabStyle] || tabStyles.default;

  return (
    <div>
      <div className="flex gap-1 border-b border-gray-200 dark:border-gray-700 mb-4">
        {section.tabs.map((tab: any) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`${style.tab} ${activeTab === tab.id ? style.active : 'text-gray-500 hover:text-gray-700'} transition-colors`}>
            {tab.tabTitle}
          </button>
        ))}
      </div>
      {section.tabs.map((tab: any) => tab.id === activeTab && (
        <div key={tab.id} className="text-sm text-gray-600 dark:text-gray-400" dangerouslySetInnerHTML={{ __html: tab.content }} />
      ))}
    </div>
  );
}

function StepsRenderer({ section }: { section: any }) {
  return (
    <div className={`space-y-4 ${section.stepsStyle === 'connected' ? 'relative' : ''}`}>
      {section.stepsStyle === 'connected' && <div className="absolute left-5 top-8 bottom-8 w-0.5 bg-gray-200 dark:bg-gray-700" />}
      {section.steps.map((step: any, i: number) => (
        <div key={step.id} className={`flex gap-4 ${section.stepsStyle === 'cards' ? 'bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm' : ''}`}>
          {section.showNumbers && (
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center flex-shrink-0 relative z-10">
              {i + 1}
            </div>
          )}
          <div className="flex-1">
            <h4 className="text-gray-900 dark:text-gray-100 mb-1">{step.stepTitle}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">{step.description}</p>
            {step.duration && <span className="inline-flex items-center gap-1 text-xs text-gray-500 mt-2"><Clock className="w-3 h-3" />{step.duration}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}

function NumbersRenderer({ section }: { section: any }) {
  return (
    <div className={`grid gap-4`} style={{ gridTemplateColumns: `repeat(${section.columns}, 1fr)` }}>
      {section.items.map((item: any) => (
        <div key={item.id} className={`text-center p-6 rounded-xl ${
          section.numbersStyle === 'card' ? 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm' :
          section.numbersStyle === 'gradient' ? 'bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20' : ''
        }`}>
          <div className="text-3xl text-gray-900 dark:text-gray-100 mb-1" style={{ color: item.color }}>
            {item.prefix}{item.value.toLocaleString()}{item.suffix}
          </div>
          <div className="text-sm text-gray-500">{item.label}</div>
        </div>
      ))}
    </div>
  );
}

function CTARenderer({ section }: { section: any }) {
  const btnClass = section.buttonStyle === 'outline'
    ? 'border-2 border-white text-white hover:bg-white/10'
    : section.buttonStyle === 'secondary'
    ? 'bg-white/20 text-white hover:bg-white/30'
    : section.buttonStyle === 'gradient'
    ? 'bg-gradient-to-r from-white to-gray-100 text-blue-600 hover:from-gray-100 hover:to-white'
    : 'bg-white text-blue-600 hover:bg-gray-100';

  return (
    <div className={`rounded-xl p-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white ${
      section.ctaLayout === 'centered' ? 'text-center' : section.ctaLayout === 'split' ? 'flex items-center justify-between' : ''
    }`} style={section.backgroundImage ? { backgroundImage: `url(${section.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
      <div className={section.ctaLayout === 'split' ? 'flex-1' : ''}>
        <h3 className="text-white mb-2">{section.ctaTitle || 'Call to Action'}</h3>
        {section.description && <p className="text-white/80 text-sm mb-4">{section.description}</p>}
      </div>
      <a href={section.buttonUrl} className={`inline-block px-8 py-3 rounded-xl transition-all ${btnClass} ${section.ctaLayout !== 'split' ? 'mt-4' : ''}`}>
        {section.buttonText}
      </a>
    </div>
  );
}

function ToggleListRenderer({ section }: { section: any }) {
  if (section.variant === 'pros-cons') {
    const pros = section.items.filter((i: any) => i.itemType === 'pro');
    const cons = section.items.filter((i: any) => i.itemType === 'con');
    return (
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-green-50 dark:bg-green-900/10 rounded-xl p-4">
          <div className="flex items-center gap-2 text-green-700 dark:text-green-400 mb-3"><ThumbsUp className="w-4 h-4" /> Ưu điểm</div>
          <ul className="space-y-2">
            {pros.map((item: any) => (
              <li key={item.id} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" /> {item.text}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-red-50 dark:bg-red-900/10 rounded-xl p-4">
          <div className="flex items-center gap-2 text-red-700 dark:text-red-400 mb-3"><ThumbsDown className="w-4 h-4" /> Nhược điểm</div>
          <ul className="space-y-2">
            {cons.map((item: any) => (
              <li key={item.id} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                <XIcon className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" /> {item.text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <ul className={`space-y-2 ${section.columns === 2 ? 'grid grid-cols-2 gap-2 space-y-0' : ''}`}>
      {section.items.map((item: any) => (
        <li key={item.id} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
          {section.variant === 'checklist' ? <Check className="w-4 h-4 text-blue-500 mt-0.5" /> :
           item.itemType === 'pro' ? <Check className="w-4 h-4 text-green-500 mt-0.5" /> :
           item.itemType === 'con' ? <XIcon className="w-4 h-4 text-red-500 mt-0.5" /> :
           <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 flex-shrink-0" />}
          {item.text}
        </li>
      ))}
    </ul>
  );
}

function GalleryRenderer({ section }: { section: any }) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [carouselIdx, setCarouselIdx] = useState(0);
  const images = section.images || [];
  if (images.length === 0) return <div className="bg-gray-100 dark:bg-gray-800 rounded-xl h-48 flex items-center justify-center text-gray-400">Chưa có ảnh</div>;

  const gapClass = section.gap === 'small' ? 'gap-1' : section.gap === 'large' ? 'gap-4' : 'gap-2';

  if (section.layout === 'carousel') {
    return (
      <div className="relative rounded-xl overflow-hidden bg-black">
        <div className="aspect-video relative">
          {images.map((img: any, i: number) => (
            <div key={img.id} className={`absolute inset-0 transition-opacity duration-500 ${i === carouselIdx ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
              {img.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <p className="text-white text-sm">{img.caption}</p>
                </div>
              )}
            </div>
          ))}
        </div>
        {images.length > 1 && (
          <>
            <button onClick={() => setCarouselIdx((carouselIdx - 1 + images.length) % images.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={() => setCarouselIdx((carouselIdx + 1) % images.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg">
              <ChevronRight className="w-5 h-5" />
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_: any, i: number) => (
                <button key={i} onClick={() => setCarouselIdx(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${i === carouselIdx ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/75'}`} />
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <>
      <div className={`grid ${gapClass}`} style={{ gridTemplateColumns: `repeat(${section.columns || 3}, 1fr)` }}>
        {images.map((img: any, i: number) => (
          <div key={img.id} className="group relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 cursor-pointer"
            onClick={() => section.enableLightbox && setLightboxIdx(i)}>
            <div className="aspect-square">
              <img src={img.url} alt={img.alt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
            {img.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-xs truncate">{img.caption}</p>
              </div>
            )}
          </div>
        ))}
      </div>
      {lightboxIdx !== null && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center" onClick={() => setLightboxIdx(null)}>
          <button onClick={() => setLightboxIdx(null)} className="absolute top-4 right-4 text-white/80 hover:text-white">
            <XIcon className="w-8 h-8" />
          </button>
          <button className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white" onClick={(e) => { e.stopPropagation(); setLightboxIdx((lightboxIdx - 1 + images.length) % images.length); }}>
            <ChevronLeft className="w-10 h-10" />
          </button>
          <img src={images[lightboxIdx].url} alt={images[lightboxIdx].alt} className="max-w-[90vw] max-h-[90vh] object-contain" onClick={e => e.stopPropagation()} />
          <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white" onClick={(e) => { e.stopPropagation(); setLightboxIdx((lightboxIdx + 1) % images.length); }}>
            <ChevronRight className="w-10 h-10" />
          </button>
          {images[lightboxIdx].caption && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-4 py-2 rounded-lg">
              {images[lightboxIdx].caption}
            </div>
          )}
        </div>
      )}
    </>
  );
}

function AudioRenderer({ section }: { section: any }) {
  if (section.source === 'spotify' && section.url) {
    const spotifyMatch = section.url.match(/spotify\.com\/(track|episode|playlist)\/([a-zA-Z0-9]+)/);
    if (spotifyMatch) {
      return (
        <div className="rounded-xl overflow-hidden">
          <iframe
            src={`https://open.spotify.com/embed/${spotifyMatch[1]}/${spotifyMatch[2]}`}
            width="100%" height="152" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            className="rounded-xl"
          />
        </div>
      );
    }
  }

  return (
    <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-5 flex items-center gap-4">
      {section.coverImage ? (
        <img src={section.coverImage} alt="" className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
      ) : (
        <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center flex-shrink-0">
          <Music className="w-7 h-7 text-white" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-white truncate">{section.audioTitle || 'Untitled'}</p>
        <p className="text-gray-400 text-sm truncate">{section.artist || 'Unknown artist'}</p>
        {section.source === 'url' && section.url && (
          <audio src={section.url} controls className="mt-3 w-full h-8" />
        )}
        {section.source !== 'url' && (
          <div className="mt-3 flex items-center gap-2">
            <div className="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full w-0 bg-orange-500 rounded-full" />
            </div>
            <a href={section.url} target="_blank" rel="noopener noreferrer" className="text-xs text-orange-400 hover:text-orange-300 whitespace-nowrap">
              <ExternalLink className="w-3.5 h-3.5 inline mr-1" />Mở
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

function EmbedRenderer({ section }: { section: any }) {
  const getEmbedUrl = (url: string, type: string) => {
    if (type === 'youtube' || !type) {
      const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/);
      if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
    }
    if (type === 'vimeo') {
      const vi = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
      if (vi) return `https://player.vimeo.com/video/${vi[1]}`;
    }
    return null;
  };

  const ratioClass = section.aspectRatio === '4:3' ? 'aspect-[4/3]' : section.aspectRatio === '1:1' ? 'aspect-square' : section.aspectRatio === 'auto' ? 'min-h-[300px]' : 'aspect-video';

  // Custom embed code
  if (section.embedType === 'custom' && section.embedCode) {
    return (
      <div className={`${ratioClass} rounded-xl overflow-hidden`}>
        <div dangerouslySetInnerHTML={{ __html: section.embedCode }} className="w-full h-full" />
      </div>
    );
  }

  const embedUrl = getEmbedUrl(section.url, section.embedType);

  return (
    <div className={`${ratioClass} rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800`}>
      {embedUrl ? (
        <iframe src={embedUrl} className="w-full h-full" frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
      ) : section.url ? (
        <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-gray-500">
          <ExternalLink className="w-8 h-8" />
          <a href={section.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">{section.url}</a>
          <span className="text-xs text-gray-400 capitalize">{section.embedType}</span>
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-400">
          <ExternalLink className="w-12 h-12" />
        </div>
      )}
    </div>
  );
}

function ComparisonRenderer({ section }: { section: any }) {
  const items = section.items || [];
  const criteria = section.criteria || [];

  if (items.length === 0) return <div className="text-gray-400 text-sm italic">Chưa có mục so sánh</div>;

  if (section.comparisonLayout === 'side-by-side') {
    return (
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${Math.min(items.length, 4)}, 1fr)` }}>
        {items.map((item: any) => (
          <div key={item.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
            {item.image && <img src={item.image} alt={item.name} className="w-full h-32 object-cover rounded-lg mb-3" />}
            <h4 className="text-gray-900 dark:text-gray-100 mb-3 text-center">{item.name}</h4>
            <div className="space-y-2">
              {criteria.map((c: any) => (
                <div key={c.id} className="flex justify-between items-center py-1.5 border-b border-gray-100 dark:border-gray-700 last:border-0">
                  <span className="text-xs text-gray-500">{c.name}</span>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {c.criteriaType === 'boolean' ? (
                      item.values[c.id] === 'true' ? <Check className="w-4 h-4 text-green-500" /> : <XIcon className="w-4 h-4 text-red-400" />
                    ) : c.criteriaType === 'rating' ? (
                      <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs">{item.values[c.id]}/10</span>
                    ) : item.values[c.id] || '-'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Table layout
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-800">
            <th className="px-4 py-3 text-left text-gray-500">Tiêu chí</th>
            {items.map((item: any) => (
              <th key={item.id} className="px-4 py-3 text-center text-gray-900 dark:text-gray-100">{item.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {criteria.map((c: any, ri: number) => (
            <tr key={c.id} className={`border-t border-gray-200 dark:border-gray-700 ${ri % 2 ? 'bg-gray-50/50 dark:bg-gray-800/30' : ''}`}>
              <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{c.name}</td>
              {items.map((item: any) => (
                <td key={item.id} className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">
                  {c.criteriaType === 'boolean' ? (
                    item.values[c.id] === 'true' ? <Check className="w-4 h-4 text-green-500 mx-auto" /> : <XIcon className="w-4 h-4 text-red-400 mx-auto" />
                  ) : c.criteriaType === 'rating' ? (
                    <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs">{item.values[c.id]}/10</span>
                  ) : item.values[c.id] || '-'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FileDownloadRenderer({ section }: { section: any }) {
  const files = section.files || [];
  if (files.length === 0) return <div className="text-gray-400 text-sm italic">Chưa có tệp đính kèm</div>;

  const fileTypeColors: Record<string, string> = {
    pdf: 'bg-red-100 text-red-600', doc: 'bg-blue-100 text-blue-600', docx: 'bg-blue-100 text-blue-600',
    xls: 'bg-green-100 text-green-600', xlsx: 'bg-green-100 text-green-600',
    zip: 'bg-amber-100 text-amber-600', rar: 'bg-amber-100 text-amber-600',
    mp4: 'bg-purple-100 text-purple-600', mp3: 'bg-orange-100 text-orange-600',
  };

  if (section.downloadLayout === 'grid') {
    return (
      <div className="grid grid-cols-2 gap-3">
        {files.map((file: any) => (
          <a key={file.id} href={file.url || '#'} download
            className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow group">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${fileTypeColors[file.fileType] || 'bg-gray-100 text-gray-500'}`}>
              <FileText className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900 dark:text-gray-100 truncate">{file.name || 'Unnamed file'}</p>
              <p className="text-xs text-gray-500">{file.fileType?.toUpperCase()} {file.size && `• ${file.size}`}</p>
            </div>
            <Download className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
          </a>
        ))}
      </div>
    );
  }

  if (section.downloadLayout === 'compact') {
    return (
      <div className="flex flex-wrap gap-2">
        {files.map((file: any) => (
          <a key={file.id} href={file.url || '#'} download
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm">
            <FileText className="w-3.5 h-3.5 text-gray-500" />
            <span className="text-gray-700 dark:text-gray-300">{file.name || 'File'}</span>
            {file.size && <span className="text-xs text-gray-400">{file.size}</span>}
            <Download className="w-3 h-3 text-gray-400" />
          </a>
        ))}
      </div>
    );
  }

  // Default: list
  return (
    <div className="space-y-2">
      {files.map((file: any) => (
        <a key={file.id} href={file.url || '#'} download
          className="flex items-center gap-4 p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow group">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${fileTypeColors[file.fileType] || 'bg-gray-100 text-gray-500'}`}>
            <FileText className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-900 dark:text-gray-100">{file.name || 'Unnamed file'}</p>
            {file.description && <p className="text-xs text-gray-500 mt-0.5">{file.description}</p>}
            <p className="text-xs text-gray-400 mt-0.5">{file.fileType?.toUpperCase()} {file.size && `• ${file.size}`}</p>
          </div>
          <Download className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
        </a>
      ))}
    </div>
  );
}

export default SectionPreviewRenderer;