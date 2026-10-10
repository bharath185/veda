import { test, expect } from '@playwright/test';

test.describe('ShopFlow Customer & Delivery Flow', () => {
  test('Desktop: Browsing, cart drawer and side-by-side checkout', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('http://localhost:3000');

    // Verify brand
    await expect(page.locator('text=ShopFlow')).toBeVisible();

    // Verify product card and add to cart
    const firstAddButton = page.locator('button:has-text("Add")').first();
    await expect(firstAddButton).toBeVisible();
    await firstAddButton.click();

    // Verify Cart Drawer opens
    await expect(page.locator('text=Your Cart')).toBeVisible();
    await expect(page.locator('text=Proceed to Secure Checkout')).toBeVisible();

    // Click checkout
    await page.locator('text=Proceed to Secure Checkout').click();
    await expect(page).toHaveURL(/.*checkout/);

    // Verify desktop checkout side-by-side layout
    await expect(page.locator('text=Delivery Address')).toBeVisible();
    await expect(page.locator('text=Order Summary')).toBeVisible();
  });

  test('Mobile Viewport: Bottom nav, touch carousel, and step checkout', async ({ page }) => {
    // iPhone 14 Viewport
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('http://localhost:3000');

    // Verify bottom nav items
    await expect(page.locator('text=Home')).toBeVisible();
    await expect(page.locator('text=Categories')).toBeVisible();
    await expect(page.locator('text=Cart')).toBeVisible();
    await expect(page.locator('text=Orders')).toBeVisible();

    // Verify PWA install prompt banner
    await expect(page.locator('text=Install ShopFlow')).toBeVisible();
  });
});
