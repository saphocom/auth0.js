// given a URL, extract the origin. Taken from: https://github.com/firebase/firebase-simple-login/blob/d2cb95b9f812d8488bdbfba51c3a7c153ba1a074/js/src/simple-login/transports/WinChan.js#L25-L30
function extractOrigin(url) {
  if (!/^https?:\/\//.test(url)) url = window.location.href;
  var m = /^(https?:\/\/[-_a-zA-Z.0-9:]+)/.exec(url);
  if (m) return m[1];
  return url;
}

/**
 * Converts standard url to Intent Anchor format with FLAG_ACTIVITY_CLEAR_TOP flag
 * to return back to the MAIN activity without destroying and starting whole new task (destroys other activities than
 * MAIN in target task stack).
 *
 * @see https://developer.android.com/reference/android/content/Intent.html
 *
 * Example for Android:
 * 'mycoolapp://callback' -> 'intent://bar#Intent;scheme=mycoolapp;launchFlags=67108864;end;'
 *
 * @param {string} url
 * @returns {string}
 * @private
 */
function schemeToClearTopIntent(url) {
    if ('string' !== typeof url) return url;

    var FLAG_ACTIVITY_CLEAR_TOP = 67108864;
    if (_isAndroid()) {
        return url.replace(
            /^([a-zA-Z]+[a-zA-Z0-9\+\-\.]*)(:\/\/.*)/, //@see https://tools.ietf.org/html/rfc3986#section-3.1
            'intent$2#Intent;scheme=$1;launchFlags=' + FLAG_ACTIVITY_CLEAR_TOP + ';end;'
        );
    }

    return url;
}

/**
 * @returns {boolean}
 * @private
 */
function _isAndroid() {
    try {
        return navigator.userAgent.indexOf('Android') != -1;
    } catch(e) {
        //intentionally
    }
    return false;
}

module.exports = {
  extractOrigin: extractOrigin,
  schemeToClearTopIntent: schemeToClearTopIntent
};
