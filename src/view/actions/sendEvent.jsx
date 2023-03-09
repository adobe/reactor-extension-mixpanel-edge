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
import React from 'react';

import { Content, Link, Text } from '@adobe/react-spectrum';
import ExtensionView from '../components/extensionView';

import EventDataFields from './eventDataSection/fields';
import getEventDataInitValues from './eventDataSection/getInitValues';
import getEventDataSettings from './eventDataSection/getSettings';
import validateEventDataFields from './eventDataSection/validate';

export default function SendCapiData() {
  return (
    <ExtensionView
      getInitialValues={({ initInfo }) => ({
        ...getEventDataInitValues(initInfo)
      })}
      getSettings={({ values }) => ({
        ...getEventDataSettings(values)
      })}
      validate={(values) => ({
        ...validateEventDataFields(values)
      })}
      render={() => (
        <>
          <Content>
            <Text>These events will be sent to Mixpanel using the</Text>{' '}
            <Link>
              <a
                href="https://developer.mixpanel.com/reference/track-event"
                target="_blank"
                rel="noreferrer"
              >
                Track Events
              </a>
            </Link>{' '}
            endpoint.
          </Content>
          <EventDataFields />
        </>
      )}
    />
  );
}
