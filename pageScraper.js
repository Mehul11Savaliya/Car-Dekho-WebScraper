const scraperObject = {
  url: 'https://www.cardekho.com/new-7-seater+cars',
  async scraper(browser) {
    let page = await browser.newPage();
    console.log(`requesting : ${this.url}`);
    await page.goto(this.url);
    await autoScroll(page);
    const listcars = await page.$$('div.gsc_col-xs-12 .append_list');

    let imageUrlSelecor = 'section > div.card.card_new > div.gsc_col-sm-5.gsc_col-xs-4.gsc_col-md-4.paddingnone.hover > div';
    let carNameSelecor = 'div.card > div.gsc_col-sm-7.gsc_col-xs-8.gsc_col-md-8.listView.holder > h3 > a';
    let priceRangeSelector = 'section > div.card.card_new > div.gsc_col-sm-7.gsc_col-xs-8.gsc_col-md-8.listView.holder > div.price > span';
    let milageSelector = 'section > div.card.card_new > div.gsc_col-sm-7.gsc_col-xs-8.gsc_col-md-8.listView.holder > div.dotlist > span:nth-child(1)';
    let engineCCSelecor = 'section > div.card.card_new > div.gsc_col-sm-7.gsc_col-xs-8.gsc_col-md-8.listView.holder > div.dotlist > span:nth-child(2)';
    // for(let item of listcars) {
    //   console.table(await page.evaluate(el=>el.getElementsByTagName('img')[0].src,item));
    // }



    let i = 0;
    let ax = [];

    for (let item of listcars) {
      try {

        //#rf01 > div.app-content > div > main > div > div.gsc_col-xs-12.gsc_col-sm-12.gsc_col-md-8.gsc_col-lg-9.float-right > div.listitems.gsc_row > div:nth-child(1) > div:nth-child(2) > section > div.card.card_new > div.gsc_col-sm-7.gsc_col-xs-8.gsc_col-md-8.listView.holder > h3 > a
        //#rf01 > div.app-content > div > main > div > div.gsc_col-xs-12.gsc_col-sm-12.gsc_col-md-8.gsc_col-lg-9.float-right > div.listitems.gsc_row > div:nth-child(1) > div:nth-child(2) > section > div.card.card_new > div.gsc_col-sm-7.gsc_col-xs-8.gsc_col-md-8.listView.holder > h3 > a
        let carobj = {};
        let imgsrc = await page.evaluate(el => el.getElementsByTagName("img")[0].src, item);
        carobj.imgUrl = imgsrc;
        let carName = await page.evaluate(el => el.querySelector('div.card > div.gsc_col-sm-7.gsc_col-xs-8.gsc_col-md-8.listView.holder > h3 > a').title, item);
        carobj.carName = carName;         //div.startRating > span > span.ratingvalue
        // let rating = await page.evaluate(el => el.querySelector('').innerHTML, item);
        // carobj.rating = rating;
        let priceRange = await page.evaluate(el => el.querySelector('section > div.card.card_new > div.gsc_col-sm-7.gsc_col-xs-8.gsc_col-md-8.listView.holder > div.price > span').innerHTML, item);
        priceRange = priceRange.replaceAll('<i class="icon-cd_R">Rs.</i>', '');
        priceRange = priceRange.replaceAll('<sup>*</sup>', '');//
        carobj.priceRange = 'RS. ' + priceRange;
        let milage = await page.evaluate(el => el.querySelector('section > div.card.card_new > div.gsc_col-sm-7.gsc_col-xs-8.gsc_col-md-8.listView.holder > div.dotlist > span:nth-child(1)').innerHTML, item);
        carobj.milage = milage;
        let engineCC = await page.evaluate(el => el.querySelector('section > div.card.card_new > div.gsc_col-sm-7.gsc_col-xs-8.gsc_col-md-8.listView.holder > div.dotlist > span:nth-child(2)').innerHTML, item);
        carobj.engineCC = engineCC;

        //section > div.expandcollapseV1.clear > div.variantlist.clearfix > ul > li:nth-child(2) 
        //section > div.expandcollapseV1.clear > div.variantlist.clearfix > ul > li:nth-child(2)
        try {

          let varray = [];
          let variants = await page.evaluateHandle(el => el.querySelectorAll('section > div.expandcollapse.matching.clear > div.test > div > ul > li'), item);
          variants = await variants.getProperties();
          variants = Array.from(variants.values());
          variants = Array.from(variants);
          for (let vari of variants) {
            let varient = {};
            let varient_name = await page.evaluate(el => el.querySelector('div.gsc_col-md-11.gsc_col-sm-10.gsc_col-xs-10.brandvariantcar > div > a').innerHTML, vari);
            varient.name = varient_name;
            let url = await page.evaluate(el => el.querySelector('div.gsc_col-md-11.gsc_col-sm-10.gsc_col-xs-10.brandvariantcar > div > a').href, vari);
            varient.url = url;
            let other = await page.evaluate(el => el.querySelector('div.gsc_col-md-11.gsc_col-sm-10.gsc_col-xs-10.brandvariantcar > div > span').innerText, vari);
            other = other.replaceAll('<i class="icon-cd_R">Rs.</i>', '');
            other = other.replaceAll('<sup>*</sup>', '');
            let [price,cc,milage] = other.split(',');
            varient.price = price;
            varient.engineCC = cc;
            varient.milage = milage;
            //  console.log(varient);
            varray.push(varient);
          }

          let othervariants = await page.evaluateHandle(el => el.querySelectorAll('section > div.expandcollapse.other.clear > div.test > div > ul > li'), item);
          othervariants = await othervariants.getProperties();
          othervariants = Array.from(othervariants.values());
          othervariants = Array.from(othervariants);
          for (let vari of othervariants) {
            let varient = {};
            let varient_name = await page.evaluate(el => el.querySelector('div.gsc_col-md-11.gsc_col-sm-10.gsc_col-xs-10.brandvariantcar > div > a').innerHTML, vari);
            varient.name = varient_name;
            let other = await page.evaluate(el => el.querySelector('div.gsc_col-md-11.gsc_col-sm-10.gsc_col-xs-10.brandvariantcar > div > span').innerText, vari);
            other = other.replaceAll('<i class="icon-cd_R">Rs.</i>', '');
            other = other.replaceAll('<sup>*</sup>', '');
            let [price,cc,milage] = other.split(',');
            varient.price = price;
            varient.engineCC = cc;
            varient.milage = milage;
            //  console.log(varient);
            varray.push(varient);
          }

          carobj.variants = { number: varray.length, list: varray };

        } catch (errorc) {
          console.log(errorc);
        }
        ax.push(carobj);
      } catch (error) {
        // console.log(error);
      }
      //console.log(i++,inner);
    }

    const util = require('util')

console.log(util.inspect(ax, {showHidden: false, depth: null, colors: true}))
    // console.dir(ax, ax.length);


    async function autoScroll(page) {
      await page.evaluate(async () => {
        await new Promise((resolve) => {
          var totalHeight = 0;
          var distance = 500;
          var timer = setInterval(() => {
            var scrollHeight = document.body.scrollHeight;
            window.scrollBy(0, distance);
            totalHeight += distance;

            if (totalHeight >= scrollHeight - window.innerHeight) {
              clearInterval(timer);
              resolve();
            }
          }, 300);
        });
      });
    }
  }
}

