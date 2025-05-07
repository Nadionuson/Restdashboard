# Test info

- Name: Sign Up Flow >> should show username suggestions if username is taken
- Location: C:\Users\inesf\restaurant-dashboard\tests\e2e\signup.test.ts:28:7

# Error details

```
Error: expect(received).toBeTruthy()

Received: false
    at C:\Users\inesf\restaurant-dashboard\tests\e2e\signup.test.ts:47:25
```

# Page snapshot

```yaml
- heading "Sign Up" [level=1]
- textbox "Email": signupexistingusertest@example.com
- textbox "Username": signuptest
- textbox "Password": test1234
- paragraph: "Username is taken. Try one of these:"
- button "gtinsuestp"
- button "gsstnpiteu"
- button "ssueingptt"
- button "Create Account"
- paragraph:
  - text: Already have an account?
  - link "Sign in":
    - /url: /signin
- button "Open Next.js Dev Tools":
  - img
- button "Open issues overlay": 1 Issue
- button "Collapse issues badge":
  - img
- alert
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test'
   2 |
   3 | test.describe('Sign Up Flow', () => {
   4 |   test('should sign up with valid data', async ({ page }) => {
   5 |     // Go to the signup page
   6 |     await page.goto('/signup')
   7 |
   8 |     // Define test data
   9 |     const email = 'signuptest@example.com'
  10 |     const username = 'signuptest'
  11 |     const password = 'test1234'
  12 |
  13 |     // Fill out the signup form
  14 |     await page.fill('input[placeholder="Email"]', email)
  15 |     await page.fill('input[placeholder="Username"]', username)
  16 |     await page.fill('input[placeholder="Password"]', password)
  17 |
  18 |     // Submit the form
  19 |     await page.click('button[type="submit"]')
  20 |
  21 |     // Verify successful redirection to the sign-in page
  22 |     await expect(page).toHaveURL('/signin')
  23 |
  24 |     // Optionally, verify that the page contains a success message or confirmation (if any)
  25 |     await expect(page.locator('h1')).toHaveText('Sign In') // Confirmed we're on the signin page
  26 |   })
  27 |
  28 |   test('should show username suggestions if username is taken', async ({ page }) => {
  29 |     // Go to the signup page
  30 |     await page.goto('/signup')
  31 |
  32 |     // Define test data with a taken username
  33 |     const email = 'signupexistingusertest@example.com'
  34 |     const username = 'signuptest'  // Assume this username is already taken
  35 |     const password = 'test1234'
  36 |
  37 |     // Fill out the signup form
  38 |     await page.fill('input[placeholder="Email"]', email)
  39 |     await page.fill('input[placeholder="Username"]', username)
  40 |     await page.fill('input[placeholder="Password"]', password)
  41 |
  42 |     // Submit the form
  43 |     await page.click('button[type="submit"]')
  44 |
  45 |     // Wait for the username suggestions to appear
  46 |     const suggestions = await page.locator('.text-yellow-400').isVisible()
> 47 |     expect(suggestions).toBeTruthy() // Check if the suggestions are visible
     |                         ^ Error: expect(received).toBeTruthy()
  48 |
  49 |     // Optionally, you can also test if any suggestions are clickable:
  50 |     const suggestionButtons = page.locator('.text-yellow-400 button')
  51 |     await expect(suggestionButtons).toHaveCount(3) // Assuming 3 suggestions are provided
  52 |   })
  53 | })
  54 |
```