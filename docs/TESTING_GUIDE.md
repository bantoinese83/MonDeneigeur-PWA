# MonDeneigeur PWA - Testing Guide

This document provides a comprehensive guide to testing the MonDeneigeur PWA, including unit testing, integration testing, E2E testing, and performance testing strategies.

## 📋 Table of Contents

- [Overview](#overview)
- [Testing Strategy](#testing-strategy)
- [Unit Testing](#unit-testing)
- [Integration Testing](#integration-testing)
- [E2E Testing](#e2e-testing)
- [Performance Testing](#performance-testing)
- [Security Testing](#security-testing)
- [Testing Tools](#testing-tools)
- [Best Practices](#best-practices)
- [CI/CD Integration](#cicd-integration)

## Overview

The MonDeneigeur PWA uses a comprehensive testing strategy with multiple layers:

- **Unit Tests**: Component and function testing with Vitest
- **Integration Tests**: Service layer and API testing
- **E2E Tests**: User workflow testing with Playwright
- **Performance Tests**: Web Vitals and bundle analysis
- **Security Tests**: Vulnerability scanning and penetration testing

## Testing Strategy

### Testing Pyramid

```
    E2E Tests (Few)
       /    \
      /      \
   Integration Tests (Some)
      /    \
     /      \
  Unit Tests (Many)
```

### Test Coverage Goals

- **Unit Tests**: 90%+ coverage
- **Integration Tests**: 80%+ coverage
- **E2E Tests**: Critical user flows
- **Performance Tests**: Core Web Vitals
- **Security Tests**: OWASP Top 10

## Unit Testing

### Setup

**Tools**: Vitest, React Testing Library, MSW

**Configuration**: `vitest.config.ts`

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/lib/test-setup.ts'],
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/lib/test-setup.ts',
        '**/*.d.ts',
        '**/*.config.*',
        '**/coverage/**'
      ]
    }
  }
})
```

### Component Testing

**Example**: Testing LoginForm component

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { LoginForm } from '@/components/auth/login-form'

// Mock Supabase
vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn()
    }
  }
}))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false }
  }
})

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      {children}
    </BrowserRouter>
  </QueryClientProvider>
)

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders login form correctly', () => {
    render(
      <TestWrapper>
        <LoginForm />
      </TestWrapper>
    )

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('validates required fields', async () => {
    render(
      <TestWrapper>
        <LoginForm />
      </TestWrapper>
    )

    const submitButton = screen.getByRole('button', { name: /sign in/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument()
      expect(screen.getByText(/password is required/i)).toBeInTheDocument()
    })
  })

  it('validates email format', async () => {
    render(
      <TestWrapper>
        <LoginForm />
      </TestWrapper>
    )

    const emailInput = screen.getByLabelText(/email/i)
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } })

    const submitButton = screen.getByRole('button', { name: /sign in/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument()
    })
  })

  it('handles successful login', async () => {
    const mockSignIn = vi.fn().mockResolvedValue({
      data: { user: { id: '123', email: 'test@example.com' } },
      error: null
    })

    vi.mocked(supabase.auth.signInWithPassword).mockImplementation(mockSignIn)

    render(
      <TestWrapper>
        <LoginForm onSuccess={vi.fn()} />
      </TestWrapper>
    )

    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })

    const submitButton = screen.getByRole('button', { name: /sign in/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      })
    })
  })
})
```

### Service Testing

**Example**: Testing AuthService

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AuthService } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

vi.mock('@/lib/supabase')

describe('AuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        user_metadata: { role: 'admin' }
      }

      const mockSignIn = vi.fn().mockResolvedValue({
        data: { user: mockUser },
        error: null
      })

      vi.mocked(supabase.auth.signInWithPassword).mockImplementation(mockSignIn)

      const result = await AuthService.login({
        email: 'test@example.com',
        password: 'password123'
      })

      expect(result).toEqual({
        id: '123',
        email: 'test@example.com',
        role: 'admin'
      })
    })

    it('should throw error with invalid credentials', async () => {
      const mockSignIn = vi.fn().mockResolvedValue({
        data: { user: null },
        error: { message: 'Invalid credentials' }
      })

      vi.mocked(supabase.auth.signInWithPassword).mockImplementation(mockSignIn)

      await expect(
        AuthService.login({
          email: 'invalid@example.com',
          password: 'wrongpassword'
        })
      ).rejects.toThrow('Invalid credentials')
    })
  })
})
```

### Hook Testing

**Example**: Testing custom hooks

```typescript
import { describe, it, expect, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEmployees } from '@/hooks/use-employees'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false }
  }
})

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
)

