const Nightmare = require('nightmare'),
  nightmare = Nightmare({
    show: true
  });

nightmare
  //load a url
  .goto('https://duckduckgo.com')
  //simulate typing into an element identified by a CSS selector
  //here, Nightmare is typing into the search bar
  .type('#search_form_input_homepage', 'github nightmare')
  //click an element identified by a CSS selector
  //in this case, click the search button
  .click('#search_button_homepage')
  //wait for an element identified by a CSS selector
  //in this case, the body of the results
  .wait('#r1-0 a.result__a')
  //execute javascript on the page
  //here, the function is getting the HREF of the first search result
  .evaluate(() => {
    return document.querySelector('#r1-0 a.result__a')
      .href;
  })
  //run the queue of commands specified, followed by logging the HREF
  .then((result) => {
    console.log(result);
  })
  .then(() => {
    //since Nightmare has an internal `.then()`, return the instance returned by the final call in the chain
    return nightmare
      //click the next button to get the next page of search results
      .click('.js-zci-link--news')
      .wait('.result--news a.result__url')
      //get the first HREF from the second page of results
      .evaluate(() => {
        return document.querySelector('.result--news a.result__url')
          .href;
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