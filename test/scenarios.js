'use strict';

/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */

describe('eDelivery App', function() {

  it('should redirect index.html to #/main', function() {
    browser().navigateTo('index.html');
    expect(browser().location().url()).toBe('/main');
  });

describe('Chart View', function() {
	
	    beforeEach(function() {
      browser().navigateTo('..#/chart');
    });

  it('should redirect #/chart', function() {
    expect(browser().location().url()).toBe('/chart');
  });
});
});
