# MonDeneigeur PWA - Contributing Guide

This document provides guidelines for contributing to the MonDeneigeur PWA project, including development setup, coding standards, and contribution workflow.

## 📋 Table of Contents

- [Overview](#overview)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Code Review Guidelines](#code-review-guidelines)
- [Documentation](#documentation)
- [Release Process](#release-process)
- [Community Guidelines](#community-guidelines)

## Overview

We welcome contributions to the MonDeneigeur PWA project! This guide will help you get started with contributing to our codebase.

### Types of Contributions

- **Bug Fixes**: Fix issues and bugs
- **Feature Development**: Add new features
- **Documentation**: Improve documentation
- **Testing**: Add or improve tests
- **Performance**: Optimize performance
- **Security**: Improve security measures

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Git
- Supabase account (for development)
- OpenWeather API key (for weather features)

### Fork and Clone

1. **Fork the repository**
   ```bash
   # Fork on GitHub, then clone your fork
   git clone https://github.com/your-username/mondeneigeur-pwa.git
   cd mondeneigeur-pwa
   ```

2. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/original-owner/mondeneigeur-pwa.git
   ```

3. **Create a development branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Setup

### Environment Configuration

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

### Database Setup

1. **Create Supabase project**
   - Go to [Supabase](https://supabase.com)
   - Create a new project
   - Get your project URL and anon key

2. **Run database migrations**
   ```bash
   # Apply database schema
   npm run db:migrate
   ```

3. **Seed development data**
   ```bash
   npm run db:seed
   ```

### Testing Setup

1. **Run unit tests**
   ```bash
   npm run test
   ```

2. **Run E2E tests**
   ```bash
   npm run test:e2e
   ```

3. **Check code coverage**
   ```bash
   npm run test:coverage
   ```

## Coding Standards

### TypeScript Guidelines

**File Naming**:
- Use kebab-case for file names: `user-profile.tsx`
- Use PascalCase for component names: `UserProfile`
- Use camelCase for function names: `getUserData`

**Type Definitions**:
```typescript
// Always define interfaces for props
interface UserProfileProps {
  userId: string
  onUpdate?: (user: User) => void
  className?: string
}

// Use type aliases for complex types
type UserRole = 'superadmin' | 'admin' | 'employee' | 'client'

// Use enums for constants
enum Status {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending'
}
```

**Component Structure**:
```typescript
import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { UserService } from '@/lib/services/user-service'
import type { User } from '@/lib/types'

interface UserProfileProps {
  userId: string
  onUpdate?: (user: User) => void
}

export function UserProfile({ userId, onUpdate }: UserProfileProps) {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => UserService.getById(userId)
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading user</div>

  return (
    <div className="user-profile">
      <h2>{user?.name}</h2>
      {/* Component content */}
    </div>
  )
}
```

### React Guidelines

**Hooks Usage**:
```typescript
// Custom hooks should start with 'use'
export function useUser(userId: string) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => UserService.getById(userId)
  })
}

// Use proper dependency arrays
useEffect(() => {
  // Effect logic
}, [dependency1, dependency2])
```

**State Management**:
```typescript
// Use Zustand for global state
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: async (credentials) => {
    // Login logic
  }
}))

// Use local state for component-specific state
const [isOpen, setIsOpen] = useState(false)
```

### CSS Guidelines

**Tailwind CSS**:
```typescript
// Use Tailwind utility classes
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
  <h1 className="text-2xl font-bold text-gray-900">Title</h1>
  <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
    Action
  </button>
</div>

// Create custom components for repeated patterns
function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      {children}
    </div>
  )
}
```

### File Organization

**Project Structure**:
```
src/
├── components/          # React components
│   ├── auth/           # Authentication components
│   ├── layout/         # Layout components
│   ├── shared/         # Shared components
│   ├── admin/          # Admin-specific components
│   ├── employee/       # Employee-specific components
│   └── client/         # Client-specific components
├── lib/                # Core utilities
│   ├── services/       # Service layer
│   ├── hooks/          # Custom hooks
│   ├── validation/     # Zod schemas
│   └── utils/          # Utility functions
├── pages/              # Page components
├── stores/             # State management
├── types/              # TypeScript types
└── styles/             # CSS styles
```

## Testing Guidelines

### Unit Testing

**Component Testing**:
```typescript
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { UserProfile } from '@/components/user-profile'

describe('UserProfile', () => {
  it('renders user information correctly', () => {
    const mockUser = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com'
    }

    render(<UserProfile user={mockUser} />)

    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('john@example.com')).toBeInTheDocument()
  })

  it('calls onUpdate when edit button is clicked', () => {
    const mockOnUpdate = vi.fn()
    const mockUser = { id: '1', name: 'John Doe' }

    render(<UserProfile user={mockUser} onUpdate={mockOnUpdate} />)

    fireEvent.click(screen.getByRole('button', { name: /edit/i }))

    expect(mockOnUpdate).toHaveBeenCalledWith(mockUser)
  })
})
```

**Service Testing**:
```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { UserService } from '@/lib/services/user-service'
import { supabase } from '@/lib/supabase'

vi.mock('@/lib/supabase')

describe('UserService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches user by ID', async () => {
    const mockUser = { id: '1', name: 'John Doe' }
    const mockQuery = vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({ data: mockUser, error: null })
      })
    })

    vi.mocked(supabase.from).mockReturnValue(mockQuery as any)

    const result = await UserService.getById('1')

    expect(result).toEqual(mockUser)
  })
})
```

### Integration Testing

**API Testing**:
```typescript
import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest'
import { setupServer } from 'msw/node'
import { rest } from 'msw'
import { UserService } from '@/lib/services/user-service'

