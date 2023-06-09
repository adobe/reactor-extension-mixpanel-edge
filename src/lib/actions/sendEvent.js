/*
Copyright 2022 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

/* eslint-disable camelcase */

const buildFetchObject = (settings) => {
  if (settings.custom_properties) {
    const c = settings.custom_properties;

    if (!settings.properties) {
      settings.properties = {};
    }

    settings.properties = {
      ...settings.properties,
      ...c
    };

    delete settings.custom_properties;
  }

  return {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      accept: 'text/plain'
    },
    body: JSON.stringify([settings])
  };
};

module.exports = async ({ utils }) => {
  const { getSettings, fetch } = utils;
  const settings = getSettings();

  return fetch('https://api.mixpanel.com/track', buildFetchObject(settings));
};
