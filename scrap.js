const Nightmare = require('nightmare');
const nightmare = Nightmare({ show: true });
const args = process.argv.slice(2);
const job = args[0];
const place = args[1];

getListLenghtForOnePage = () => {
  return nightmare
    .evaluate(() => {
    const resultsHTML = document.querySelectorAll('div.section-result-text-content');

    return resultsHTML && Array.from(resultsHTML).length;
    })
  ;
}

getListLengthAdsForOnePage = () => {
  return nightmare
    .evaluate(() => {
      const adsHTML = document.querySelectorAll('div[data-result-ad-type="2"]');

      return adsHTML && Array.from(adsHTML).length;
    })
  ;
}

clickItemAndGetDetails = (index) => {
  return nightmare
    .click(`div[data-result-index="${index}"]`)
    .wait('h1.section-hero-header-title-title')
    .evaluate(() => {
      const regex = /\n/gm
      const websiteSelector = document.querySelector('div[data-tooltip="Open website"]');
      const nameSelector = document.querySelector('h1.section-hero-header-title-title');
      const addressSelector = document.querySelector('div[data-tooltip="Copy address"]');
      const phoneSelector = document.querySelector('div[data-tooltip="Copy phone number"]');
      const name = nameSelector && nameSelector.innerText;
      const address = addressSelector && addressSelector.innerText;
      const website = websiteSelector && websiteSelector.innerText;
      const phone = phoneSelector && phoneSelector.innerText;
      const cleanName = name && name.replace(regex, '');
      const cleanAddress = address && address.replace(regex, '');
      const cleanWebsite = website && website.replace(regex, '');
      const cleanPhone = phone && phone.replace(regex, '');
          
      return {name: cleanName, address: cleanAddress, website: cleanWebsite, phone: cleanPhone};
    })
  ;
}

clickBackAndWait = (nextIndex, listLength) => {
  if (nextIndex >= listLength) {
    return nightmare
      .click('button.section-back-to-list-button')
      .wait(`div[data-result-index="1"]`)
    ;
  } else {
    return nightmare
      .click('button.section-back-to-list-button')
      .wait(`div[data-result-index="${nextIndex}"]`)
    ;
  }
}

getResultsForOnePage = async (listLength) => {
  const adsLength = await getListLengthAdsForOnePage();
  const newListLength = listLength - adsLength;
  const allDetails = [];

  if (newListLength) {
    for (let i = 1 ; i <= newListLength ; i++) {
      const details = await clickItemAndGetDetails(i);
      allDetails.push(details);
      await clickBackAndWait(i+1, newListLength);
      }
    return allDetails;
  }
  return [];
}

nextPage = () => {
  console.log('next page')
  return nightmare
    .click('button[aria-label=" Next page "]')
    .wait(5000)
  ;
}

checkClassDisabled = () => {
  return nightmare.exists('button[aria-label=" Next page "].n7lv7yjyC35__button-disabled');
}

browseAllPages = async (isDisabled, results, listLength2) => {
  if(!isDisabled && listLength2 > 0) {
    await nextPage();
    const listLength = await getListLenghtForOnePage(job, place);
    const infosPage = await getResultsForOnePage(listLength);
    const gatherInfos = await [...results, ...infosPage];
    const isButtonDisabled = await checkClassDisabled();

    return browseAllPages(isButtonDisabled, gatherInfos, listLength);
  }

  return results;
}

goToWebsite = async (job, place) => {
  try {
    const connection = await nightmare
      .goto(`https://www.google.fr/maps/search/${job}+${place}`)
      .wait('div.section-result')
    ;

    return await connection
  }
  catch(e) {
    console.log('error try connection', e)
    // Error: .wait() for div.section-result timed out after 30000msec
    return nightmare.end()
  }
}

getResultsFromGoogleMaps = async (job, place) => {
  try {
    console.log('Veuillez patientez...')
    if (job && place) {

      await module.exports.goToWebsite(job, place);

      // goto search first page and return length of results
      const listLength = await getListLenghtForOnePage(job, place);
      // get page results
      const infosPage = await getResultsForOnePage(listLength);
      // check if next button is disabled
      const isButtonDisabled = await checkClassDisabled();
      // recursive function to get data until next button exists
      const results = await browseAllPages(isButtonDisabled, infosPage, listLength);
      console.log('RESULTS', results);
      console.log('RESULTS LENGTH', results.length);

      return [results, nightmare.end()];
    }
  }
  catch(e) {
    console.log('Une erreur s\'est produite, avez-vous bien saisi les deux paramètres : job puis place?')
    nightmare.end();
    throw new Error(e);
  }
}

getResultsFromGoogleMaps(job, place);

module.exports = {
  getResultsFromGoogleMaps,
  goToWebsite
}