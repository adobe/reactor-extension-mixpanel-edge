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

import { screen } from '@testing-library/react';
import renderView from '../../__tests_helpers__/renderView';

import SendEvent from '../sendEvent';
import createExtensionBridge from '../../__tests_helpers__/createExtensionBridge';

import { changeInputValue } from '../../__tests_helpers__/jsDomHelpers';

let extensionBridge;

beforeEach(() => {
  extensionBridge = createExtensionBridge();
  window.extensionBridge = extensionBridge;
});

afterEach(() => {
  delete window.extensionBridge;
});

const getFormFields = () => ({
  projectTokenInput: screen.getByLabelText(/project token/i, {
    selector: '[name="properties.token"]'
  }),
  eventNameInput: screen.getByLabelText(/event name/i, {
    selector: '[name="event"]'
  }),
  eventTimeInput: screen.getByLabelText(/event time/i, {
    selector: '[name="properties.time"]'
  }),
  distinctIdInput: screen.getByLabelText(/distinct id/i, {
    selector: '[name="properties.distinct_id"]'
  }),
  insertIdInput: screen.getByLabelText(/insert id/i, {
    selector: '[name="properties.$insert_id"]'
  }),
  eventPropertiesRawTextarea: screen.getByLabelText(/event properties raw/i)
});

describe('SendEvent view', () => {
  test('sets form values from settings', async () => {
    renderView(SendEvent);

    extensionBridge.init({
      settings: {
        event: 'buy',
        properties: {
          token: 'ABC',
          time: '123',
          distinct_id: 'AZS2',
          $insert_id: '1SD',
          custom: 'value'
        }
      }
    });

    const {
      projectTokenInput,
      distinctIdInput,
      insertIdInput,
      eventNameInput,
      eventTimeInput,
      eventPropertiesRawTextarea
    } = getFormFields();

    expect(projectTokenInput.value).toBe('ABC');
    expect(distinctIdInput.value).toBe('AZS2');
    expect(insertIdInput.value).toBe('1SD');
    expect(eventNameInput.value).toBe('buy');
    expect(eventTimeInput.value).toBe('123');
    expect(eventPropertiesRawTextarea.value).toBe('{\n  "custom": "value"\n}');
  });

  test('sets settings from form values', async () => {
    renderView(SendEvent);

    extensionBridge.init();

    const {
      projectTokenInput,
      distinctIdInput,
      insertIdInput,
      eventNameInput,
      eventTimeInput,
      eventPropertiesRawTextarea
    } = getFormFields();

    await changeInputValue(projectTokenInput, 'token');
    await changeInputValue(distinctIdInput, 'distinct id');
    await changeInputValue(insertIdInput, 'insert id');
    await changeInputValue(eventNameInput, 'buy');
    await changeInputValue(eventTimeInput, '123');
    await changeInputValue(eventPropertiesRawTextarea, '{{"a":"b"}');

    expect(extensionBridge.getSettings()).toEqual({
      event: 'buy',
      properties: {
        token: 'token',
        distinct_id: 'distinct id',
        $insert_id: 'insert id',
        time: '123',
        a: 'b'
      }
    });
  });

  test('handles form validation correctly', async () => {
    renderView(SendEvent);

    extensionBridge.init();

    const { projectTokenInput, eventNameInput } = getFormFields();

    await extensionBridge.validate();

    expect(projectTokenInput).toHaveAttribute('aria-invalid', 'true');
    expect(eventNameInput).toHaveAttribute('aria-invalid', 'true');
  });
});
