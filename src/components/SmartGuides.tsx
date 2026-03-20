import { useEffect, useState } from 'react';

interface SmartGuide {
  type: 'vertical' | 'horizontal';
  position: number;
  label?: string;
  color?: string;
}

interface DistanceGuide {
  from: { x: number; y: number };
  to: { x: number; y: number };
  distance: number;
  axis: 'x' | 'y';
}

interface Element {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  [key: string]: any;
}

interface SmartGuidesProps {
  activeElement: Element | null;
  allElements: Element[];
  canvasWidth: number;
  canvasHeight: number;
  zoom: number;
  snapThreshold?: number;
  showDistances?: boolean;
  onSnap?: (snappedX: number, snappedY: number) => void;
}

export function SmartGuides({
  activeElement,
  allElements,
  canvasWidth,
  canvasHeight,
  zoom,
  snapThreshold = 5,
  showDistances = true,
  onSnap
}: SmartGuidesProps) {
  const [guides, setGuides] = useState<SmartGuide[]>([]);
  const [distances, setDistances] = useState<DistanceGuide[]>([]);

  useEffect(() => {
    if (!activeElement) {
      setGuides([]);
      setDistances([]);
      return;
    }

    const newGuides: SmartGuide[] = [];
    const newDistances: DistanceGuide[] = [];
    
    // Calculate threshold once for reuse
    const threshold = snapThreshold / (zoom / 100);
    
    // Active element bounds
    const activeLeft = activeElement.x;
    const activeRight = activeElement.x + activeElement.width;
    const activeCenterX = activeElement.x + activeElement.width / 2;
    const activeTop = activeElement.y;
    const activeBottom = activeElement.y + activeElement.height;
    const activeCenterY = activeElement.y + activeElement.height / 2;

    // Canvas center guides
    const canvasCenterX = canvasWidth / 2;
    const canvasCenterY = canvasHeight / 2;

    // Check alignment with other elements
    const otherElements = allElements.filter(el => el.id !== activeElement.id);
    
    otherElements.forEach(el => {
      const elLeft = el.x;
      const elRight = el.x + el.width;
      const elCenterX = el.x + el.width / 2;
      const elTop = el.y;
      const elBottom = el.y + el.height;
      const elCenterY = el.y + el.height / 2;

      // Vertical guides (X-axis alignment)
      if (Math.abs(activeLeft - elLeft) < threshold) {
        newGuides.push({ type: 'vertical', position: elLeft, label: 'Left', color: '#3b82f6' });
      }
      if (Math.abs(activeRight - elRight) < threshold) {
        newGuides.push({ type: 'vertical', position: elRight, label: 'Right', color: '#3b82f6' });
      }
      if (Math.abs(activeCenterX - elCenterX) < threshold) {
        newGuides.push({ type: 'vertical', position: elCenterX, label: 'Center', color: '#8b5cf6' });
      }
      if (Math.abs(activeLeft - elRight) < threshold) {
        newGuides.push({ type: 'vertical', position: elRight, color: '#10b981' });
      }
      if (Math.abs(activeRight - elLeft) < threshold) {
        newGuides.push({ type: 'vertical', position: elLeft, color: '#10b981' });
      }

      // Horizontal guides (Y-axis alignment)
      if (Math.abs(activeTop - elTop) < threshold) {
        newGuides.push({ type: 'horizontal', position: elTop, label: 'Top', color: '#3b82f6' });
      }
      if (Math.abs(activeBottom - elBottom) < threshold) {
        newGuides.push({ type: 'horizontal', position: elBottom, label: 'Bottom', color: '#3b82f6' });
      }
      if (Math.abs(activeCenterY - elCenterY) < threshold) {
        newGuides.push({ type: 'horizontal', position: elCenterY, label: 'Middle', color: '#8b5cf6' });
      }
      if (Math.abs(activeTop - elBottom) < threshold) {
        newGuides.push({ type: 'horizontal', position: elBottom, color: '#10b981' });
      }
      if (Math.abs(activeBottom - elTop) < threshold) {
        newGuides.push({ type: 'horizontal', position: elTop, color: '#10b981' });
      }

      // Distance guides (spacing between elements)
      if (showDistances) {
        // Horizontal distance
        if (activeRight < elLeft && Math.abs(activeTop - elTop) < 50) {
          const distance = elLeft - activeRight;
          newDistances.push({
            from: { x: activeRight, y: activeCenterY },
            to: { x: elLeft, y: activeCenterY },
            distance,
            axis: 'x'
          });
        } else if (elRight < activeLeft && Math.abs(activeTop - elTop) < 50) {
          const distance = activeLeft - elRight;
          newDistances.push({
            from: { x: elRight, y: elCenterY },
            to: { x: activeLeft, y: elCenterY },
            distance,
            axis: 'x'
          });
        }

        // Vertical distance
        if (activeBottom < elTop && Math.abs(activeLeft - elLeft) < 50) {
          const distance = elTop - activeBottom;
          newDistances.push({
            from: { x: activeCenterX, y: activeBottom },
            to: { x: activeCenterX, y: elTop },
            distance,
            axis: 'y'
          });
        } else if (elBottom < activeTop && Math.abs(activeLeft - elLeft) < 50) {
          const distance = activeTop - elBottom;
          newDistances.push({
            from: { x: elCenterX, y: elBottom },
            to: { x: elCenterX, y: activeTop },
            distance,
            axis: 'y'
          });
        }
      }
    });

    // Canvas center alignment
    if (Math.abs(activeCenterX - canvasCenterX) < threshold) {
      newGuides.push({ 
        type: 'vertical', 
        position: canvasCenterX, 
        label: 'Canvas Center', 
        color: '#ec4899' 
      });
    }
    if (Math.abs(activeCenterY - canvasCenterY) < threshold) {
      newGuides.push({ 
        type: 'horizontal', 
        position: canvasCenterY, 
        label: 'Canvas Center', 
        color: '#ec4899' 
      });
    }

    // Canvas edge alignment
    if (Math.abs(activeLeft) < threshold) {
      newGuides.push({ type: 'vertical', position: 0, label: 'Canvas Edge', color: '#f59e0b' });
    }
    if (Math.abs(activeRight - canvasWidth) < threshold) {
      newGuides.push({ type: 'vertical', position: canvasWidth, label: 'Canvas Edge', color: '#f59e0b' });
    }
    if (Math.abs(activeTop) < threshold) {
      newGuides.push({ type: 'horizontal', position: 0, label: 'Canvas Edge', color: '#f59e0b' });
    }
    if (Math.abs(activeBottom - canvasHeight) < threshold) {
      newGuides.push({ type: 'horizontal', position: canvasHeight, label: 'Canvas Edge', color: '#f59e0b' });
    }

    // Remove duplicate guides
    const uniqueGuides = newGuides.filter((guide, index, self) =>
      index === self.findIndex(g => 
        g.type === guide.type && Math.abs(g.position - guide.position) < 1
      )
    );

    setGuides(uniqueGuides);
    setDistances(newDistances);

    // Notify parent of snap positions if callback provided
    if (onSnap && uniqueGuides.length > 0) {
      const vGuide = uniqueGuides.find(g => g.type === 'vertical');
      const hGuide = uniqueGuides.find(g => g.type === 'horizontal');
      
      if (vGuide || hGuide) {
        const snappedX = vGuide ? vGuide.position - activeElement.width / 2 : activeElement.x;
        const snappedY = hGuide ? hGuide.position - activeElement.height / 2 : activeElement.y;
        onSnap(snappedX, snappedY);
      }
    }
  }, [activeElement, allElements, canvasWidth, canvasHeight, zoom, snapThreshold, showDistances, onSnap]);

  const scale = zoom / 100;

  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      {/* Smart guides */}
      {guides.map((guide, index) => {
        if (guide.type === 'vertical') {
          return (
            <div
              key={`guide-v-${index}`}
              className="absolute top-0 bottom-0 pointer-events-none"
              style={{
                left: `${guide.position * scale}px`,
                width: '1px',
                backgroundColor: guide.color || '#3b82f6',
                boxShadow: `0 0 4px ${guide.color || '#3b82f6'}`,
              }}
            >
              {guide.label && (
                <div
                  className="absolute top-2 left-2 px-2 py-1 bg-white dark:bg-gray-800 border rounded text-xs font-medium whitespace-nowrap shadow-lg"
                  style={{ 
                    color: guide.color || '#3b82f6',
                    borderColor: guide.color || '#3b82f6'
                  }}
                >
                  {guide.label}
                </div>
              )}
            </div>
          );
        } else {
          return (
            <div
              key={`guide-h-${index}`}
              className="absolute left-0 right-0 pointer-events-none"
              style={{
                top: `${guide.position * scale}px`,
                height: '1px',
                backgroundColor: guide.color || '#3b82f6',
                boxShadow: `0 0 4px ${guide.color || '#3b82f6'}`,
              }}
            >
              {guide.label && (
                <div
                  className="absolute top-2 left-2 px-2 py-1 bg-white dark:bg-gray-800 border rounded text-xs font-medium whitespace-nowrap shadow-lg"
                  style={{ 
                    color: guide.color || '#3b82f6',
                    borderColor: guide.color || '#3b82f6'
                  }}
                >
                  {guide.label}
                </div>
              )}
            </div>
          );
        }
      })}

      {/* Distance indicators */}
      {showDistances && distances.map((dist, index) => {
        const fromX = dist.from.x * scale;
        const fromY = dist.from.y * scale;
        const toX = dist.to.x * scale;
        const toY = dist.to.y * scale;
        
        if (dist.axis === 'x') {
          const length = Math.abs(toX - fromX);
          const midX = (fromX + toX) / 2;
          
          return (
            <g key={`dist-x-${index}`}>
              {/* Line */}
              <line
                x1={fromX}
                y1={fromY}
                x2={toX}
                y2={toY}
                stroke="#f59e0b"
                strokeWidth="1"
                strokeDasharray="4 2"
              />
              {/* End caps */}
              <line x1={fromX} y1={fromY - 4} x2={fromX} y2={fromY + 4} stroke="#f59e0b" strokeWidth="1" />
              <line x1={toX} y1={toY - 4} x2={toX} y2={toY + 4} stroke="#f59e0b" strokeWidth="1" />
              {/* Label */}
              <foreignObject x={midX - 25} y={fromY - 20} width="50" height="20">
                <div className="flex items-center justify-center">
                  <div className="px-1.5 py-0.5 bg-orange-100 dark:bg-orange-900/30 border border-orange-500 rounded text-[10px] font-medium text-orange-700 dark:text-orange-400">
                    {Math.round(dist.distance)}px
                  </div>
                </div>
              </foreignObject>
            </g>
          );
        } else {
          const length = Math.abs(toY - fromY);
          const midY = (fromY + toY) / 2;
          
          return (
            <g key={`dist-y-${index}`}>
              {/* Line */}
              <line
                x1={fromX}
                y1={fromY}
                x2={toX}
                y2={toY}
                stroke="#f59e0b"
                strokeWidth="1"
                strokeDasharray="4 2"
              />
              {/* End caps */}
              <line x1={fromX - 4} y1={fromY} x2={fromX + 4} y2={fromY} stroke="#f59e0b" strokeWidth="1" />
              <line x1={toX - 4} y1={toY} x2={toX + 4} y2={toY} stroke="#f59e0b" strokeWidth="1" />
              {/* Label */}
              <foreignObject x={fromX + 8} y={midY - 10} width="50" height="20">
                <div className="flex items-center justify-center">
                  <div className="px-1.5 py-0.5 bg-orange-100 dark:bg-orange-900/30 border border-orange-500 rounded text-[10px] font-medium text-orange-700 dark:text-orange-400">
                    {Math.round(dist.distance)}px
                  </div>
                </div>
              </foreignObject>
            </g>
          );
        }
      })}
    </div>
  );
}

