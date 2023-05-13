const cheerio = require("cheerio");

class PageScrapper {
  imageUrlSelecor = 'section > div.card.card_new > div.gsc_col-sm-5.gsc_col-xs-4.gsc_col-md-4.paddingnone.hover > div';
  carNameSelecor = 'div.card > div.gsc_col-sm-7.gsc_col-xs-8.gsc_col-md-8.listView.holder > h3 > a';
  priceRangeSelector = 'section > div.card.card_new > div.gsc_col-sm-7.gsc_col-xs-8.gsc_col-md-8.listView.holder > div.price > span';
  milageSelector = 'section > div.card.card_new > div.gsc_col-sm-7.gsc_col-xs-8.gsc_col-md-8.listView.holder > div.dotlist > span:nth-child(1)';
  engineCCSelecor = 'section > div.card.card_new > div.gsc_col-sm-7.gsc_col-xs-8.gsc_col-md-8.listView.holder > div.dotlist > span:nth-child(2)';

  constructor(url) {
    this.url = url;
  }

  async autoScroll(page) {
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
    return new Promise(async (res, rej) => {
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
              // for (let vari of variants) {
              //   let varient = {};
              //   let varient_name = await page.evaluate(el => el.querySelector('div.gsc_col-md-11.gsc_col-sm-10.gsc_col-xs-10.brandvariantcar > div > a').innerHTML, vari);
              //   varient.name = varient_name;
              //   let url = await page.evaluate(el => el.querySelector('div.gsc_col-md-11.gsc_col-sm-10.gsc_col-xs-10.brandvariantcar > div > a').href, vari);
              //   varient.url = url;
              //   let other = await page.evaluate(el => el.querySelector('div.gsc_col-md-11.gsc_col-sm-10.gsc_col-xs-10.brandvariantcar > div > span').innerText, vari);
              //   other = other.replaceAll('<i class="icon-cd_R">Rs.</i>', '');
              //   other = other.replaceAll('<sup>*</sup>', '');
              //   let [price, cc, milage] = other.split(',');
              //   varient.price = price;
              //   varient.engineCC = cc;
              //   varient.milage = milage;
              //   //  console.log(varient);
              //   varray.push(varient);
              // }
             // carobj.matchingVarient = { number: varray.length, list: varray };
              varray = [];

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
                let [price, cc, milage] = other.split(',');
                varient.price = price;
                varient.engineCC = cc;
                varient.milage = milage;
                //  console.log(varient);
                varray.push(varient);
              }

              carobj.othervariants = { number: varray.length, list: varray };

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
        if (ax === undefined) {
          rej({ msg: "data not found" });
        }
        else {
          res(ax);

        }
      } catch (error) {
        rej([`not able to scrap ${this.url}`, error]);
      }
    });

  }
};

class OverViewScraper {

  quickOverViewSelecor = "div > main > div > div.gsc_col-xs-12.gsc_col-sm-12.gsc_col-md-8.gsc_col-lg-9.leftSection > section:nth-child(2)";

  constructor(url) {
    this.url = url;
  }

