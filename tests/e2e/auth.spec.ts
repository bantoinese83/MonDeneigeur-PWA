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

  test('should validate password length', async ({ page }) => {
    const emailInput = page.getByLabel(/email/i)
    const passwordInput = page.getByLabel(/password/i)

    await emailInput.fill('test@example.com')
    await passwordInput.fill('123')

    const submitButton = page.getByRole('button', { name: /sign in/i })
    await submitButton.click()

    await expect(page.getByText(/password must be at least 6 characters/i)).toBeVisible()
  })

  test('should navigate to register page', async ({ page }) => {
    const registerLink = page.getByRole('link', { name: /sign up/i })
    await registerLink.click()

    await expect(page).toHaveURL('/register')
    await expect(page.getByText(/create account/i)).toBeVisible()
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

test.describe('Registration Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/register')
  })

  test('should display registration form', async ({ page }) => {
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/password/i)).toBeVisible()
    await expect(page.getByLabel(/confirm password/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /sign up/i })).toBeVisible()
  })

  test('should validate password confirmation', async ({ page }) => {
    const emailInput = page.getByLabel(/email/i)
    const passwordInput = page.getByLabel(/password/i)
    const confirmPasswordInput = page.getByLabel(/confirm password/i)

    await emailInput.fill('test@example.com')
    await passwordInput.fill('123456789')
    await confirmPasswordInput.fill('differentpassword')

    const submitButton = page.getByRole('button', { name: /sign up/i })
    await submitButton.click()

    await expect(page.getByText(/passwords do not match/i)).toBeVisible()
  })

  test('should navigate to login page', async ({ page }) => {
    const loginLink = page.getByRole('link', { name: /sign in/i })
    await loginLink.click()

    await expect(page).toHaveURL('/login')
    await expect(page.getByText(/welcome back/i)).toBeVisible()
  })
}) 