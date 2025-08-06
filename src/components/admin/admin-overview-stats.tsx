import { Users, MapPin, Calendar, Clock, TrendingUp, AlertTriangle, ArrowUpRight, ArrowDownRight } from 'lucide-react'

interface AdminOverviewStatsProps {
  activeEmployeesCount: number
  todayVisitsCount: number
  completedVisitsCount: number
  pendingRoutesCount: number
  previousPeriod?: {
    activeEmployeesCount: number
    todayVisitsCount: number
    completedVisitsCount: number
    pendingRoutesCount: number
  }
}

export function AdminOverviewStats({
  activeEmployeesCount,
  todayVisitsCount,
  completedVisitsCount,
  pendingRoutesCount,
  previousPeriod
}: AdminOverviewStatsProps) {
  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0
    return ((current - previous) / previous) * 100
  }

  const getChangeIcon = (change: number) => {
    if (change > 0) return <ArrowUpRight className="h-4 w-4 text-green-500" />
    if (change < 0) return <ArrowDownRight className="h-4 w-4 text-red-500" />
    return null
  }

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600'
    if (change < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  const stats = [
    {
      title: 'Active Employees',
      value: activeEmployeesCount,
      icon: Users,
      color: 'blue',
      change: previousPeriod ? calculateChange(activeEmployeesCount, previousPeriod.activeEmployeesCount) : undefined
    },
    {
      title: "Today's Visits",
      value: todayVisitsCount,
      icon: Calendar,
      color: 'green',
      change: previousPeriod ? calculateChange(todayVisitsCount, previousPeriod.todayVisitsCount) : undefined
    },
    {
      title: 'Completed',
      value: completedVisitsCount,
      icon: Clock,
      color: 'yellow',
      change: previousPeriod ? calculateChange(completedVisitsCount, previousPeriod.completedVisitsCount) : undefined
    },
    {
      title: 'Pending Routes',
      value: pendingRoutesCount,
      icon: AlertTriangle,
      color: 'red',
      change: previousPeriod ? calculateChange(pendingRoutesCount, previousPeriod.pendingRoutesCount) : undefined
    }
  ]

  const getIconColor = (color: string) => {
    switch (color) {
      case 'blue': return 'text-blue-600 bg-blue-100'
      case 'green': return 'text-green-600 bg-green-100'
      case 'yellow': return 'text-yellow-600 bg-yellow-100'
      case 'red': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        const iconColorClass = getIconColor(stat.color)
        
        return (
          <div 
            key={stat.title}
            className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary-200 hover:scale-105"
          >
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="relative flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500 mb-1 group-hover:text-gray-700 transition-colors">
                  {stat.title}
                </p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold text-gray-900 group-hover:text-primary-700 transition-colors">
                    {stat.value.toLocaleString()}
                  </p>
                  {stat.change !== undefined && (
                    <div className={`flex items-center gap-1 text-sm font-medium ${getChangeColor(stat.change)}`}>
                      {getChangeIcon(stat.change)}
                      <span>{Math.abs(stat.change).toFixed(1)}%</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${iconColorClass} group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
            
            {/* Hover effect line */}
            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></div>
          </div>
        )
      })}
    </div>
  )
} 