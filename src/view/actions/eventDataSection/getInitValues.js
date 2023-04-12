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

import { isObject } from '../../utils/validators';

export default ({ settings }) => {
  const event = settings?.event || '';
  const {
    time = '',
    token = '',
    distinct_id = '',
    $insert_id = ''
  } = settings?.properties || {};

  let eventPropertiesRaw = settings?.custom_properties || '';

  if (
    isObject(eventPropertiesRaw) &&
    Object.keys(eventPropertiesRaw).length === 0
  ) {
    eventPropertiesRaw = '';
  }

  if (typeof eventPropertiesRaw === 'object') {
    eventPropertiesRaw = JSON.stringify(eventPropertiesRaw, null, 2);
  }

  return {
    eventPropertiesType: 'raw',
    eventPropertiesRaw,
    eventPropertiesJsonPairs: [],
    event,
    properties: {
      time,
      token,
      distinct_id,
      $insert_id
    }
  };
};
