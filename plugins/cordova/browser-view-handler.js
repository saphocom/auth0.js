var qs = require('qs');
var urlHelper = require('../../src/helper/url');

var _onCustomSchemaRedirect = null;

/**
 * @param {WebAuth} webAuth
 * @constructor
 */
function BrowserViewHandler(webAuth) {
    this.webAuth = webAuth;
}

/**
 * @param {string} url
 * @param {string} relayUrl
 * @param {Object} popOpts
 * @param {Function} cb
 */
BrowserViewHandler.prototype.load = function(url, relayUrl, popOpts, cb) {
    var browser = this._openBrowserSession(url, function(error, result) {
        if (error != null) {
            cb(error);
        }

        if (result.event === 'closed') {
            cb(new Error('Browser closed'));
        }
    });

    _onCustomSchemaRedirect = function(url) {
        browser.hide();

        //cb(null, qs.parse(url)); //this shows up in `authenticated` event handler and can tend to use data here but the only reliable code point to sign-in is custom-schema handler
        cb(null, {}); //finish & close Lock modal
    };
};

/**
 * @param {string} url
 * @returns {string} Original redirect url to use as a param in accessToken exchange process
 */
BrowserViewHandler.finishAuth = function(url) {
    //cordova app state not lost? then finish Lock session
    _onCustomSchemaRedirect && _onCustomSchemaRedirect(url);

    return urlHelper.schemeToClearTopIntent(url);
};

/**
 * @param {string} url
 * @param {Function} cb
 * @returns {SafariViewController} Cordova Plugin
 * @private
 */
BrowserViewHandler.prototype._openBrowserSession = function(url, cb) {
    var browser = window.SafariViewController;

    var options = {
        hidden: false,
        url: url
    };

    browser.show(options, function (result) {
        cb(null, result);
    }, function (message) {
        cb(new Error(message));
    });

    return browser;
};


module.exports = BrowserViewHandler;