describe('useEmployees', () => {
  it('should fetch employees successfully', async () => {
    const mockEmployees = [
      { id: '1', name: 'John Doe', position: 'Driver' },
      { id: '2', name: 'Jane Smith', position: 'Operator' }
    ]

    vi.mock('@/lib/services/employee-service', () => ({
      EmployeeService: {
        getAll: vi.fn().mockResolvedValue(mockEmployees)
      }
    }))

    const { result } = renderHook(() => useEmployees(), {
      wrapper: TestWrapper
    })

    await waitFor(() => {
      expect(result.current.data).toEqual(mockEmployees)
      expect(result.current.isLoading).toBe(false)
    })
  })
})
```

## Integration Testing

### API Testing

**Example**: Testing service layer with MSW

```typescript
import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest'
import { setupServer } from 'msw/node'
import { rest } from 'msw'
import { EmployeeService } from '@/lib/services/employee-service'

const server = setupServer(
  rest.get('/api/employees', (req, res, ctx) => {
    return res(
      ctx.json([
        { id: '1', name: 'John Doe', position: 'Driver' },
        { id: '2', name: 'Jane Smith', position: 'Operator' }
      ])
    )
  }),
  
  rest.post('/api/employees', (req, res, ctx) => {
    return res(
      ctx.json({ id: '3', name: 'New Employee', position: 'Driver' })
    )
  })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('EmployeeService Integration', () => {
  it('should fetch employees from API', async () => {
    const employees = await EmployeeService.getAll()
    
    expect(employees).toHaveLength(2)
    expect(employees[0].name).toBe('John Doe')
  })

  it('should create new employee', async () => {
    const newEmployee = await EmployeeService.create({
      name: 'New Employee',
      position: 'Driver'
    })
    
    expect(newEmployee.id).toBe('3')
    expect(newEmployee.name).toBe('New Employee')
  })
})
```

### Database Testing

**Example**: Testing with test database

```typescript
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { createClient } from '@supabase/supabase-js'

const testSupabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
)

describe('Database Integration', () => {
  beforeAll(async () => {
    // Setup test data
    await testSupabase.from('companies').insert({
      id: 'test-company-id',
      name: 'Test Company'
    })
  })

  afterAll(async () => {
    // Cleanup test data
    await testSupabase.from('companies').delete().eq('id', 'test-company-id')
  })

  it('should create and retrieve employee', async () => {
    const employee = await testSupabase.from('employees').insert({
      profile_id: 'test-profile-id',
      company_id: 'test-company-id',
      position: 'Test Driver'
    }).select().single()

    expect(employee.position).toBe('Test Driver')

    const retrieved = await testSupabase
      .from('employees')
      .select()
      .eq('id', employee.id)
      .single()

    expect(retrieved.position).toBe('Test Driver')
  })
})
```

## E2E Testing

### Setup

**Tools**: Playwright

**Configuration**: `playwright.config.ts`

```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] }
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] }
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] }
    }
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000
  }
})
```

### Authentication Flow Testing

```typescript
import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
  })

  test('should display login form', async ({ page }) => {
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/password/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible()
  })

  test('should validate required fields', async ({ page }) => {
    const submitButton = page.getByRole('button', { name: /sign in/i })
    await submitButton.click()

    await expect(page.getByText(/email is required/i)).toBeVisible()
    await expect(page.getByText(/password is required/i)).toBeVisible()
  })

  test('should validate email format', async ({ page }) => {
    const emailInput = page.getByLabel(/email/i)
    await emailInput.fill('invalid-email')

    const submitButton = page.getByRole('button', { name: /sign in/i })
    await submitButton.click()

    await expect(page.getByText(/invalid email/i)).toBeVisible()
  })

  test('should handle successful login', async ({ page }) => {
    const emailInput = page.getByLabel(/email/i)
    const passwordInput = page.getByLabel(/password/i)

    await emailInput.fill('b.antoine.se@gmail.com')
    await passwordInput.fill('123456789')

    const submitButton = page.getByRole('button', { name: /sign in/i })
    await submitButton.click()

    // Should redirect to dashboard after successful login
    await expect(page).toHaveURL('/dashboard')
  })

  test('should handle login errors', async ({ page }) => {
    const emailInput = page.getByLabel(/email/i)
    const passwordInput = page.getByLabel(/password/i)

    await emailInput.fill('invalid@example.com')
    await passwordInput.fill('wrongpassword')

    const submitButton = page.getByRole('button', { name: /sign in/i })
    await submitButton.click()

    // Should show error message
    await expect(page.getByText(/invalid credentials/i)).toBeVisible()
  })
})
```

### Admin Dashboard Testing

```typescript
import { test, expect } from '@playwright/test'

