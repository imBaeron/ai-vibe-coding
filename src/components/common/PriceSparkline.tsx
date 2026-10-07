import React from 'react';
import { PriceHistoryPoint } from '../../types';

export interface PriceSparklineProps {
  data: PriceHistoryPoint[];
  width?: number;
  height?: number;
  color?: string;
  showPoints?: boolean;
}

export const PriceSparkline: React.FC<PriceSparklineProps> = ({
  data,
  width = 120,
  height = 36,
  color = '#000000',
  showPoints = true,
}) => {
  if (!data || data.length === 0) return null;

  const prices = data.map((d) => d.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const range = maxPrice - minPrice || 1;

  const padding = 4;
  const usableWidth = width - padding * 2;
  const usableHeight = height - padding * 2;

  const points = data.map((d, index) => {
    const x = padding + (index / (data.length - 1 || 1)) * usableWidth;
    const y = height - padding - ((d.price - minPrice) / range) * usableHeight;
    return { x, y, price: d.price, label: d.label };
  });

  const pathD = points.reduce((acc, point, index) => {
    return index === 0 ? `M ${point.x} ${point.y}` : `${acc} L ${point.x} ${point.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;

  return (
    <div className="relative inline-block" style={{ width, height }}>
      <svg width={width} height={height} className="overflow-visible">
        <defs>
          <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.15" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <path d={areaD} fill={`url(#grad-${color.replace('#', '')})`} />
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {showPoints &&
          points.map((pt, i) => (
            <circle
              key={i}
              cx={pt.x}
              cy={pt.y}
              r={i === points.length - 1 ? 3 : 2}
              fill={i === points.length - 1 ? color : '#ffffff'}
              stroke={color}
              strokeWidth={1.5}
            />
          ))}
      </svg>
    </div>
  );
};
