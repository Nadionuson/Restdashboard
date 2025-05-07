import { test, expect } from '@playwright/test'

test.describe('Sign Up Flow', () => {
  test('should sign up with valid data', async ({ page }) => {
    // Go to the signup page
    await page.goto('/signup')

    // Define test data
    const email = 'test+${timestamp}@example.com'
    const username = 'user${timestamp}'
    const password = 'test1234'

    // Fill out the signup form
    await page.fill('input[placeholder="Email"]', email)
    await page.fill('input[placeholder="Username"]', username)
    await page.fill('input[placeholder="Password"]', password)

    // Submit the form
    await page.click('button[type="submit"]')

    // Verify successful redirection to the sign-in page
    await expect(page).toHaveURL('/signin')

    // Optionally, verify that the page contains a success message or confirmation (if any)
    await expect(page.locator('h1')).toHaveText('Sign In') // Confirmed we're on the signin page
  })

  test('should show username suggestions if username is taken', async ({ page }) => {
    // Go to the signup page
    await page.goto('/signup')

    // Define test data with a taken username
    const email = 'signupexistingusertest@example.com'
    const username = 'signuptest'  // Assume this username is already taken
    const password = 'test1234'

    // Fill out the signup form
    await page.fill('input[placeholder="Email"]', email)
    await page.fill('input[placeholder="Username"]', username)
    await page.fill('input[placeholder="Password"]', password)

    // Submit the form
    await page.click('button[type="submit"]')

    // Wait for the username suggestions to appear
    const suggestions = await page.locator('.text-yellow-400').isVisible()
    expect(suggestions).toBeTruthy() // Check if the suggestions are visible

    // Optionally, you can also test if any suggestions are clickable:
    const suggestionButtons = page.locator('.text-yellow-400 button')
    await expect(suggestionButtons).toHaveCount(3) // Assuming 3 suggestions are provided
  })
})
