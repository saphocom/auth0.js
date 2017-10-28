var urljoin = require('url-join');
var urlHelper = require('../../src/helper/url');
var PopupHandler = require('./popup-handler');
var BrowserViewHandler= require('./browser-view-handler');

/**
 * @param {WebAuth} webAuth
 * @constructor
 */
function PluginHandler(webAuth) {
    this.webAuth = webAuth;
}

/**
 * @param {Object} params
 * @returns {Object} Modified params
 */
PluginHandler.prototype.processParams = function (params) {
    this.params = params;

    if (this._canUseBrowserView(params.redirectUri)) {
        params.redirectUri = urlHelper.schemeToClearTopIntent(params.redirectUri);
    } else {
        console.log('Auth0 needs safariviewcontroller and customurlscheme plugins to work correctly in Cordova environment. Falling back to legacy mode..');
        params.redirectUri = urljoin('https://' + params.domain, 'mobile');
    }

    delete params.owp;
    return params;
};

PluginHandler.prototype.getPopupHandler = function () {
    if (!this.params || !this._canUseBrowserView(this.params.redirectUri)) {
        return new PopupHandler(this.webAuth);
    }

    return new BrowserViewHandler(this.webAuth);
};

/**
 * Whether Browser view is available in current constellation
 *
 * @param redirectUri
 * @returns {boolean}
 * @private
 */
PluginHandler.prototype._canUseBrowserView = function(redirectUri) {
    return typeof window === 'object' && typeof window.SafariViewController === 'object';
//         //&& SafariViewController.isAvailable() //can't use async isAvailable() here. Make Plugin flow async?
//         && (!/^http(s)?:\/\//.test(redirectUri) || /=(?!http)[a-z]+%3A%2F%2F/.test(redirectUri));
};

module.exports = PluginHandler;
