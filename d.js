const playwright = require('playwright');

let t = 100;
let url = '<URL>';
let total_paginas = 700;

async function loop(page, i){
	if( i % 2 == 0){
		await page.waitForTimeout(t);
		await page.keyboard.press("ArrowRight");
		await page.waitForTimeout(t);
		await clean(page);
	}
	
	let element_handle = await page.$(`#page_${i}`);
	console.info(i, element_handle != null)
	return element_handle.screenshot({ path: `tomo4/p${i}.png` })

}
async function clean(page){
	return page.evaluate( () => {
		let elements = document.getElementsByClassName("flipjs-leftpageshadow");
		while(elements.length > 0){
			elements[0].parentNode.removeChild(elements[0]);
		}
		elements = document.getElementsByClassName("flipjs-rightpageshadow");
		while(elements.length > 0){
			elements[0].parentNode.removeChild(elements[0]);
		}

	})
}

(async () => {
  for (const browserType of ['chromium', /*'firefox', 'webkit'*/]) {
	  
    const browser = await playwright[browserType].launch({
		headless: true,
		devtools: false,
	});
	
	let vp = {width: 8508 , height: 2480 };
    const context = await browser.newContext({ viewport: vp });
    const page = await context.newPage();

	await page.goto(url)

	await page.waitForTimeout(3000);


	for(let i = 1; i < total_paginas; i++)
		await loop(page, i)

  }
})();
