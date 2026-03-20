import React from 'react';
import { Check } from 'lucide-react';

interface TableCell {
  content: string;
  type?: 'text' | 'icon' | 'checkmark' | 'image';
  iconName?: string;
  iconColor?: string;
  imageUrl?: string;
  backgroundColor?: string;
  textAlign?: 'left' | 'center' | 'right';
  fontWeight?: string;
  fontSize?: number;
  color?: string;
  colspan?: number;
  rowspan?: number;
  merged?: boolean;
}

interface TableElementProps {
  tableData: TableCell[][];
  tableHeaderRow?: boolean;
  tableCellPadding?: number;
  tableShowBorders?: boolean;
  tableBorderColor?: string;
  tableBorderWidth?: number;
  tableAlternateRowColors?: boolean;
  tableAlternateRowColor?: string;
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  backgroundColor?: string;
  borderRadius?: number;
  zoom: number;
  boxShadow?: string;
  isEditing: boolean;
  selectedCells: { row: number; col: number }[];
  onCellClick: (row: number, col: number, shiftKey: boolean) => void;
  renderIcon: (iconName: string, className: string) => React.ReactNode;
}

export function TableElement({
  tableData,
  tableHeaderRow,
  tableCellPadding = 8,
  tableShowBorders = true,
  tableBorderColor = '#e5e7eb',
  tableBorderWidth = 1,
  tableAlternateRowColors = false,
  tableAlternateRowColor = '#f9fafb',
  fontSize = 14,
  fontFamily = 'Inter',
  color = '#000000',
  backgroundColor = '#ffffff',
  borderRadius = 0,
  zoom,
  boxShadow,
  isEditing,
  selectedCells,
  onCellClick,
  renderIcon,
}: TableElementProps) {
  return (
    <div 
      className="w-full h-full overflow-auto"
      style={{
        backgroundColor,
        borderRadius: `${borderRadius * (zoom / 100)}px`,
        boxShadow,
        pointerEvents: isEditing ? 'auto' : 'none',
      }}
    >
      <table className="w-full h-full border-collapse" style={{ fontSize: `${fontSize * (zoom / 100)}px`, fontFamily }}>
        <tbody>
          {tableData.map((row, rowIndex) => (
            <tr 
              key={rowIndex}
              style={{
                backgroundColor: tableAlternateRowColors && rowIndex > 0 && rowIndex % 2 === 0
                  ? tableAlternateRowColor
                  : undefined
              }}
            >
              {row.map((cell, colIndex) => {
                // Skip merged cells
                if (cell.merged) return null;
                
                const isCellSelected = isEditing && 
                  selectedCells.some(sc => sc.row === rowIndex && sc.col === colIndex);
                
                return (
                  <td
                    key={colIndex}
                    className="border transition-colors"
                    colSpan={cell.colspan || 1}
                    rowSpan={cell.rowspan || 1}
                    onClick={(e) => {
                      if (isEditing) {
                        e.stopPropagation();
                        onCellClick(rowIndex, colIndex, e.shiftKey);
                      }
                    }}
                    style={{
                      padding: `${tableCellPadding * (zoom / 100)}px`,
                      borderWidth: tableShowBorders ? `${tableBorderWidth * (zoom / 100)}px` : 0,
                      borderColor: tableBorderColor,
                      borderStyle: 'solid',
                      textAlign: cell.textAlign || 'left',
                      fontWeight: cell.fontWeight || (rowIndex === 0 && tableHeaderRow ? 'bold' : 'normal'),
                      fontSize: `${(cell.fontSize || fontSize) * (zoom / 100)}px`,
                      color: cell.color || color,
                      backgroundColor: isCellSelected 
                        ? '#dbeafe' 
                        : cell.backgroundColor || (rowIndex === 0 && tableHeaderRow ? '#f3f4f6' : undefined),
                      verticalAlign: 'middle',
                      cursor: isEditing ? 'pointer' : 'default',
                      outline: isCellSelected ? '2px solid #3b82f6' : undefined,
                      outlineOffset: '-2px',
                    }}
                  >
                    {cell.type === 'checkmark' ? (
                      <div className="flex items-center justify-center">
                        <Check className="w-4 h-4 text-green-600" />
                      </div>
                    ) : cell.type === 'icon' && cell.iconName ? (
                      <div className="flex items-center justify-center" style={{ color: cell.iconColor }}>
                        {renderIcon(cell.iconName, 'w-4 h-4')}
                      </div>
                    ) : cell.type === 'image' && cell.imageUrl ? (
                      <img src={cell.imageUrl} alt="" className="w-full h-auto object-contain" />
                    ) : (
                      cell.content
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