class PageScrapper
{
  imageUrlSelecor = 'section > div.card.card_new > div.gsc_col-sm-5.gsc_col-xs-4.gsc_col-md-4.paddingnone.hover > div';
   carNameSelecor = 'div.card > div.gsc_col-sm-7.gsc_col-xs-8.gsc_col-md-8.listView.holder > h3 > a';
   priceRangeSelector = 'section > div.card.card_new > div.gsc_col-sm-7.gsc_col-xs-8.gsc_col-md-8.listView.holder > div.price > span';
   milageSelector = 'section > div.card.card_new > div.gsc_col-sm-7.gsc_col-xs-8.gsc_col-md-8.listView.holder > div.dotlist > span:nth-child(1)';
   engineCCSelecor = 'section > div.card.card_new > div.gsc_col-sm-7.gsc_col-xs-8.gsc_col-md-8.listView.holder > div.dotlist > span:nth-child(2)';
 
      constructor (url){
        this.url = url;
      }

     async  autoScroll (page) {
        await page.evaluate(async () => {
          await new Promise((resolve) => {
            var totalHeight = 0;
            var distance = 500;
            var timer = setInterval(() => {
              var scrollHeight = document.body.scrollHeight;
              window.scrollBy(0, distance);
              totalHeight += distance;
  
              if (totalHeight >= scrollHeight - window.innerHeight) {
                clearInterval(timer);
                resolve();
              }
            }, 200);
          });
        });
      }

