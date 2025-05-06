'use client';

import { Card } from "../components/ui/card"
import { MetricCard } from "../components/ui/metric-card"
import { PerformanceChart } from "../components/ui/performance-chart"
import { Button } from "../components/ui/button"
import { 
  FiBarChart2,
  FiUser,
  FiTrendingUp,
  FiPlay
} from "react-icons/fi"
import SocialMediaPlatforms from '@/components/profile/SocialMediaPlatforms';

// Mock data for charts
const viewsData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Views',
      data: [1200, 1900, 3000, 5000, 4000, 6000],
      borderColor: 'rgb(99, 102, 241)',
      backgroundColor: 'rgba(99, 102, 241, 0.5)',
    },
  ],
}

const engagementData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Engagement Rate',
      data: [3.2, 3.5, 3.8, 4.1, 4.3, 4.7],
      borderColor: 'rgb(34, 197, 94)',
      backgroundColor: 'rgba(34, 197, 94, 0.5)',
    },
  ],
}

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Dashboard</h1>
      </div>

      {/* Hero Section */}
      <Card className="p-8 bg-gradient-to-r from-[#111111] to-[#1a2e1b]">
        <h2 className="text-3xl font-bold mb-4">Welcome to Creator Compass</h2>
        <p className="text-gray-300 mb-6 max-w-2xl">
          Your all-in-one platform for planning, creating, and analyzing your social media content. 
          Connect your TikTok account to unlock analytics and AI-powered recommendations.
        </p>
        <div className="flex space-x-4">
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            Connect TikTok
          </Button>
          <Button variant="outline" className="border-gray-600 hover:bg-gray-800">
            <FiPlay className="w-5 h-5 mr-2" />
            Watch Tutorial
          </Button>
        </div>
      </Card>

      {/* Social Media Platforms Section */}
      <Card className="p-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Plataformas Conectadas</h2>
        </div>
        <SocialMediaPlatforms />
        <p className="mt-4 text-sm text-gray-400">
          Conecta tus cuentas de redes sociales para habilitar la gestión y análisis de contenido multiplataforma.
        </p>
      </Card>

      {/* Metrics Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Total Posts"
          value="127"
          trend={8.2}
          icon={<FiBarChart2 className="w-6 h-6 text-indigo-500" />}
        />
        <MetricCard
          title="Avg. Engagement Rate"
          value="4.7%"
          trend={1.3}
          icon={<FiTrendingUp className="w-6 h-6 text-green-500" />}
        />
        <MetricCard
          title="Total Followers"
          value="24.3K"
          trend={2.7}
          icon={<FiUser className="w-6 h-6 text-blue-500" />}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PerformanceChart title="Views Performance" data={viewsData} />
        <PerformanceChart title="Engagement Rate" data={engagementData} />
      </div>
    </div>
  )
}