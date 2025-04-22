import { Card } from "./card"
import { FiArrowUp } from "react-icons/fi"

interface MetricCardProps {
  title: string
  value: string | number
  trend: number
  icon: React.ReactNode
}

export function MetricCard({ title, value, trend, icon }: MetricCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-2 bg-gray-800 rounded-lg">
            {icon}
          </div>
          <div>
            <p className="text-sm text-gray-400">{title}</p>
            <h3 className="text-2xl font-semibold mt-1">{value}</h3>
          </div>
        </div>
        <div className={`flex items-center ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          <FiArrowUp className="w-4 h-4 mr-1" />
          <span className="text-sm font-medium">{Math.abs(trend)}%</span>
        </div>
      </div>
    </Card>
  )
} 