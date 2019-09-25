const Nightmare = require('nightmare')
const nightmare = Nightmare({ show: false })

const args = process.argv.slice(2)
const job = args[0];
const place = args[1];


getDetailsUrl = (job, place, index) => {
  return nightmare
  .goto('https://www.google.fr/maps')
  .type('#searchboxinput', `${job} ${place}`)
  .click('#searchbox-searchbutton')
  .wait('div.section-result')      
  .then(() => {
    return nightmare
    .click(`div[data-result-index="${index}"]`)
    .wait('.section-hero-header-title-description')
    .url()
  })
  .catch((error) =>{ 
    console.error('an error has occurred: ' + error);
  });
}

getListLenghtForOnePage = (job, place) => {
  return nightmare
  .goto(`https://www.google.fr/maps/search/${job}+${place}`)
  .wait('div.section-result')
  .evaluate(() => {
    const resultsHTML = document.querySelectorAll('div.section-result-text-content')
    return Array.from(resultsHTML).length
  })
}


getResultsFromGoogleMaps = async (job, place) => {

  const detailsLinks = [];
  const listLength = await getListLenghtForOnePage(job, place);
  console.log('get list length', listLength);

  for (let i = 0 ; i < listLength ; i++) {
    const url = await getDetailsUrl(job, place, i)
    detailsLinks.push(url);
  }
  console.log('get url', detailsLinks) 
  console.log('get url', detailsLinks.length) 







}

getResultsFromGoogleMaps(job, place);