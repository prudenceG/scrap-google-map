const Nightmare = require('nightmare')
const nightmare = Nightmare({ show: true })

const args = process.argv.slice(2)
const job = args[0];
const place = args[1];


getResultsFromGoogleMaps = (job, place) => {
  const selector = 'div.section-result-text-content'
  nightmare
  .goto('https://www.google.fr/maps')
  .type('#searchboxinput', `${job} ${place}`)
  .click('#searchbox-searchbutton')
  .wait('div.section-result')
  .evaluate((selector) => {
    const results = []
    let resultsHTML = document.querySelectorAll('div.section-result-text-content')
    Array.from(resultsHTML)
      .map(result => {

        // let event = document.createEvent('MouseEvent');
        // event.initEvent('click', true, true);
        // result.dispatchEvent(event);

        // click on each result
        // result.click('div.section-result')
        // .wait('div.section-layout')
        // .evaluate(() => {
          //   const name = document.querySelector('div.section-hero-header-title div div h1').innerText;
          //   return name;
          
          // })
          // .end()
          // .then((data) => {
            //   console.dir(data, {depth:null})
            // })
            // .catch(err => {
              //   console.error('Second Search failed:', err)
              // })
              
              const name = result.querySelector('div.section-result-title-container h3').innerText;
              const address = result.querySelector('div.section-result-details-container span.section-result-location').innerText;
              results.push({name, address})
      });
      return results
      
  }, 'selector')
  .then((results) => {
    console.log('results', results)
    return nightmare.url()
  })
  .then((url) => {
    const selector2 = 'div.section-layout h1'
    console.log('url', url)
    return nightmare
      .click('div.section-result')
      .wait(5000)
      // .evaluate((selector2) => {
      //   const name = document.querySelector('div.section-layout h1').innerHTML;
      //   return name;
      // }, 'selector2')
  })
  .then((name) => {
    const selector3 = 'div.section-layout h1'
    console.log('name', name)
    return nightmare
      .evaluate((selector3) => {
        const name = document.querySelector('div.section-layout h1').innerHTML;
        return name;
      }, 'selector3')
  })
  .then((name) => {
    // console.log(url);
    console.log('name2', name)
  })
  .catch(error => {
    console.error('First Search failed:', error)
  })
}



getResultsFromGoogleMaps(job, place);