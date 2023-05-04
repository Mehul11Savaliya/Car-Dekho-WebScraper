const browserob = require("./browser.js");
const scraperController = require("./pageController.js");
const {PageScrapper} = require("./pageScraper.js");

const express = require("express");
const app = express();
const port = 5557;
const host = '127.0.0.1';

// // let browser = browserob.startBrowser();
// const getBrowser = async()=>{
//     try {
     
//     const ob =  await browser;
//    return ob;
//     } catch (error) {
//         console.log(error);
//     }
// }
// // getBrowser();
app.get("/",async(req,res)=>{
let browser = await browserob.startBrowser();

const page = new PageScrapper("https://www.cardekho.com/new-7-seater+cars");
const data = await page.scraper(browser);
browser.close();
res.status(200).json(data);
});

app.listen(port,host,()=>{
    console.log(`server started at : http://${host}:${port}`);
});

// scraperController(browser);

