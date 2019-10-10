const scrap = require('../scrap');
describe("scrap file", () => {
  describe("getResultsFromGoogleMaps function", () => {
    describe("gotowebsite function", () => {
      it("should have 2 parameters", () => {
        spyOn(scrap, 'goToWebsite');
        scrap.getResultsFromGoogleMaps('fleuriste', 'honfleur')
        expect(scrap.goToWebsite).toHaveBeenCalledWith('fleuriste', 'honfleur')
      })
    })
  })
});