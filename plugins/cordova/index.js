var version = require('../../src/version');
var windowHandler = require('../../src/helper/window');
var PluginHandler = require('./plugin-handler');
var BrowserViewHandler = require('./browser-view-handler');

function CordovaPlugin() {
  this.webAuth = null;
  this.pluginHandler = null;
  this.version = version.raw;
  this.extensibilityPoints = [
    'popup.authorize',
    'popup.getPopupHandler'
  ];
}

/**
 * @param {WebAuth} webAuth
 */
CordovaPlugin.prototype.setWebAuth = function (webAuth) {
  this.webAuth = webAuth;
};

/**
 * @returns {boolean}
 */
CordovaPlugin.prototype.supports = function (extensibilityPoint) {
  var _window = windowHandler.getWindow();
  return (!!_window.cordova || !!_window.electron) &&
          this.extensibilityPoints.indexOf(extensibilityPoint) > -1;
};


/**
 * @returns {PluginHandler}
 */
CordovaPlugin.prototype.init = function () {
  if (!this.pluginHandler) {
    this.pluginHandler = new PluginHandler(this.webAuth);
  }

  return this.pluginHandler;
};

/**
 * @param {string} url
 * @returns {string}
 */
CordovaPlugin.finishAuth = function (url) {
    return BrowserViewHandler.finishAuth(url);
};

module.exports = CordovaPlugin;
