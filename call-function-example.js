const { getResultsFromGoogleMaps } = require('./scrap.js');
const jobExample = 'fleuriste'
const placeExample = 'Honfleur'

getResult = async () => {
  const callResults = await getResultsFromGoogleMaps(jobExample, placeExample);
  console.log('callResults', callResults);
}
getResult();
