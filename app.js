const { data } = require("autoprefixer");
const browserob = require("./browser.js");
const scraperController = require("./pageController.js");
const {PageScrapper,OverViewScraper} = require("./pageScraper.js");
const path = require("path");

const express = require("express");
const app = express();
const port = 5557;
const host = '127.0.0.1';

app.use("/public",express.static("public"));

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
// let browser = await browserob.startBrowser();
let data = {msg:"hrlo"};
const page = new PageScrapper("https://www.cardekho.com/new-7-seater+cars");
// const data = await page.scraper(browser);
// browser.close();
res.status(200).sendFile(path.join(__dirname,"./public/template/index.html"));
});

app.get("/scrapurl",async(req,res)=>{
    let browser = await browserob.startBrowser();
    let url = req.query.url;
    // let data = url;
    const page = new PageScrapper(url);
    const data = await page.scraper(browser);
   browser.close();
    res.status(200).json(data);
    
});
app.get("/overview",async(req,res)=>{
    let browser = await browserob.startBrowser();
    let url = req.query.url;
    // let data = url;
    const page = new OverViewScraper(url);
    const data = await page.startScraping(browser);
  browser.close();
    res.status(200).send(data);
    
});

app.listen(port,()=>{
    console.log(`server started at : http://${host}:${port}`);
});

// scraperController(browser);