// Wrapper component to render distance guides in SVG
export function SmartGuidesWithDistances({
  activeElement,
  allElements,
  canvasWidth,
  canvasHeight,
  zoom,
  snapThreshold = 5,
  showDistances = true,
  onSnap
}: SmartGuidesProps) {
  const [distances, setDistances] = useState<DistanceGuide[]>([]);

  useEffect(() => {
    if (!activeElement || !showDistances) {
      setDistances([]);
      return;
    }

    const newDistances: DistanceGuide[] = [];
    
    const activeLeft = activeElement.x;
    const activeRight = activeElement.x + activeElement.width;
    const activeCenterX = activeElement.x + activeElement.width / 2;
    const activeTop = activeElement.y;
    const activeBottom = activeElement.y + activeElement.height;
    const activeCenterY = activeElement.y + activeElement.height / 2;

    const otherElements = allElements.filter(el => el.id !== activeElement.id);
    
    otherElements.forEach(el => {
      const elLeft = el.x;
      const elRight = el.x + el.width;
      const elCenterX = el.x + el.width / 2;
      const elTop = el.y;
      const elBottom = el.y + el.height;
      const elCenterY = el.y + el.height / 2;

      // Horizontal distance
      if (activeRight < elLeft && Math.abs(activeTop - elTop) < 100) {
        const distance = elLeft - activeRight;
        if (distance < 200) {
          newDistances.push({
            from: { x: activeRight, y: activeCenterY },
            to: { x: elLeft, y: activeCenterY },
            distance,
            axis: 'x'
          });
        }
      } else if (elRight < activeLeft && Math.abs(activeTop - elTop) < 100) {
        const distance = activeLeft - elRight;
        if (distance < 200) {
          newDistances.push({
            from: { x: elRight, y: elCenterY },
            to: { x: activeLeft, y: elCenterY },
            distance,
            axis: 'x'
          });
        }
      }

      // Vertical distance
      if (activeBottom < elTop && Math.abs(activeLeft - elLeft) < 100) {
        const distance = elTop - activeBottom;
        if (distance < 200) {
          newDistances.push({
            from: { x: activeCenterX, y: activeBottom },
            to: { x: activeCenterX, y: elTop },
            distance,
            axis: 'y'
          });
        }
      } else if (elBottom < activeTop && Math.abs(activeLeft - elLeft) < 100) {
        const distance = activeTop - elBottom;
        if (distance < 200) {
          newDistances.push({
            from: { x: elCenterX, y: elBottom },
            to: { x: elCenterX, y: activeTop },
            distance,
            axis: 'y'
          });
        }
      }
    });

    setDistances(newDistances);
  }, [activeElement, allElements, showDistances]);

  const scale = zoom / 100;

  return (
    <>
      <SmartGuides
        activeElement={activeElement}
        allElements={allElements}
        canvasWidth={canvasWidth}
        canvasHeight={canvasHeight}
        zoom={zoom}
        snapThreshold={snapThreshold}
        showDistances={false}
        onSnap={onSnap}
      />
      
      {distances.length > 0 && (
        <svg className="absolute inset-0 pointer-events-none z-20" style={{ overflow: 'visible' }}>
          {distances.map((dist, index) => {
            const fromX = dist.from.x * scale;
            const fromY = dist.from.y * scale;
            const toX = dist.to.x * scale;
            const toY = dist.to.y * scale;
            
            if (dist.axis === 'x') {
              const midX = (fromX + toX) / 2;
              
              return (
                <g key={`dist-x-${index}`}>
                  <line
                    x1={fromX}
                    y1={fromY}
                    x2={toX}
                    y2={toY}
                    stroke="#f59e0b"
                    strokeWidth="1"
                    strokeDasharray="4 2"
                  />
                  <line x1={fromX} y1={fromY - 4} x2={fromX} y2={fromY + 4} stroke="#f59e0b" strokeWidth="1" />
                  <line x1={toX} y1={toY - 4} x2={toX} y2={toY + 4} stroke="#f59e0b" strokeWidth="1" />
                  <foreignObject x={midX - 25} y={fromY - 20} width="50" height="20">
                    <div className="flex items-center justify-center">
                      <div className="px-1.5 py-0.5 bg-orange-100 dark:bg-orange-900/30 border border-orange-500 rounded text-[10px] font-medium text-orange-700 dark:text-orange-400 whitespace-nowrap">
                        {Math.round(dist.distance)}px
                      </div>
                    </div>
                  </foreignObject>
                </g>
              );
            } else {
              const midY = (fromY + toY) / 2;
              
              return (
                <g key={`dist-y-${index}`}>
                  <line
                    x1={fromX}
                    y1={fromY}
                    x2={toX}
                    y2={toY}
                    stroke="#f59e0b"
                    strokeWidth="1"
                    strokeDasharray="4 2"
                  />
                  <line x1={fromX - 4} y1={fromY} x2={fromX + 4} y2={fromY} stroke="#f59e0b" strokeWidth="1" />
                  <line x1={toX - 4} y1={toY} x2={toX + 4} y2={toY} stroke="#f59e0b" strokeWidth="1" />
                  <foreignObject x={fromX + 8} y={midY - 10} width="50" height="20">
                    <div className="flex items-center justify-center">
                      <div className="px-1.5 py-0.5 bg-orange-100 dark:bg-orange-900/30 border border-orange-500 rounded text-[10px] font-medium text-orange-700 dark:text-orange-400 whitespace-nowrap">
                        {Math.round(dist.distance)}px
                      </div>
                    </div>
                  </foreignObject>
                </g>
              );
            }
          })}
        </svg>
      )}
    </>
  );
}