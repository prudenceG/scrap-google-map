const { getResultsFromGoogleMaps } = require('./scrap.js');

getResult = async () => {
  const results = await getResultsFromGoogleMaps('fleuriste', 'honfleur');
  console.log('results', results);
}

getResult();
