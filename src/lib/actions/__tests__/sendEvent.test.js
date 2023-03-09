/*
Copyright 2023 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

/* eslint-disable camelcase */

const sendEvent = require('../sendEvent');
const arc = {};

describe('Send Event module', () => {
  test('makes a fetch call to the provided url', () => {
    const fetch = jest.fn(() => Promise.resolve({}));

    const settings = {
      event: 'buy',
      properties: {
        token: 'token',
        time: '12345',
        'custom property': '1'
      }
    };

    const utils = {
      fetch: fetch,
      getSettings: () => settings
    };

    return sendEvent({ arc, utils }).then(() => {
      expect(fetch).toHaveBeenCalledWith('https://api.mixpanel.com/track', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          accept: 'text/plain'
        },
        body:
          '{' +
          '"event":"buy",' +
          '"properties":' +
          '{' +
          '"token":"token",' +
          '"time":"12345",' +
          '"custom property":"1"' +
          '}' +
          '}'
      });
    });
  });
});
