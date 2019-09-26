const Nightmare = require('nightmare')
const nightmare = Nightmare({ show: true })

const args = process.argv.slice(2)
const job = args[0];
const place = args[1];


clickLoop = (listLength) => {
  const links = []
  for (let i = 0 ; i < listLength ; i++) {
    const link = nightmare
      .click(`div[data-result-index="${i}"]`)
      .wait('.section-hero-header-title-description')
      .url()
      .then(url => {
        links.push(url)
        console.log('url loop', url)
      })
      console.log('links click loop', links)

  }
  return links
}

getDetailsUrl = (job, place, index) => {
  return nightmare
  .goto('https://www.google.fr/maps')
  .type('#searchboxinput', `${job} ${place}`)
  .click('#searchbox-searchbutton')
  .wait('div.section-result')      
  .then(async () => {
    const link = await clickLoop(index);
    console.log('link', link)
  })
  .catch((error) =>{ 
    console.error('an error has occurred: ' + error);
  });
}

getListLenghtForOnePage = () => {
  return nightmare
  .evaluate(() => {
    const resultsHTML = document.querySelectorAll('div.section-result-text-content')
    return resultsHTML && Array.from(resultsHTML).length
  })
}


clickItemAndGetDetails = (index) => {
  
  return nightmare
  .click(`div[data-result-index="${index}"]`)
  .wait('h1.section-hero-header-title-title')
  .evaluate(() => {
    const regex = /\n/g

    const websiteSelector = document.querySelector('div[data-tooltip="Open website"]');
    const nameSelector = document.querySelector('h1.section-hero-header-title-title');
    const addressSelector = document.querySelector('div[data-tooltip="Copy address"]');
    const phoneSelector = document.querySelector('div[data-tooltip="Copy phone number"]');
    const name = nameSelector && nameSelector.innerText
    let address = addressSelector && addressSelector.innerText;
    const website = websiteSelector && websiteSelector.innerText;
    const phone = phoneSelector && phoneSelector.innerText;
        
    return {name, address, website, phone}
  })
     
}

clickBackAndWait = (nextIndex, listLength) => {
  if (nextIndex >= listLength) {
    return nightmare
      .click('button.section-back-to-list-button')
      .wait(`div[data-result-index="1"]`)
  } else {
    return nightmare
      .click('button.section-back-to-list-button')
      .wait(`div[data-result-index="${nextIndex}"]`)
  }
}

getResultsForOnePage = async (listLength) => {
  const allDetails = [];
  if (listLength) {
    for (let i = 1 ; i < listLength ; i++) {
      const details = await clickItemAndGetDetails(i);
      allDetails.push(details)
      await clickBackAndWait(i+1, listLength)
  
      // const url = await getDetailsUrl(job, place, listLength)
    }
    console.log(allDetails)
    return allDetails;
  }
  console.log('results not found')
  return []
}

nextPage = () => {
  console.log('nextpage')
  return nightmare
    .click('button[aria-label=" Next page "]')
    .wait(3000)
}

checkClassDisabled = () => {
  return nightmare
    .exists('button[aria-label=" Next page "].n7lv7yjyC35__button-disabled')
}


disabledButton = async (isDisabled, gatherInfos, listLength2) => {
  if(!isDisabled && listLength2 > 0) {
    await nextPage()
    const listLength = await getListLenghtForOnePage(job, place);
    const infosPage = await getResultsForOnePage(listLength)
    const gatherInfos2 = await [...gatherInfos, ...infosPage]
    console.log('gatherInfos2', gatherInfos2)
    console.log('gatherInfos2', gatherInfos2.length)
    const isButtonDisabled = await checkClassDisabled()
    disabledButton(isButtonDisabled, gatherInfos2, listLength)

    return gatherInfos2;

  } 
    console.log('end', gatherInfos.length)
    return gatherInfos; 
  
}

getResultsFromGoogleMaps = async (job, place) => {

  nightmare
  .goto(`https://www.google.fr/maps/search/${job}+${place}`)
  .wait('div.section-result')
  
  // goto search first page and return length of results
  const listLength = await getListLenghtForOnePage(job, place);
  // get page results
  const infosPage = await getResultsForOnePage(listLength)
  // check if next button is disabled
  const isButtonDisabled = await checkClassDisabled()
  // recursive function until next button exists
  const results = await disabledButton(isButtonDisabled, infosPage, listLength)
  console.log('finish')
  
  console.log('ALL RESULTS', results)
  console.log('ALL RESULTS', results.length)


  return results;




// if (isButtonDisabled) {
//   console.log('no datas')
// } else {
//   action(isButtonDisabled)

// }


 
}

// action = (isButtonDisabled) => {
//   const results = []
//   const listLength = await getListLenghtForOnePage(job, place); 
//   const detailsUrl = await getResultsForOnePage(listLength)
//   results.push(detailsUrl);
//   const isButtonDisabled = await nextAndCheckNextPage()

//   action(isButtonDisabled)
  
// }

getResultsFromGoogleMaps(job, place);