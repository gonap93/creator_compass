'use client';

import { useEffect, useRef } from 'react';
import anime from 'animejs';
import { Card } from '@/app/components/ui/card';

export default function AnalyticsPage() {
  const chartRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Analytics Dashboard</h1>
      
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
          <p className="text-2xl font-bold">1,234</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500">Active Sessions</h3>
          <p className="text-2xl font-bold">456</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500">Conversion Rate</h3>
          <p className="text-2xl font-bold">23.4%</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500">Avg. Session Time</h3>
          <p className="text-2xl font-bold">4m 32s</p>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">User Growth</h2>
          <div ref={chartRef} className="h-64 flex items-end justify-between space-x-2">
            <div className="chart-bar w-8 bg-blue-500 rounded-t" data-value="60%"></div>
            <div className="chart-bar w-8 bg-blue-500 rounded-t" data-value="75%"></div>
            <div className="chart-bar w-8 bg-blue-500 rounded-t" data-value="85%"></div>
            <div className="chart-bar w-8 bg-blue-500 rounded-t" data-value="90%"></div>
            <div className="chart-bar w-8 bg-blue-500 rounded-t" data-value="95%"></div>
            <div className="chart-bar w-8 bg-blue-500 rounded-t" data-value="100%"></div>
          </div>
          <div className="flex justify-between mt-4 text-sm text-gray-500">
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
            <span>May</span>
            <span>Jun</span>
          </div>
        </Card>

        {/* Line Chart */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Revenue Trend</h2>
          <div className="h-64 relative">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <path
                d="M10,90 L20,70 L30,85 L40,60 L50,75 L60,50 L70,65 L80,40 L90,55 L100,30"
                fill="none"
                stroke="#3B82F6"
                strokeWidth="2"
                className="chart-line"
              />
            </svg>
          </div>
          <div className="flex justify-between mt-4 text-sm text-gray-500">
            <span>Q1</span>
            <span>Q2</span>
            <span>Q3</span>
            <span>Q4</span>
          </div>
        </Card>
      </div>
    </div>
  );
}