test.describe('Admin Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin
    await page.goto('/login')
    await page.getByLabel(/email/i).fill('admin@example.com')
    await page.getByLabel(/password/i).fill('password123')
    await page.getByRole('button', { name: /sign in/i }).click()
    await expect(page).toHaveURL('/dashboard')
  })

  test('should display admin dashboard', async ({ page }) => {
    await expect(page.getByText(/admin dashboard/i)).toBeVisible()
    await expect(page.getByText(/employees/i)).toBeVisible()
    await expect(page.getByText(/clients/i)).toBeVisible()
    await expect(page.getByText(/contracts/i)).toBeVisible()
  })

  test('should navigate to employees page', async ({ page }) => {
    await page.getByText(/employees/i).click()
    await expect(page).toHaveURL('/employees')
    await expect(page.getByText(/add employee/i)).toBeVisible()
  })

  test('should create new employee', async ({ page }) => {
    await page.goto('/employees')
    await page.getByRole('button', { name: /add employee/i }).click()
    
    await page.getByLabel(/full name/i).fill('John Doe')
    await page.getByLabel(/email/i).fill('john@example.com')
    await page.getByLabel(/position/i).fill('Driver')
    await page.getByRole('button', { name: /save/i }).click()
    
    await expect(page.getByText(/employee created successfully/i)).toBeVisible()
  })
})
```

### Employee PWA Testing

```typescript
import { test, expect } from '@playwright/test'

test.describe('Employee PWA', () => {
  test.beforeEach(async ({ page }) => {
    // Login as employee
    await page.goto('/login')
    await page.getByLabel(/email/i).fill('employee@example.com')
    await page.getByLabel(/password/i).fill('password123')
    await page.getByRole('button', { name: /sign in/i }).click()
    await expect(page).toHaveURL('/employee/dashboard')
  })

  test('should display employee dashboard', async ({ page }) => {
    await expect(page.getByText(/employee dashboard/i)).toBeVisible()
    await expect(page.getByText(/today's tasks/i)).toBeVisible()
  })

  test('should start route', async ({ page }) => {
    await page.getByRole('button', { name: /start route/i }).click()
    await expect(page.getByText(/route started/i)).toBeVisible()
  })

  test('should complete task', async ({ page }) => {
    await page.getByRole('button', { name: /complete task/i }).first().click()
    await expect(page.getByText(/task completed/i)).toBeVisible()
  })
})
```

## Performance Testing

### Web Vitals Testing

```typescript
import { test, expect } from '@playwright/test'

test.describe('Performance', () => {
  test('should meet Core Web Vitals', async ({ page }) => {
    const response = await page.goto('/')
    
    // Measure LCP
    const lcp = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1]
          resolve(lastEntry.startTime)
        }).observe({ entryTypes: ['largest-contentful-paint'] })
      })
    })
    
    expect(lcp).toBeLessThan(2500) // LCP should be under 2.5s
    
    // Measure FID
    const fid = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const firstEntry = entries[0]
          resolve(firstEntry.processingStart - firstEntry.startTime)
        }).observe({ entryTypes: ['first-input'] })
      })
    })
    
    expect(fid).toBeLessThan(100) // FID should be under 100ms
  })
})
```

### Bundle Analysis

```bash
# Analyze bundle size
npm run build:analyze

# Check bundle size limits
npm run build
npx vite-bundle-analyzer dist
```

### Load Testing

```typescript
import { test, expect } from '@playwright/test'

test.describe('Load Testing', () => {
  test('should handle concurrent users', async ({ browser }) => {
    const contexts = []
    const promises = []
    
    // Create multiple browser contexts
    for (let i = 0; i < 10; i++) {
      const context = await browser.newContext()
      const page = await context.newPage()
      contexts.push(context)
      
      promises.push(
        page.goto('/').then(() => 
          expect(page.getByText(/dashboard/i)).toBeVisible()
        )
      )
    }
    
    // Wait for all pages to load
    await Promise.all(promises)
    
    // Cleanup
    await Promise.all(contexts.map(context => context.close()))
  })
})
```

## Security Testing

### Vulnerability Scanning

```bash
# Run security audit
npm audit

# Run OWASP ZAP scan
zap-baseline.py -t https://your-app.vercel.app

# Run Snyk security scan
npx snyk test
```

### XSS Testing

```typescript
import { test, expect } from '@playwright/test'

test.describe('Security', () => {
  test('should prevent XSS attacks', async ({ page }) => {
    await page.goto('/employees')
    await page.getByRole('button', { name: /add employee/i }).click()
    
    // Try to inject script
    await page.getByLabel(/full name/i).fill('<script>alert("xss")</script>')
    await page.getByRole('button', { name: /save/i }).click()
    
    // Should not execute script
    const alertPromise = page.waitForEvent('dialog')
    await page.reload()
    const alert = await alertPromise
    expect(alert).toBeNull()
  })
})
```

### Authentication Testing

```typescript
import { test, expect } from '@playwright/test'

