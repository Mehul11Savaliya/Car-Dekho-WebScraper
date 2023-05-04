const puppeteer = require("puppeteer");

const startBrowser = async ()=>{
let brwsr;
try {
console.log("getting browser instance..");
brwsr = await puppeteer.launch({
    headless:false,
    args:['--disable-setuid-sandbox'],
    'ignoreHTTPSErrors':true
});
} catch (error) {
    console.log("cannot load browser instance..",error);
}
finally{
      //  brwsr.close();
      //  console.log("browser instance closed..");
}
return brwsr;
} 

module.exports = {startBrowser};