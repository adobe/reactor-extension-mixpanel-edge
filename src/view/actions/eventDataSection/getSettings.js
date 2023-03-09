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

import { addToEntityFromVariables } from '../../utils/entityVariablesConverter';

export default ({
  eventPropertiesType,
  eventPropertiesRaw,
  eventPropertiesJsonPairs,
  event,
  properties
}) => {
  let data;
  const settings = {};

  if (event) {
    settings.event = event;
  }

  ['token', 'time', 'distinct_id', '$insert_id'].forEach((k) => {
    if (properties[k]) {
      if (!settings.properties) {
        settings.properties = {};
      }

      settings.properties[k] = properties[k];
    }
  });

  if (eventPropertiesType === 'json') {
    data = addToEntityFromVariables(
      {},
      eventPropertiesJsonPairs.filter((p) => p.key || p.value)
    );

    if (Object.keys(data).length === 0) {
      data = null;
    }
  } else {
    try {
      data = JSON.parse(eventPropertiesRaw);
    } catch {
      data = eventPropertiesRaw;
    }
  }
  if (data) {
    if (!settings.properties) {
      settings.properties = {};
    }

    settings.properties = {
      ...settings.properties,
      ...data
    };
  }

  return settings;
};
