'use client';

import { useEffect, useRef, useState } from 'react';
import anime from 'animejs';
import { Card } from '@/app/components/ui/card';

export default function AnalyticsPage() {
  const chartRef = useRef<HTMLDivElement>(null);
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      // Animate the chart bars
      anime({
        targets: '.chart-bar',
        height: (el: HTMLElement) => el.getAttribute('data-value'),
        duration: 1000,
        delay: anime.stagger(100),
        easing: 'easeOutElastic(1, .8)',
      });
    }
  }, []);

  const barData = [
    { value: 45, label: 'Mon', count: 12 },
    { value: 65, label: 'Tue', count: 18 },
    { value: 80, label: 'Wed', count: 22 },
    { value: 75, label: 'Thu', count: 20 },
    { value: 90, label: 'Fri', count: 25 },
    { value: 85, label: 'Sat', count: 23 },
  ];

  const lineData = [
    { value: 3, label: 'Week 1' },
    { value: 5, label: 'Week 2' },
    { value: 3, label: 'Week 3' },
    { value: 5, label: 'Week 4' },
  ];

  // Calculate chart dimensions and scales
  const chartWidth = 100;
  const chartHeight = 100;
  const paddingX = 15;
  const paddingY = 20;
  const maxValue = 6; // Fixed max value for better scale
  const yScale = (chartHeight - 2 * paddingY) / maxValue;
  const xScale = (chartWidth - 2 * paddingX) / (lineData.length - 1);

  // Generate points for the line path
  const points = lineData.map((point, i) => ({
    x: paddingX + i * xScale,
    y: chartHeight - paddingY - (point.value * yScale),
  }));

  const pathD = `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`;

  // Generate y-axis ticks
  const yTicks = Array.from({ length: maxValue + 1 }, (_, i) => i);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-[#4CAF50] to-[#45a049] bg-clip-text text-transparent">
          Análisis de Contenido
        </h1>
        <p className="text-gray-400 mt-1">Rastrea el rendimiento y la organización de tu contenido</p>
      </div>
      
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 bg-[#1a1a1a] border-[#333]">
          <h3 className="text-sm font-medium text-gray-500">Ideas de Contenido</h3>
          <p className="text-2xl font-bold text-white">24</p>
          <p className="text-sm text-gray-400 mt-1">En proceso</p>
        </Card>
        <Card className="p-6 bg-[#1a1a1a] border-[#333]">
          <h3 className="text-sm font-medium text-gray-500">Publicados</h3>
          <p className="text-2xl font-bold text-white">156</p>
          <p className="text-sm text-gray-400 mt-1">Últimos 30 días</p>
        </Card>
        <Card className="p-6 bg-[#1a1a1a] border-[#333]">
          <h3 className="text-sm font-medium text-gray-500">Tasa de Engagement</h3>
          <p className="text-2xl font-bold text-white">8.2%</p>
          <p className="text-sm text-gray-400 mt-1">Promedio en todas las plataformas</p>
        </Card>
        <Card className="p-6 bg-[#1a1a1a] border-[#333]">
          <h3 className="text-sm font-medium text-gray-500">Calendario de Contenido</h3>
          <p className="text-2xl font-bold text-white">85%</p>
          <p className="text-sm text-gray-400 mt-1">En tiempo</p>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <Card className="p-6 bg-[#1a1a1a] border-[#333]">
          <h2 className="text-xl font-semibold mb-4 text-white">Rendimiento de Contenido</h2>
          <div ref={chartRef} className="h-64 flex items-end justify-between space-x-2">
            {barData.map((bar, index) => (
              <div
                key={bar.label}
                className="relative group"
                onMouseEnter={() => setHoveredBar(index)}
                onMouseLeave={() => setHoveredBar(null)}
              >
                <div 
                  className={`chart-bar w-8 bg-[#4CAF50] rounded-t transition-all duration-300 ${
                    hoveredBar === index ? 'bg-[#45a049] scale-110' : ''
                  }`}
                  data-value={`${bar.value}%`}
                />
                {hoveredBar === index && (
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#1a1a1a] text-white px-2 py-1 rounded text-sm whitespace-nowrap border border-[#333]">
                    {bar.count} piezas
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-sm text-gray-500">
            {barData.map(bar => (
              <span key={bar.label}>{bar.label}</span>
            ))}
          </div>
        </Card>

        {/* Line Chart */}
        <Card className="p-6 bg-[#1a1a1a] border-[#333]">
          <h2 className="text-xl font-semibold mb-4 text-white">Contenido Publicado por Semana</h2>
          <div className="h-64 relative">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              {/* Y-axis grid lines and labels */}
              {yTicks.map((tick) => {
                const y = chartHeight - paddingY - (tick * yScale);
                return (
                  <g key={tick}>
                    <line
                      x1={paddingX}
                      y1={y}
                      x2={chartWidth - paddingX}
                      y2={y}
                      stroke="#333"
                      strokeWidth="0.5"
                    />
                    <text
                      x={paddingX - 8}
                      y={y}
                      textAnchor="end"
                      alignmentBaseline="middle"
                      className="text-xs fill-gray-500"
                    >
                      {tick}
                    </text>
                  </g>
                );
              })}

              {/* X-axis grid lines */}
              {lineData.map((_, index) => {
                const x = paddingX + index * xScale;
                return (
                  <line
                    key={index}
                    x1={x}
                    y1={paddingY}
                    x2={x}
                    y2={chartHeight - paddingY}
                    stroke="#333"
                    strokeWidth="0.5"
                  />
                );
              })}

              {/* X and Y axes */}
              <line
                x1={paddingX}
                y1={paddingY}
                x2={paddingX}
                y2={chartHeight - paddingY}
                stroke="#666"
                strokeWidth="1"
              />
              <line
                x1={paddingX}
                y1={chartHeight - paddingY}
                x2={chartWidth - paddingX}
                y2={chartHeight - paddingY}
                stroke="#666"
                strokeWidth="1"
              />

              {/* Data line */}
              <path
                d={pathD}
                fill="none"
                stroke="#4CAF50"
                strokeWidth="2"
                className="chart-line"
              />

              {/* Data points with larger hover area */}
              {points.map((point, index) => (
                <g key={lineData[index].label}>
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r="4"
                    fill="#4CAF50"
                    className={`transition-all duration-300 ${
                      hoveredPoint === index ? 'r-6 fill-[#45a049]' : ''
                    }`}
                    onMouseEnter={() => setHoveredPoint(index)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                  {hoveredPoint === index && (
                    <text
                      x={point.x}
                      y={point.y - 10}
                      textAnchor="middle"
                      fill="white"
                      className="text-sm"
                    >
                      {lineData[index].value} piezas
                    </text>
                  )}
                </g>
              ))}
            </svg>
          </div>
          <div className="flex justify-between mt-4 text-sm text-gray-500">
            {lineData.map(point => (
              <span key={point.label}>{point.label}</span>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}