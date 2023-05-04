const lib = require("./pageScraper");
async function scrapeAll(browserInstance){
	let browser;
	try{
		browser = await browserInstance;
		await lib.scraperObject.scraper(browser);	
		
	}
	catch(err){
		console.log("Could not resolve the browser instance => ", err);
	}
}

module.exports = (browserInstance) => scrapeAll(browserInstance)