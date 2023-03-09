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

import parseJson from '../../utils/parseJson';
import { isDataElementToken, isObject } from '../../utils/validators';
import checkRequired from '../../utils/checkRequired';

export default ({
  eventPropertiesJsonPairs = [],
  eventPropertiesType,
  eventPropertiesRaw,
  event,
  properties = {}
}) => {
  const errors = {};
  const { token } = properties;

  if (eventPropertiesType === 'raw') {
    if (eventPropertiesRaw) {
      if (isDataElementToken(eventPropertiesRaw)) {
        return errors;
      }

      const { message = '', parsedJson } = parseJson(eventPropertiesRaw);
      if (message || !isObject(parsedJson)) {
        return {
          eventPropertiesRaw: `Please provide a valid JSON object or a data element.${
            message ? ` ${message}.` : ''
          }`
        };
      }
    }
  } else {
    eventPropertiesJsonPairs.forEach((q, index) => {
      if (!q.key && q.value) {
        errors[`eventPropertiesJsonPairs.${index}.key`] =
          'Please provide a key name.';
      }
    });
  }

  [
    ['event', event, 'an event name'],
    ['properties.token', token, 'a project token']
  ].forEach(([key, value, errorVariableDescription]) => {
    checkRequired(key, value, errorVariableDescription || `a ${key}`, errors);
  });

  return errors;
};
