const { getResultsFromGoogleMaps } = require('./scrap.js');
const jobExample = 'taxidermiste'
const placeExample = 'paris'

getResult = async () => {
  const callResults = await getResultsFromGoogleMaps(jobExample, placeExample);
  console.log('callResults', callResults[0]);
  return callResults[1].end()
}
getResult();