        scraper(browser) {
        return new Promise(async(res,rej)=>{
          let page = await browser.newPage();
          console.log(`requesting : ${this.url}`);
          await page.goto(this.url);
          await this.autoScroll(page);
          try {
            
          const listcars = await page.$$('div.gsc_col-xs-12');
           // console.log(listcars.length);
          let i = 0;
          let ax = [];
      
          for (let item of listcars) {
          //  console.log(item);
            try {
           let carobj = {};
              let imgsrc = await page.evaluate(el => el.getElementsByTagName("img")[0].src, item);
              carobj.imgUrl = imgsrc;
            let carName = await page.evaluate(el => el.querySelector('section > div.card.card_new > div.gsc_col-sm-7.gsc_col-xs-8.gsc_col-md-8.listView.holder > h3 > a').title, item);
             carobj.carName = carName;         //div.startRating > span > span.ratingvalue
              // let rating = await page.evaluate(el => el.querySelector('').innerHTML, item);
              // carobj.rating = rating;
              let priceRange = await page.evaluate(el => el.querySelector('section > div.card.card_new > div.gsc_col-sm-7.gsc_col-xs-8.gsc_col-md-8.listView.holder > div.price > span').innerHTML, item);
              priceRange = priceRange.replaceAll('<i class="icon-cd_R">Rs.</i>', '');
              priceRange = priceRange.replaceAll('<sup>*</sup>', '');//
              carobj.priceRange = 'RS. ' + priceRange;
              let milage = await page.evaluate(el => el.querySelector('section > div.card.card_new > div.gsc_col-sm-7.gsc_col-xs-8.gsc_col-md-8.listView.holder > div.dotlist > span:nth-child(1)').innerHTML, item);
              carobj.milage = milage;
              let engineCC = await page.evaluate(el => el.querySelector('section > div.card.card_new > div.gsc_col-sm-7.gsc_col-xs-8.gsc_col-md-8.listView.holder > div.dotlist > span:nth-child(2)').innerHTML, item);
              carobj.engineCC = engineCC;
               try {
      
                let varray = [];
                let variants = await page.evaluateHandle(el => el.querySelectorAll('section > div.expandcollapse.matching.clear > div.test > div > ul > li'), item);
                variants = await variants.getProperties();
                variants = Array.from(variants.values());
                variants = Array.from(variants);
                for (let vari of variants) {
                  let varient = {};
                  let varient_name = await page.evaluate(el => el.querySelector('div.gsc_col-md-11.gsc_col-sm-10.gsc_col-xs-10.brandvariantcar > div > a').innerHTML, vari);
                  varient.name = varient_name;
                  let url = await page.evaluate(el => el.querySelector('div.gsc_col-md-11.gsc_col-sm-10.gsc_col-xs-10.brandvariantcar > div > a').href, vari);
                  varient.url = url;
                  let other = await page.evaluate(el => el.querySelector('div.gsc_col-md-11.gsc_col-sm-10.gsc_col-xs-10.brandvariantcar > div > span').innerText, vari);
                  other = other.replaceAll('<i class="icon-cd_R">Rs.</i>', '');
                  other = other.replaceAll('<sup>*</sup>', '');
                  let [price,cc,milage] = other.split(',');
                  varient.price = price;
                  varient.engineCC = cc;
                  varient.milage = milage;
                  //  console.log(varient);
                  varray.push(varient);
                }
      
                let othervariants = await page.evaluateHandle(el => el.querySelectorAll('section > div.expandcollapse.other.clear > div.test > div > ul > li'), item);
                othervariants = await othervariants.getProperties();
                othervariants = Array.from(othervariants.values());
                othervariants = Array.from(othervariants);
                for (let vari of othervariants) {
                  let varient = {};
                  let varient_name = await page.evaluate(el => el.querySelector('div.gsc_col-md-11.gsc_col-sm-10.gsc_col-xs-10.brandvariantcar > div > a').innerHTML, vari);
                  varient.name = varient_name;
                  let other = await page.evaluate(el => el.querySelector('div.gsc_col-md-11.gsc_col-sm-10.gsc_col-xs-10.brandvariantcar > div > span').innerText, vari);
                  other = other.replaceAll('<i class="icon-cd_R">Rs.</i>', '');
                  other = other.replaceAll('<sup>*</sup>', '');
                  let [price,cc,milage] = other.split(',');
                  varient.price = price;
                  varient.engineCC = cc;
                  varient.milage = milage;
                  //  console.log(varient);
                  varray.push(varient);
                }
      
                carobj.variants = { number: varray.length, list: varray };
      
              } catch (errorc) {
               throw errorc;
              }
              ax.push(carobj);
            } catch (error) {
              console.log(error);
            }
            //console.log(i++,inner);
          }

          console.log(ax);
          if(ax===undefined){
            rej({msg:"data not found"});
          }
          else{
            res(ax);

          }
        } catch (error) {
            rej([`not able to scrap ${this.url}`,error]);
        }
        });
       
      }
};

module.exports = {PageScrapper,scraperObject};