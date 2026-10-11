const { chromium } = require('playwright');
const assert = require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true, ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {})}); const page=await browser.newPage();
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const root = require('node:url').pathToFileURL(require('node:path').resolve(__dirname, '..') + '/').href;
 for(const [path,add,dialog,cancel] of [
 ['pages/movies/movies.html','#add','#movieEditor','#cancel'],
 ['pages/movies/genres.html','#addGenre','#genreEditor','#cancelGenre'],
 ['pages/doanthai/index.html','#add','#screeningEditor','#movieReset'],
 ['pages/products/products.html','#btn-add-product','#product-modal','.btn-secondary']]){
 await page.goto(root+path);await page.locator(add).click();assert(await page.locator(dialog).evaluate(e=>e.open));
 await page.mouse.click(2, 2);assert(!(await page.locator(dialog).evaluate(e=>e.open)));
 await page.locator(add).click();
 await page.keyboard.press('Escape');assert(!(await page.locator(dialog).evaluate(e=>e.open)));
 await page.locator(add).click();await page.locator(dialog).locator(cancel).click();assert(!(await page.locator(dialog).evaluate(e=>e.open)));
 }
 await page.goto(root+'pages/movies/genres.html');await page.locator('#addGenre').click();await page.locator('#genreName').fill('Test popup');await page.locator('#saveGenre').click();assert(!(await page.locator('#genreEditor').evaluate(e=>e.open)));assert(await page.locator('#genresTable').innerText().then(t=>t.includes('Test popup')));
 await page.goto(root+'pages/doanthai/index.html');await page.locator('#add').click();await page.locator('#movieSelect').selectOption('1');await page.locator('#theaterSelect').selectOption('1');await page.locator('#roomSelect').selectOption('1');await page.locator('#screeningDate').fill('2026-10-11');await page.locator('#showTime').fill('10:00');await page.locator('#ticketPrice').fill('75000');await page.locator('#movieSubmit').click();assert(!(await page.locator('#screeningEditor').evaluate(e=>e.open)));assert((await page.locator('#film').innerText()).includes('75.000'));
 await page.goto(root+'pages/booking/booking.html');assert.equal(await page.locator('#bookingAddBtn').count(),0);await page.locator('#bookingSearch').fill('nothing');assert(await page.locator('#bookingEmpty').isVisible());
 await page.goto(root+'index.html#movies');
 await page.evaluate(() => { sessionStorage.setItem('btl.loggedIn', 'true'); });
 await page.reload();
 await page.evaluate(() => { window.location.hash = 'movies'; });
 const child = page.frameLocator('#pageFrame');
 await child.locator('#add').click();
 await page.waitForFunction(() => document.body.classList.contains('form-dialog-open'));
 assert(await page.locator('.sidebar').evaluate(e => e.inert));
 assert.equal(await page.evaluate(() => getComputedStyle(document.body, '::after').backgroundColor), 'rgba(0, 0, 0, 0.5)');
 const popup = child.locator('#movieEditor');
 await popup.evaluate(e => { e.scrollTop = e.scrollHeight; });
 const backgroundBefore = await child.locator('body').evaluate(() => window.scrollY);
 await popup.hover();
 await page.mouse.wheel(0, 1500);
 await page.waitForTimeout(200);
 assert.equal(await child.locator('body').evaluate(() => window.scrollY), backgroundBefore);
 assert.equal(await child.locator('html').evaluate(e => getComputedStyle(e).overflowY), 'hidden');
 await page.mouse.click(20, 120);
 await page.waitForFunction(() => !document.body.classList.contains('form-dialog-open'));
 assert(!(await page.locator('.sidebar').evaluate(e => e.inert)));
 assert.deepEqual(errors,[]);await browser.close();console.log('Popup checks passed: open, Escape, cancel, save genre/screening, booking search.');
})().catch(e=>{console.error(e);process.exit(1)});
