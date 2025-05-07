import { test, expect } from '@playwright/test'

test.describe('Sign In Page', () => {
  test('should sign in with valid credentials', async ({ page }) => {
    await page.goto('/signin')

    await page.getByPlaceholder('Email or Username').fill('test@example.com')
    await page.getByPlaceholder('Password').fill('test1234')

    await page.getByRole('button', { name: /sign in/i }).click()

    // Expect redirect to homepage
    await expect(page).toHaveURL('/')
  })

  test('should show alert on invalid credentials', async ({ page }) => {
    page.on('dialog', async (dialog) => {
      expect(dialog.message()).toMatch(/invalid/i)
      await dialog.dismiss()
    })

    await page.goto('/signin')

    await page.getByPlaceholder('Email or Username').fill('wrong@example.com')
    await page.getByPlaceholder('Password').fill('wrongpass')

    await page.getByRole('button', { name: /sign in/i }).click()
  })
})
