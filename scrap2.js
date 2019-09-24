const Nightmare = require('nightmare'),
  nightmare = Nightmare({
    show: true
  });

const args = process.argv.slice(2)
const job = args[0];
const place = args[1];

// getResultsFromGoogleMaps = (job, place) => {


nightmare
  //load a url
  .goto('https://www.google.fr/maps')
  //simulate typing into an element identified by a CSS selector
  //here, Nightmare is typing into the search bar
  .type('#searchboxinput', `Fleuriste Paris`)
  //click an element identified by a CSS selector
  //in this case, click the search button
  .click('#searchbox-searchbutton')
  //wait for an element identified by a CSS selector
  //in this case, the body of the results
  .wait('div.section-result')
  //execute javascript on the page
  //here, the function is getting the HREF of the first search result
  .evaluate(() => {
    return document.querySelector('.section-result h3.section-result-title')
      .innerText;
  })
  //run the queue of commands specified, followed by logging the HREF
  .then((result) => {
    console.log(result);
  })
  .then(() => {
    //since Nightmare has an internal `.then()`, return the instance returned by the final call in the chain
    return nightmare
      //click the next button to get the next page of search results
      .click('.section-result')
      .wait('.section-hero-header-title-title')
      //get the first HREF from the second page of results
      .evaluate(() => {
        return document.querySelector('.section-info-text span.widget-pane-link')
          .innerText;
      })
  })
  .then((result) => {
    //log the second page search result's HREF
    console.log(result);
    
    //queue ending the Nightmare instance along with the Electron instance it wraps
    //again, return the instance to leverage the internal `.then()`
    return nightmare.end();
  })
  //run the queue of commands specified
  //in this case, `.end()`
  .then(() => {
    console.log('done');
  })
  //catch errors if they happen
  .catch((error) =>{ 
    console.error('an error has occurred: ' + error);
  });

// }

// getResultsFromGoogleMaps(job, place);