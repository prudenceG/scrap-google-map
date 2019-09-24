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
  .evaluate(() => document.querySelector('div.section-result h3.section-result-title span').innerHTML)
  .end()
  .then(console.log)
  .catch(error => {
    console.error('Search failed:', error)
  })
}

getResultsFromGoogleMaps(job, place);