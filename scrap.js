const Nightmare = require('nightmare')
const nightmare = Nightmare({ show: true })
const args = process.argv.slice(2)
const job = args[0];
const place = args[1];


getResultsFromGoogleMaps = (job, place) => {
  nightmare

  .goto('https://www.google.fr/maps')
  .type('#searchboxinput', `${job} ${place}`)
  .click('#searchbox-searchbutton')
  .wait('div.section-result')
  .evaluate(() => {
    const results = []

    Array.from(document
      .querySelectorAll('h3.section-result-title span.section-result-location'))
      .map(result => {
        const resultText = result.innerText
        results.push({resultText})
        // return result.innerText
      });
      return results
      
    })
    .end()
  .then((data) => {
    console.dir(data, {depth:null})
  })
  .catch(error => {
    console.error('Search failed:', error)
  })
}



getResultsFromGoogleMaps(job, place);