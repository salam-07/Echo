// Run with the Vite dev server on port 5173. Set PLAYWRIGHT_PATH if Playwright is provided by an external runtime.
// Uses a mocked account and empty API responses; never writes to the backend.
const assert = require('node:assert/strict');
const os = require('node:os');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
(async () => {
 const browser = await chromium.launch({channel:'msedge', headless:true});
 try {
  for (const [name, viewport] of [['desktop', {width:1440,height:1000}], ['mobile', {width:390,height:844}], ['small-mobile',{width:320,height:568}]]) {
   const context = await browser.newContext({viewport, reducedMotion:'reduce'});
   const page = await context.newPage();
   const errors = []; const writes = [];
   page.on('pageerror', error => errors.push(error.message));
   await page.route('**/api/**', route => {
    const path = new URL(route.request().url()).pathname;
    if (!['GET','OPTIONS'].includes(route.request().method())) writes.push(path);
    const data = path.endsWith('/auth/me') ? {_id:'tour-test',userName:'reader'} : path.endsWith('/scroll/all') ? {scrolls:[]} : [];
    return route.fulfill({status:200, contentType:'application/json',body:JSON.stringify(data)});
   });
   await page.goto('http://127.0.0.1:5173/');
   const tour = page.locator('.interface-tour');
   await tour.waitFor();
   await page.waitForTimeout(100);
   async function check(title) {
    assert.equal(await tour.locator('h2').textContent(), title);
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    const bounds = await tour.boundingBox();
    assert(bounds.x >= 0 && bounds.x+bounds.width <= viewport.width+1, 'Horizontal bounds');
    assert(bounds.y >= 0 && bounds.y+bounds.height <= viewport.height+1, 'Vertical bounds');
    assert(await tour.getByRole('button',{name:'Skip tour'}).isVisible());
    assert.equal(await page.locator('.interface-tour-shade, .interface-tour-spotlight, [data-tour-highlight]').count(),0);
    if (viewport.width >= 1024) { await page.locator('main').waitFor({state:'visible'}); const main=await page.locator('main').boundingBox(); assert(bounds.x >= main.x+main.width, 'Tour stays outside main content'); }
    else {
     assert(bounds.height <= viewport.height*.44+1, 'Compact mobile tour');
     await page.locator('main').waitFor({state:'visible'});
     assert(bounds.width <= 249, 'Mobile placard is compact');
     const mainStyle = await page.locator('main').evaluate(el => ({maxHeight:getComputedStyle(el).maxHeight, paddingBottom:parseFloat(getComputedStyle(el).paddingBottom)}));
     assert.equal(mainStyle.maxHeight, 'none', 'Page continues behind the placard');
     assert(mainStyle.paddingBottom + 1 >= bounds.height + 88, 'Final page controls can scroll clear of the placard');
    }
   }
   await check('This is your feed');
   assert(await tour.getByRole('button',{name:'Back',exact:true}).isDisabled());
   assert.equal(await tour.evaluate(el => getComputedStyle(el).animationName), 'none');
   await page.emulateMedia({reducedMotion:'no-preference'});
   assert.equal(await tour.evaluate(el => getComputedStyle(el).animationName), 'tour-enter');
   await page.emulateMedia({reducedMotion:'reduce'});
   await page.screenshot({path:path.join(os.tmpdir(), `echo-tour-${name}.png`)});
   const next = () => tour.getByRole('button',{name:'Next',exact:true}).click();
   await next(); await check('Pick a feed to read');
   assert.match(await tour.locator('#tour-copy').innerText(), viewport.width >= 1024 ? /bar at the top/ : /bar at the bottom/);
   assert.match(await tour.locator('.interface-tour-topline').innerText(), /Step 2 of 8/);
   await next(); await check('Write an Echo');
   await next(); await check('Choose what you see');
   await tour.getByRole('button',{name:'Back',exact:true}).click(); await check('Write an Echo');
   await next(); await next();
   for (const [title, action, path] of [
    ['Find feeds made by others','Open Community','/community'],
    ['Feeds find new posts for you','Open Feeds','/browse/scrolls'],
    ['Curations are hand-picked posts','Open Curations','/browse/curation'],
    ['Explore a topic with Tags','Open Tags','/browse/tags']]) {
     await check(title);
     assert(await tour.getByRole('button',{name:'Next',exact:true}).isDisabled());
     // Exercise actual interface tabs too, not only the in-tour shortcut.
     if (action === 'Open Feeds') await page.locator('main a[href="/browse/scrolls"]').first().click();
     else await tour.getByRole('button',{name:action,exact:true}).click();
     await page.waitForURL('**'+path);
     await next();
   }
   await check('Keep posts for later');
   assert.equal(new URL(page.url()).search, '?type=curation');
   await next(); await check('Your feed. Your choice.');
   await tour.getByRole('button',{name:'Finish tour'}).click();
   assert.equal(await tour.count(), 0);
   await page.reload(); await page.waitForTimeout(1800);
   assert.equal(await tour.count(),0,'Completion remembered');
   assert.equal(await page.getByRole('button',{name:'Take a tour',exact:true}).count(),0);
   await page.evaluate(() => localStorage.removeItem('echo:interface-tour:v1:tour-test'));
   await page.reload();
   await tour.waitFor();
   await check('This is your feed');
   await page.keyboard.press('Escape');
   assert.equal(await tour.count(),0,'Escape dismisses');
   await page.reload(); await page.waitForTimeout(1800);
   assert.equal(await tour.count(),0,'Dismissal remembered');
   assert.deepEqual(errors,[]); assert.deepEqual(writes,[],'Tour must not create or follow content');
   console.log(`${name}: full tour, Community gates, Back, completion, no replay entry, Escape, persistence, bounds, no writes PASS`);
   await context.close();
  }
 } finally { await browser.close(); }
})().catch(error => {console.error(error);process.exitCode=1;});
