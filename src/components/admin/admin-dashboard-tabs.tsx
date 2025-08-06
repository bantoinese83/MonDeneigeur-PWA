import { Activity, MapPin, CloudSnow } from 'lucide-react'

interface Tab {
  id: 'overview' | 'tracking' | 'weather'
  label: string
  icon: any
}

interface AdminDashboardTabsProps {
  selectedTab: 'overview' | 'tracking' | 'weather'
  onTabChange: (tab: 'overview' | 'tracking' | 'weather') => void
}

export function AdminDashboardTabs({ selectedTab, onTabChange }: AdminDashboardTabsProps) {
  const tabs: Tab[] = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'tracking', label: 'Real-Time Tracking', icon: MapPin },
    { id: 'weather', label: 'Weather & Alerts', icon: CloudSnow }
  ]

  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
} 