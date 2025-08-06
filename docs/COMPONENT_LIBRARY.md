# Component Library

This document provides an overview of all reusable components in the MonDeneigeur PWA.

## Table of Contents

1. [Circular Calendar Widget](#circular-calendar-widget)
2. [Weather Widget](#weather-widget)
3. [Data Table](#data-table)
4. [Progress Indicators](#progress-indicators)
5. [Shared Components](#shared-components)

## Circular Calendar Widget

A sophisticated interactive calendar widget with real-time clock, weather integration, and activity tracking.

### Features

- **Real-time Analog Clock**: Live hour, minute, and second hands
- **Weather Integration**: Real-time weather data from OpenWeather API
- **Interactive Calendar Rings**: Rotating rings showing days, months, and dates
- **Activity Tracking**: Weekly activity bars with color-coded metrics
- **Responsive Design**: Adapts to different screen sizes
- **Smooth Animations**: Fluid transitions and hover effects

### Components

#### CircularCalendarWidget

The main widget component with configurable sizes and weather integration.

```tsx
import { CircularCalendarWidget } from '../components/shared/circular-calendar-widget'

<CircularCalendarWidget 
  size="md" // 'sm' | 'md' | 'lg'
  lat={45.5017} // Montreal coordinates
  lon={-73.5673}
  className="mx-auto"
/>
```

**Props:**
- `size`: Widget size - 'sm', 'md', or 'lg'
- `lat`: Latitude for weather data (default: Montreal)
- `lon`: Longitude for weather data (default: Montreal)
- `className`: Additional CSS classes

#### CircularCalendarBanner

A compact banner version for dashboard headers.

```tsx
import { CircularCalendarBanner } from '../components/shared/circular-calendar-banner'

<CircularCalendarBanner 
  lat={45.5017}
  lon={-73.5673}
  className="w-full"
/>
```

**Props:**
- `lat`: Latitude for weather data (default: Montreal)
- `lon`: Longitude for weather data (default: Montreal)
- `className`: Additional CSS classes

### Implementation Details

#### Clock Mechanics

The widget features a real-time analog clock with three hands:

```tsx
const [clockHands, setClockHands] = useState<ClockHands>({ 
  hours: 0, 
  minutes: 0, 
  seconds: 0 
})

// Update every second
useEffect(() => {
  const updateClock = () => {
    const now = new Date()
    setClockHands({
      hours: now.getHours() * 30 + (now.getMinutes() / 2),
      minutes: now.getMinutes() * 6,
      seconds: now.getSeconds() * 6
    })
  }
  
  updateClock()
  const interval = setInterval(updateClock, 1000)
  return () => clearInterval(interval)
}, [])
```

#### Calendar Rings

The widget uses three concentric rings:

1. **Day Numbers Ring** (Outermost): Shows dates 01-31
2. **Month Ring** (Middle): Shows month abbreviations JAN-DEC
3. **Day Names Ring** (Innermost): Shows day abbreviations MON-SUN

Each ring rotates to highlight the current date, month, and day.

#### Weather Integration

Uses the existing weather service to display real-time temperature:

```tsx
const { currentWeather } = useWeatherForLocation(lat, lon)

// Display temperature
{currentWeather ? `${Math.round(currentWeather.temperature)}°C` : '14°C'}
```

#### Activity Bars

Weekly activity tracking with color-coded bars:

```tsx
const generateWeekBars = () => {
  return ['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => ({
    day,
    height: Math.floor(Math.random() * 85) + 5,
    color: ['#FF3B30', '#FF9500', '#FFCC00', '#4CD964', '#5AC8FA', '#007AFF', '#5856D6'][index]
  }))
}
```

### Usage Examples

#### Dashboard Integration

```tsx
// In dashboard page
<div className="card mb-8">
  <div className="card-header">
    <h3 className="card-title">Calendar & Weather</h3>
    <p className="card-description">
      Interactive calendar with real-time weather information
    </p>
  </div>
  <div className="card-content">
    <div className="flex justify-center">
      <CircularCalendarWidget 
        size="md"
        className="mx-auto"
      />
    </div>
  </div>
</div>
```

#### Header Banner

```tsx
// In admin dashboard header
<div className="bg-white shadow-sm border-b">
  <div className="max-w-7xl mx-auto px-4 py-4">
    {/* Header content */}
    <CircularCalendarBanner className="w-full" />
  </div>
</div>
```

#### Mobile Optimization

```tsx
// For mobile devices
<CircularCalendarWidget 
  size="sm"
  className="mx-auto"
/>
```

### Weather Service Configuration

The widget requires the OpenWeather API key to be configured:

```env
VITE_OPENWEATHER_API_KEY=your_openweather_api_key
```

The weather service automatically falls back to mock data if the API is unavailable.

## Weather Widget

A comprehensive weather display component with current conditions, forecasts, and alerts.

### Features

- Current weather conditions
- 5-day forecast
- Weather alerts
- Service adjustment recommendations
- Responsive design

### Usage

```tsx
import { WeatherWidget } from '../components/shared/weather-widget'

<WeatherWidget 
  lat={45.5017}
  lon={-73.5673}
  showForecast={true}
  showAlerts={true}
  refreshable={true}
/>
```

## Data Table

A flexible data table component with sorting, pagination, and filtering.

### Features

- Sortable columns
- Pagination
- Search functionality
- Responsive design
- Custom cell renderers

### Usage

```tsx
import { DataTable } from '../components/shared/data-table'

<DataTable 
  data={data}
  columns={columns}
  pagination={true}
  search={true}
/>
```

## Progress Indicators

Various progress indicators for loading states and progress tracking.

### Components

- `Spinner3D`: 3D animated spinner
- `ProgressBar`: Linear progress bar
- `Skeleton`: Loading skeleton components

### Usage

```tsx
import { Spinner3D } from '../components/shared/3d-spinner'

<Spinner3D size="md" />
```

## Shared Components

### Error Boundary

Catches and displays errors gracefully.

### Empty State

Displays when no data is available.

### File Upload

Handles file uploads with drag-and-drop support.

### Language Switcher

Internationalization component for language switching.

### Notification Badge

Displays notification counts with badges.

### Privacy Consent

GDPR-compliant privacy consent component.

### Status Badge

Displays status indicators with color coding.

## Best Practices

1. **Consistent Styling**: Use the provided card and button classes
2. **Responsive Design**: Test on mobile and desktop
3. **Accessibility**: Include proper ARIA labels and keyboard navigation
4. **Performance**: Use React.memo for expensive components
5. **Error Handling**: Always provide fallback states
6. **TypeScript**: Use proper type definitions for all props

## Contributing

When adding new components:

1. Follow the existing naming conventions
2. Include proper TypeScript types
3. Add comprehensive documentation
4. Include usage examples
5. Test on multiple screen sizes
6. Ensure accessibility compliance 