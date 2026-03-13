const { chromium } = require('playwright');

(async () => {
    // Launch browser in headed mode to visually verify
    const browser = await chromium.launch({ headless: false, slowMo: 500 });
    const page = await browser.newPage();

    try {
        console.log('--- STARTING E2E TEST ---');

        // 1. Go to Home Page
        console.log('Navigating to Home...');
        await page.goto('http://localhost:5173');
        await page.waitForLoadState('networkidle');

        // 2. Go to Shop and Add Item to Cart
        console.log('Navigating to Shop...');
        await page.click('text=Shop Collection');
        await page.waitForTimeout(1000);

        console.log('Selecting a product...');
        // Find the first product card and click it
        await page.locator('.product-card').first().click();
        await page.waitForTimeout(1000);

        console.log('Adding product to cart...');
        // Select size (first available)
        await page.locator('button:has-text("S")').click().catch(() => { });
        await page.click('id=add-to-cart-btn');
        await page.waitForTimeout(2000);

        // 3. Go to Checkout
        console.log('Navigating to Checkout...');
        await page.goto('http://localhost:5173/checkout');
        await page.waitForLoadState('networkidle');

        // 4. Fill Checkout Form
        console.log('Filling out Checkout form...');
        await page.fill('input[name="firstName"]', 'John');
        await page.fill('input[name="lastName"]', 'Doe');
        await page.fill('input[name="email"]', 'john@example.com');
        await page.fill('input[name="phone"]', '+92 300 0000000');
        await page.fill('input[name="address"]', 'Test Address 123');
        await page.fill('input[name="city"]', 'Lahore');
        await page.fill('input[name="zipCode"]', '54000');

        console.log('Submitting Order...');
        await page.click('id=place-order-btn');

        // Wait for redirect to order confirmation
        await page.waitForURL('**/order-confirmation');
        console.log('✅ ORDER SUCCESSFUL: Redirected to Order Confirmation Page!');

    } catch (error) {
        console.error('❌ TEST FAILED:', error.message);
    } finally {
        await page.waitForTimeout(5000); // Give user time to see success page
        await browser.close();
    }
})();
