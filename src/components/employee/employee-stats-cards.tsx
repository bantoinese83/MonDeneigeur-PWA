import { Calendar, Clock, CheckCircle, XCircle } from 'lucide-react'

interface EmployeeStatsCardsProps {
  completedCount: number
  pendingCount: number
  totalCount: number
}

export function EmployeeStatsCards({ completedCount, pendingCount, totalCount }: EmployeeStatsCardsProps) {
  const stats = [
    {
      name: "Today's Tasks",
      value: totalCount,
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      name: "Completed",
      value: completedCount,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      name: "Pending",
      value: pendingCount,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      name: "Cancelled",
      value: 0,
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    }
  ]

  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <div key={stat.name} className="card">
            <div className="card-content">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    {stat.name}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor} ${stat.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
} 