  async autoScroll(page) {
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

  async startScraping(browser) {
    return new Promise(async (res, rej) => {
      let page = await browser.newPage();
      console.log(`requesting : ${this.url}`);
      await page.goto(this.url);
      // await page.evaluate(() => {
      //   window.scrollBy(0, 2000);
      // });
      await this.autoScroll(page);

      //section.overview image name etc
      /**
       * overview table :  div.app-content > div > main > div > div.gsc_col-xs-12.gsc_col-sm-12.gsc_col-md-8.gsc_col-lg-9.leftSection > section:nth-child(2) > table
       * latest update :   div.app-content > div > main > div > div.gsc_col-xs-12.gsc_col-sm-12.gsc_col-md-8.gsc_col-lg-9.leftSection > section.marginBottom20.shadow24.carSummary.readMoreLess
       * detailed price : #OnRoadPrice > table > tbody
       * key features : #specification > div > table
       * enginee and transmission : #scrollDiv > table:nth-child(2)
       * fuel and perfomance :  #scrollDiv > table:nth-child(5)
       * Suspension,steering,bracks : #scrollDiv > table:nth-child(7)
       * Dimension Capacity :  #scrollDiv > table:nth-child(10)
       * Comfort and Convenience : #scrollDiv > table:nth-child(13)
       * Interior :  #scrollDiv > table:nth-child(16)
       * Exterior : #scrollDiv > table:nth-child(19)
       * Saftey : #scrollDiv > table:nth-child(22)
       * Entertainment and Communication : #scrollDiv > table:nth-child(25)
       * 
       * Colors : #colorsSection > p
       * color image list : #colorsSection > div > ul > li
       * Harrier XM Alternative : div.app-content > div > main > div > div.gsc_col-xs-12.gsc_col-sm-12.gsc_col-md-8.gsc_col-lg-9.leftSection > div.similarcarsOuter > div > section > div > ul > li
       * must read articals : #rf01 > div.app-content > div > main > div > div.gsc_col-xs-12.gsc_col-sm-12.gsc_col-md-8.gsc_col-lg-9.leftSection > section:nth-child(18) > div > ul
       * images : #picture > section > div > div > div > div > div.gsc_row > div > ul > li
       * videos : #VideoGrid > div.mobileCarousel.iPadCarousel > ul > li
       * latest review : #userReview > div.helpfulReviews.userReviewWST > div.latestreviews.cardViewAll > div > ul
       * latest news :div.app-content > div > main > div > div.gsc_col-xs-12.gsc_col-sm-12.gsc_col-md-8.gsc_col-lg-9.leftSection > section:nth-child(24) > div.mobileCarousel.iPadCarousel > ul > li
       * breadcrumps :div.app-content > div > main > div > div.gsc_col-xs-12.gsc_col-sm-12.gsc_col-md-8.gsc_col-lg-9.leftSection > section:nth-child(24) > div.mobileCarousel.iPadCarousel > ul > li
       */

      let main = await page.$$('div.app-content');
      let cardata = {};
      main = main[0];
      console.log(main);
      const mainImage = await page.evaluate(el => {
        return el.querySelector('#overview > div > div > div.gsc_col-xs-12.gsc_col-sm-12.gsc_col-md-5.gsc_col-lg-5 > div > div > ul > li:nth-child(1) > div > img').src;
      }, main);
      //  cardata.mainImage = mainImage;

      const da = await page.evaluate(ma => ma.querySelector("#overview > div > div > div.gsc_col-xs-12.gsc_col-sm-12.gsc_col-md-7.gsc_col-lg-7.overviewdetail").innerHTML, main);
      const overview = cheerio.load(da);
      cardata.overview = {
        mainImage: mainImage,
        name: overview('h1.tooltip').text(),
        price: overview('div.price').text().replaceAll('<i class="icon-cd_R">Rs.</i>', '').replaceAll('<sup>*</sup>', '').split('*')[0]
      }

      // const quickOverViewHtml =  await page.evaluate(el=>{
      //   let selector = this.quickOverViewSelecor;
      //   return el.querySelector("div > main > div > div.gsc_col-xs-12.gsc_col-sm-12.gsc_col-md-8.gsc_col-lg-9.leftSection > section[data-track-component='quickover']").innerHTML;
      // },main);
      // cardata.test = quickOverViewHtml;
      // cardata.quickOverView =  await this.extractQuickOverview(quickOverViewHtml);

      const latestUpdate = await page.evaluate(el => {
        return el.querySelector('div > main > div > div.gsc_col-xs-12.gsc_col-sm-12.gsc_col-md-8.gsc_col-lg-9.leftSection > section.marginBottom20.shadow24.carSummary.readMoreLess').innerHTML;
      }, main);
      cardata.summary = await this.extractSummary(latestUpdate);

      const onroadPrice = await page.evaluate(el => {
        return el.querySelector('#OnRoadPrice').innerHTML;
      }, main);
      cardata.onRoadPrice = await this.extractOnRoadPrice(onroadPrice);

      // const cityWisePriceHTML = await page.evaluate(el=>{
      //   return el.querySelectorAll("div > main > div > div.gsc_col-xs-12.gsc_col-sm-12.gsc_col-md-4.gsc_col-lg-3.rightSection > div > div:nth-child(4) > div > table > tbody")[0].innerHTML;
      // },main);
      // cardata.test = cityWisePriceHTML;

      const keyFeatures = await page.evaluate(el => {
        let data = el.querySelectorAll('table.keyfeature');
        let dtx = {};
        Array.from(data).forEach((el) => {
          let trs = el.querySelector('tbody').querySelectorAll('tr');
          Array.from(trs).forEach((elx) => {
            let tds = elx.querySelectorAll('td');
            let yesno = elx.querySelectorAll('td > span > span')[0];
          
            if (yesno === undefined) {
              dtx[tds[0].innerText] = tds[1].innerText;
            }
            else {
              dtx[tds[0].innerText] = yesno.innerText;

            }
          });
        })
        return dtx;
      }, main)
      // cardata.keyFeatures =  await this.extractKeyFeatures(keyFeatures);
      cardata.keyFeatures = keyFeatures;

      let allspecdata = [];

      const EngineAndTransmissionHTML = await page.evaluate(el => {
        return el.querySelector('#scrollDiv > table:nth-child(2)').innerHTML;
      }, main);
      //cardata['Engine and Transmission'] = EngineAndTransmissionHTML;
      let EAT = await this.extractAllSpec("<table>" + EngineAndTransmissionHTML + "</table>");
      allspecdata.push({ 'Engine and Transmission': EAT });
      //console.log(cardata);

      // Fuel & Performance
      const FuealAndPerfomance = await page.evaluate(el => {
        return el.querySelector('#scrollDiv > table:nth-child(5)').innerHTML;
      }, main);
      //cardata['Engine and Transmission'] = EngineAndTransmissionHTML;
      let FP = await this.extractAllSpec("<table>" + FuealAndPerfomance + "</table>");
      allspecdata.push({ 'Fuel & Performance': FP });

      //Suspension, Steering & Brakes
      const SuspensionSteeringBrakes = await page.evaluate(el => {
        return el.querySelector('#scrollDiv > table:nth-child(7)').innerHTML;
      }, main);
      //cardata['Engine and Transmission'] = EngineAndTransmissionHTML;
      let SSB = await this.extractAllSpec("<table>" + SuspensionSteeringBrakes + "</table>");
      allspecdata.push({ 'Suspension, Steering & Brakes': SSB });

      // Dimension Capacity
      const DCHTML = await page.evaluate(el => {
        return el.querySelector('#scrollDiv > table:nth-child(10)').innerHTML;
      }, main);
      //cardata['Engine and Transmission'] = EngineAndTransmissionHTML;
      let DC = await this.extractAllSpec("<table>" + DCHTML + "</table>");
      allspecdata.push({ 'Dimension Capacity': DC });


      // Comfort and Convenience
      const CACHTML = await page.evaluate(el => {
        return el.querySelector('#scrollDiv > table:nth-child(13)').innerHTML;
      }, main);
      //cardata['Engine and Transmission'] = EngineAndTransmissionHTML;
      let CC = await this.extractAllSpec("<table>" + CACHTML + "</table>");
      allspecdata.push({ 'Comfort and Convenience': CC });

      // Interior
      const IHTML = await page.evaluate(el => {
        return el.querySelector('#scrollDiv > table:nth-child(16)').innerHTML;
      }, main);
      //cardata['Engine and Transmission'] = EngineAndTransmissionHTML;
      let I = await this.extractAllSpec("<table>" + IHTML + "</table>");
      allspecdata.push({ 'Interior': I });

      // Exterior
      const EHTML = await page.evaluate(el => {
        return el.querySelector('#scrollDiv > table:nth-child(19)').innerHTML;
      }, main);
      //cardata['Engine and Transmission'] = EngineAndTransmissionHTML;
      let E = await this.extractAllSpec("<table>" + EHTML + "</table>");
      allspecdata.push({ 'Exterior': E });

      // Saftey
      const SHTML = await page.evaluate(el => {
        return el.querySelector('#scrollDiv > table:nth-child(22)').innerHTML;
      }, main);
      //cardata['Engine and Transmission'] = EngineAndTransmissionHTML;
      let S = await this.extractAllSpec("<table>" + SHTML + "</table>");
      allspecdata.push({ 'Saftey': S });

      // Entertainment and Communication
      const EACHTML = await page.evaluate(el => {
        return el.querySelector('#scrollDiv > table:nth-child(25)').innerHTML;
      }, main);
      //cardata['Engine and Transmission'] = EngineAndTransmissionHTML;
      let EAC = await this.extractAllSpec("<table>" + EACHTML + "</table>");
      allspecdata.push({ 'Entertainment and Communication': EAC });

      cardata.allSpecData = allspecdata;  

      try {
       
      const ColorHTML = await page.evaluate(el=>{
        return el.querySelector('#colorsSection').innerHTML;
      },main);
      cardata.availableColors=await this.extractColorDetails(ColorHTML);
 
      } catch (error) {
        
      }
      const AlternativHTML = await page.evaluate(el=>{
        let x =  el.querySelector("div.similarcarsOuter > div > section > div > ul").innerHTML;
     //   console.log(x);
        return x;
      },main);
      cardata.alternative = await this.extractAlternative(AlternativHTML);
      
      const ImagesHTML = await page.evaluate(el=>{
        let x =  el.querySelectorAll("#picture > section > div > div > div > div > div.gsc_row > div > ul > li");
       let imgs = [];
       console.log(x)
          Array.from(x).forEach(val=>{
            console.log(val);
            // let y = val.querySelector('img')[0];
            // imgs.push(y.getAttribute('src'));
          });
        return imgs;
      },main);
      cardata.images = ImagesHTML;

      res(cardata);

    });

  }

  async extractQuickOverview(html) {
    let $ = cheerio.load(html);
    let data = {};
    data.title = $('h2').text();
    let specs = $('table > tbody > tr');
    // console.log(specs);

    let spec = {};
    specs.each((idx, elm) => {
      console.log(idx, elm);
    })
    return data;

  }

  extractSummary = async (html) => {
    let $ = cheerio.load(html);
    let data = {};
    data.title = $('h2').html();

    let parags = $('#model-expert > p');
    let str = "";
    parags.each((idx, val) => {
      str += $(val).text() + "\n";
    })
    data.text = str;
    return data;
  }

  extractOnRoadPrice = async (html) => {
    let $ = cheerio.load(html);
    let data = {};
    data.title = $('h2').html();
    let oprice = $('table > tbody > tr');
    
    oprice.each((idx, val) => {
      $ = cheerio.load(val);
      let ttl = $('td.gsc_col-xs-8').text();
      let value = $('td.gsc_col-xs-4').text();
      data[ttl] = value;
    });
    
    return data;
  }

  async extractKeyFeatures(html) {
    //not working 🐦
    let $ = cheerio.load(html);
    let trs = $('tbody > tr');
    let data = {};
    trs.each((id, val) => {
      data[val[0].text()] = val[1].text();
    });
    return data;
  }

  extractAllSpec = async (html) => {
    let $ = cheerio.load(html);
    let trs = $('table > tbody > tr');
    // console.log(trs);
    let data = {};
    let a = [];
    trs.each((idx, val) => {
      $ = cheerio.load(val);//#scrollDiv > table:nth-child(2) > tbody > tr:nth-child(3) > td:nth-child(1)
      let yesno = $('td:nth-child(2) > i').hasClass('icon-deletearrow');
      if($('td:nth-child(2) > i').html()===null){
        data[$('td:nth-child(1)').html()] = $('td:nth-child(2) >span').text();
      }
      else{
        if(yesno){
          data[$('td:nth-child(1)').html()] = "No";
        }
        else{
          data[$('td:nth-child(1)').html()] = "Yes";
        }
      }
     
     
    });
    return data;
  }

  extractColorDetails = async (html)=>{
    let $ = cheerio.load(html);
   // console.log($.html());
    let data = {};
    data.title = $('body > h2').text();
    let cstr = $('body > p').text();
    let cstrx = cstr.split('-')[1].split(',');
   
  //  console.log($('body > h2').text(),$('body > h2').html());
    let color = [];
    try {
     
    cstrx.forEach(el=>{
      let iurl = $(`div[title='${el.substring(1)}']`.replaceAll('.','')).html();
      color.push({colorname:el,iurl:iurl});

    }) 
    } catch (error) {
      console.log("possible color image missing in extracting",error);
    }
    data.color = color;
  //  console.log(data);
    return data;
  }

  extractAlternative = async (html)=>{
    let $  = cheerio.load("<div>"+html+"</div>");
  
    let data = [];
    $('li').each((idx,val)=>{
        let x = cheerio.load(val);
       // console.log(x.html());
        let iurl = x('div.card.shadowWPadding.posR > div:nth-child(1)').html();
        let title = x('div.card.shadowWPadding.posR > div.title.holder > div.title > a').html();
        let price = x('div.card.shadowWPadding.posR > div.title.holder > div.price').text()
        data.push({img:iurl,name:title,price:price});
    });
  //  console.log(data);
    return data;
  }

  extractImages = async(html)=>{
    let $ = cheerio.load("<div>"+html+"</div>");
  //  console.log($.html());
    let d = [];
    $('div > li > div').each((id,val)=>{

      try {

        console.log(val.style['background-image']);
        
      } catch (error) {
        
      }
     // d.push(val.html());
  //    console.log(url.attr('src'));
    });
    return d;
  }

}

module.exports = { PageScrapper, OverViewScraper };