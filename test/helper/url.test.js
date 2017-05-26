var expect = require('expect.js');

var url = require('../../src/helper/url');
var ANDROID_USERAGENT_SAMPLE = 'Mozilla/5.0 (Linux; Android 7.0; E5823 Build/32.3.A.2.33; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/58.0.3029.83 Mobile Safari/537.36',
    IOS_USERAGENT_SAMPLE = 'Mozilla/5.0 (iPad; CPU OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B14 3 Safari/601.1';

describe('url', () => {
    describe('.schemeToClearTopIntent()', () => {
        function f() { return url.schemeToClearTopIntent.apply(null, arguments) }

        context('On Adnroid', () => {
            before(() => global.navigator = {userAgent: ANDROID_USERAGENT_SAMPLE});
            after(() => delete global.navigator);

            it('converts standard url to Intent Anchor format', () => {
                expect(f('foo://bar'))
                    .to.be('intent://bar#Intent;scheme=foo;launchFlags=67108864;end;');

                expect(f('mycoolapp://auth0/callback?redirectUrl=https://mycoolapp.com/login-callback&state=%7B%22foo%22%3A%22bar%22%7D'))
                    .to.be('intent://auth0/callback?redirectUrl=https://mycoolapp.com/login-callback&state=%7B%22foo%22%3A%22bar%22%7D#Intent;scheme=mycoolapp;launchFlags=67108864;end;');
            });

            it('keeps empty input as is', () => {
                expect(f(undefined)).to.be(undefined);
                expect(f(null)).to.be(null);
                expect(f('')).to.be('');
            });

            it('keeps non url strings as is', () => {
                expect(f('foo bar')).to.be('foo bar');
                expect(f('  -')).to.be('  -');
            });
        });
         context('On IOS', () => {
             before(() => global.navigator = {userAgent: IOS_USERAGENT_SAMPLE});
             after(() => delete global.navigator);

             it('keeps format as is', () => {
                 expect(f('foo://bar?redirectUrl=https://mycoolapp.com/login-callback&state=%7B%22foo%22%3A%22bar%22%7D'))
                     .to.be('foo://bar?redirectUrl=https://mycoolapp.com/login-callback&state=%7B%22foo%22%3A%22bar%22%7D');
             });
         });
    });
});