const server = setupServer(
  rest.get('/api/users/:id', (req, res, ctx) => {
    return res(
      ctx.json({
        id: req.params.id,
        name: 'John Doe',
        email: 'john@example.com'
      })
    )
  })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('UserService Integration', () => {
  it('fetches user from API', async () => {
    const user = await UserService.getById('1')
    
    expect(user.name).toBe('John Doe')
    expect(user.email).toBe('john@example.com')
  })
})
```

### E2E Testing

**User Flow Testing**:
```typescript
import { test, expect } from '@playwright/test'

test.describe('User Authentication', () => {
  test('should login successfully', async ({ page }) => {
    await page.goto('/login')
    
    await page.getByLabel(/email/i).fill('test@example.com')
    await page.getByLabel(/password/i).fill('password123')
    await page.getByRole('button', { name: /sign in/i }).click()
    
    await expect(page).toHaveURL('/dashboard')
    await expect(page.getByText(/welcome/i)).toBeVisible()
  })

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/login')
    
    await page.getByLabel(/email/i).fill('invalid@example.com')
    await page.getByLabel(/password/i).fill('wrongpassword')
    await page.getByRole('button', { name: /sign in/i }).click()
    
    await expect(page.getByText(/invalid credentials/i)).toBeVisible()
  })
})
```

## Pull Request Process

### Creating a Pull Request

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write code
   - Add tests
   - Update documentation

3. **Run tests and checks**
   ```bash
   npm run lint
   npm run type-check
   npm run test
   npm run test:e2e
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add user profile feature"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Go to your fork on GitHub
   - Click "New Pull Request"
   - Fill out the PR template

### Pull Request Template

```markdown
## Description
Brief description of the changes made.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] E2E tests added/updated
- [ ] All tests pass

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No console errors
- [ ] No TypeScript errors

## Screenshots (if applicable)
Add screenshots for UI changes.

## Additional Notes
Any additional information or context.
```

## Code Review Guidelines

### Review Process

1. **Automated Checks**
   - CI/CD pipeline runs tests
   - Code coverage is checked
   - Linting and type checking

2. **Manual Review**
   - At least one maintainer reviews
   - Code quality assessment
   - Security review for sensitive changes

3. **Review Criteria**
   - Code quality and readability
   - Test coverage
   - Performance impact
   - Security considerations
   - Documentation updates

### Review Comments

**Be Constructive**:
```markdown
# Good comment
Consider extracting this logic into a custom hook for reusability:
```typescript
export function useUserData(userId: string) {
  // Hook implementation
}
```

# Bad comment
This code is wrong.
```

**Ask Questions**:
```markdown
Could you explain the reasoning behind this approach?
Have you considered the performance implications?
```

## Documentation

### Code Documentation

**JSDoc Comments**:
```typescript
/**
 * Fetches user data by ID
 * @param userId - The unique identifier of the user
 * @returns Promise resolving to user data
 * @throws {Error} When user is not found
 */
export async function getUserById(userId: string): Promise<User> {
  // Implementation
}
```

**Component Documentation**:
```typescript
/**
 * UserProfile component displays user information
 * 
 * @example
 * ```tsx
 * <UserProfile 
 *   userId="123" 
 *   onUpdate={handleUpdate} 
 * />
 * ```
 */
export function UserProfile({ userId, onUpdate }: UserProfileProps) {
  // Component implementation
}
```

### README Updates

**When to Update README**:
- New features added
- API changes
- Configuration changes
- Breaking changes

**README Sections**:
- Feature description
- Installation instructions
- Usage examples
- Configuration options
- Troubleshooting

## Release Process

### Version Management

**Semantic Versioning**:
- `MAJOR.MINOR.PATCH`
- `1.0.0` - Initial release
- `1.1.0` - New features
- `1.1.1` - Bug fixes

**Release Branches**:
- `main` - Production code
- `develop` - Development code
- `feature/*` - Feature branches
- `hotfix/*` - Hotfix branches

### Release Checklist

1. **Pre-release**
   - [ ] All tests pass
   - [ ] Documentation updated
   - [ ] Changelog updated
   - [ ] Version bumped

2. **Release**
   - [ ] Create release tag
   - [ ] Deploy to staging
   - [ ] Run smoke tests
   - [ ] Deploy to production

3. **Post-release**
   - [ ] Monitor for issues
   - [ ] Update documentation
   - [ ] Communicate changes

## Community Guidelines

### Code of Conduct

**Be Respectful**:
- Treat others with respect
- Be open to different viewpoints
- Provide constructive feedback

**Be Inclusive**:
- Welcome contributors of all backgrounds
- Use inclusive language
- Create a safe environment

**Be Professional**:
- Follow project guidelines
- Communicate clearly
- Be patient with newcomers

### Communication

**GitHub Issues**:
- Use issue templates
- Provide clear descriptions
- Include reproduction steps
- Tag issues appropriately

**Discussions**:
- Ask questions in discussions
- Share ideas and proposals
- Help other contributors
- Be supportive

### Getting Help

**Resources**:
- Project documentation
- GitHub discussions
- Issue tracker
- Community chat

**Asking Questions**:
- Search existing issues first
- Provide context and details
- Be specific about your problem
- Show what you've tried

---

**MonDeneigeur PWA** - Comprehensive contributing guide for collaborative development. 