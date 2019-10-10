const exportFunctions = require('../test-functions');

describe("test functions file", () => {
  describe("triggerHello function", () => {
    it("should trigger writeHello function", () => {
      spyOn(exportFunctions, 'writeHello').and.callThrough()
      exportFunctions.triggerHello('Hello')
      expect(exportFunctions.writeHello).toHaveBeenCalledWith('Hello')
    })
  })
});