test.describe('Authentication Security', () => {
  test('should prevent unauthorized access', async ({ page }) => {
    // Try to access admin page without login
    await page.goto('/admin/dashboard')
    await expect(page).toHaveURL('/login')
  })

  test('should prevent role escalation', async ({ page }) => {
    // Login as employee
    await page.goto('/login')
    await page.getByLabel(/email/i).fill('employee@example.com')
    await page.getByLabel(/password/i).fill('password123')
    await page.getByRole('button', { name: /sign in/i }).click()
    
    // Try to access admin page
    await page.goto('/admin/dashboard')
    await expect(page).toHaveURL('/dashboard')
  })
})
```

## Testing Tools

### Test Setup

**File**: `src/lib/test-setup.ts`

```typescript
import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}))

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}))

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn()
  }))
})

// Mock Geolocation API
Object.defineProperty(navigator, 'geolocation', {
  value: {
    getCurrentPosition: vi.fn(),
    watchPosition: vi.fn(),
    clearWatch: vi.fn()
  }
})

// Mock Service Worker
Object.defineProperty(navigator, 'serviceWorker', {
  value: {
    register: vi.fn(),
    getRegistration: vi.fn(),
    getRegistrations: vi.fn()
  }
})
```

### Test Utilities

**File**: `src/lib/test-utils.ts`

```typescript
import { render, RenderOptions } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactElement } from 'react'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false }
  }
})

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }
```

## Best Practices

### Test Organization

1. **Feature-based**: Group tests by feature
2. **Clear naming**: Use descriptive test names
3. **Setup/teardown**: Use beforeEach/afterEach hooks
4. **Isolation**: Each test should be independent
5. **Mocking**: Mock external dependencies

### Test Data Management

```typescript
// Test data factories
export const createMockEmployee = (overrides = {}) => ({
  id: 'test-employee-id',
  name: 'John Doe',
  email: 'john@example.com',
  position: 'Driver',
  status: 'active',
  ...overrides
})

export const createMockCompany = (overrides = {}) => ({
  id: 'test-company-id',
  name: 'Test Company',
  address: '123 Test St',
  phone: '555-1234',
  email: 'test@company.com',
  ...overrides
})
```

### Accessibility Testing

```typescript
import { test, expect } from '@playwright/test'

test.describe('Accessibility', () => {
  test('should meet WCAG guidelines', async ({ page }) => {
    await page.goto('/')
    
    // Check for proper heading structure
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all()
    expect(headings.length).toBeGreaterThan(0)
    
    // Check for alt text on images
    const images = await page.locator('img').all()
    for (const img of images) {
      const alt = await img.getAttribute('alt')
      expect(alt).toBeTruthy()
    }
    
    // Check for proper form labels
    const inputs = await page.locator('input, select, textarea').all()
    for (const input of inputs) {
      const label = await input.getAttribute('aria-label') || 
                   await input.getAttribute('id')
      expect(label).toBeTruthy()
    }
  })
})
```

### Performance Testing

```typescript
import { test, expect } from '@playwright/test'

test.describe('Performance', () => {
  test('should load within performance budget', async ({ page }) => {
    const startTime = Date.now()
    await page.goto('/')
    const loadTime = Date.now() - startTime
    
    expect(loadTime).toBeLessThan(3000) // 3 seconds budget
  })
  
  test('should have acceptable bundle size', async ({ page }) => {
    const response = await page.goto('/')
    const contentLength = response.headers()['content-length']
    
    expect(parseInt(contentLength || '0')).toBeLessThan(500000) // 500KB budget
  })
})
```

## CI/CD Integration

### GitHub Actions

**File**: `.github/workflows/test.yml`

```yaml
name: Test

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linting
        run: npm run lint
      
      - name: Run type checking
        run: npm run type-check
      
      - name: Run unit tests
        run: npm run test:coverage
      
      - name: Run E2E tests
        run: npm run test:e2e
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
      
      - name: Upload test results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: test-results
          path: test-results/
```

### Pre-commit Hooks

**File**: `.husky/pre-commit`

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npm run lint
npm run type-check
npm run test
```

### Test Commands

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:all": "npm run test && npm run test:e2e",
    "test:ci": "npm run lint && npm run type-check && npm run test:coverage && npm run test:e2e"
  }
}
```

---

**MonDeneigeur PWA** - Comprehensive testing guide for production-ready applications. 