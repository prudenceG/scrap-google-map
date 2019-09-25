const Nightmare = require('nightmare')
const nightmare = Nightmare({ show: true })

const args = process.argv.slice(2)
const job = args[0];
const place = args[1];


getResultsFromGoogleMaps = async (job, place) => {
  const nightmare = new Nightmare({ show: true });
  const selector = 'body'
  //const selector = '#pane > div > div.widget-pane-content.scrollable-y > div > div > div.section-layout.section-scrollbox.scrollable-y.scrollable-show.section-layout-flex-vertical > div.section-layout.section-scrollbox.scrollable-y.scrollable-show.section-layout-flex-vertical > div:nth-child(1)'
    try {
      const result = await nightmare
        .goto(`https://www.google.fr/maps/search/${job}+${place}`)
        .wait(selector)
        .evaluate((selector) => {
          return document.outerHMTL
          //return document.getElementsByTagName(selector).innerText
        }, selector)
        .end()

        console.log(result);
        
    } catch(e) {
      console.error(e);
    }

    
    // nightmare
    // .goto(`https://www.google.fr/maps/search/${job}+${place}`)
    // .wait(selector)
    // .evaluate((selector) => {
    //     return new Promise((resolve, reject) => {
    //         try {
    //             resolve(document.querySelector(selector).innerText);
    //         } catch (exception) {
    //             reject(exception);
    //         }
    //     });
    // }, selector)
    // .end()
    // .then((result) => {
    //     console.log(result);
    // });



  


  // nightmare
  // .goto(`https://www.google.fr/maps/search/${job}+${place}`)
  // .wait(3000)
  // .evaluate(() => {
  //   const results = []
  //   return document.querySelector('div.section-result-text-content')
  //   // Array.from(resultsHTML)
  //   //   .map(result => {
  //   //     const name = result.querySelector('div.section-result-title-container h3').innerText;
  //   //     const address = result.querySelector('div.section-result-details-container span.section-result-location').innerText;
  //   //     results.push({name, address})
  //   //   })
  //   // return results;
  //   })
  //   .then(result => {
  //     console.dir(result, {depth: 6});
  //   })
}

getResultsFromGoogleMaps(job, place);