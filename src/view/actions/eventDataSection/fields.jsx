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

/* eslint-disable jsx-a11y/anchor-is-valid */

import React from 'react';
import { useFormContext } from 'react-hook-form';

import {
  Heading,
  View,
  Link,
  ContextualHelp,
  Content
} from '@adobe/react-spectrum';
import getEmptyDataJson from './getEmptyValue';

import WrappedTextField from '../../components/wrappedTextField';
import EventPropertiesEditor from '../../components/rawJsonEditor';
import EventPropertiesRow from './row';

import {
  addToVariablesFromEntity,
  addToEntityFromVariables
} from '../../utils/entityVariablesConverter';

export default function EventDataSectionFields() {
  const { setValue, watch } = useFormContext();
  const [eventPropertiesRaw, eventPropertiesJsonPairs] = watch([
    'eventPropertiesRaw',
    'eventPropertiesJsonPairs'
  ]);

  return (
    <View>
      <Heading level="3">Event Data</Heading>

      <WrappedTextField
        name="properties.token"
        width="size-4600"
        label="Project token"
        isRequired
        necessityIndicator="label"
        supportDataElement
        contextualHelp={
          <ContextualHelp>
            <Heading>Need help?</Heading>
            <Content>
              <p>
                Every Mixpanel project has a unique alphanumerical token for
                collecting data. A project&rsquo;s token is not a secret value.
              </p>
              <p>
                It is important to note that a project&rsquo;s token is not a
                form of authorization. It is an identification sent along with
                each piece of data you send to your project.
              </p>
              <p>
                Learn more about the{' '}
                <Link>
                  <a
                    href="https://developer.mixpanel.com/reference/project-token"
                    rel="noreferrer"
                    target="_blank"
                  >
                    Project tokens
                  </a>
                </Link>
                .
              </p>
            </Content>
          </ContextualHelp>
        }
      />
      <WrappedTextField
        name="event"
        width="size-4600"
        label="Event Name"
        necessityIndicator="label"
        isRequired
        supportDataElement
      />

      <WrappedTextField
        name="properties.time"
        width="size-4600"
        label="Event Time"
        description={
          'The time at which the event occurred, in seconds or milliseconds since ' +
          'UTC epoch.'
        }
        supportDataElement
        contextualHelp={
          <ContextualHelp>
            <Heading>Need help?</Heading>
            <Content>
              <p>
                If not timestamp is provided, Mixpanel will generate one when it
                receives the event.
              </p>
            </Content>
          </ContextualHelp>
        }
      />

      <WrappedTextField
        name="properties.distinct_id"
        width="size-4600"
        label="Distinct ID"
        description="The unique identifier of the user who performed the event."
        supportDataElement
        contextualHelp={
          <ContextualHelp>
            <Heading>Need help?</Heading>
            <Content>
              <p>
                <strong>distinct_id</strong> identifies the user who performed
                the event. It must be specified on every event, as it is crucial
                for Mixpanel to perform behavioral analysis (unique users,
                funnels, retention, cohorts) correctly and efficiently.
              </p>
              <p>
                Events with an empty distinct_id will be excluded from all
                behavioral analysis.
              </p>
            </Content>
          </ContextualHelp>
        }
      />

      <WrappedTextField
        name="properties.$insert_id"
        width="size-4600"
        label="Insert ID"
        description="A unique identifier for the event, used for deduplication."
        supportDataElement
        contextualHelp={
          <ContextualHelp>
            <Heading>Need help?</Heading>
            <Content>
              <p>
                Events with identical values for (event, time, distinct_id,
                $insert_id) are considered duplicates; only the latest ingested
                one will be considered in queries.
              </p>
              <p>
                If not Insert ID is provided, Mixpanel will generate one when it
                receives the event.
              </p>
            </Content>
          </ContextualHelp>
        }
      />

      <EventPropertiesEditor
        label="Event Properties"
        radioLabel="Select the way you want to provide the event data"
        description="A valid JSON object or a data element."
        typeVariable="eventPropertiesType"
        rawVariable="eventPropertiesRaw"
        jsonVariable="eventPropertiesJsonPairs"
        getEmptyJsonValueFn={getEmptyDataJson}
        row={EventPropertiesRow}
        onTypeSwitch={(v) => {
          // Auto Update Data Content
          if (v === 'json') {
            let variables = [];
            try {
              variables = addToVariablesFromEntity(
                [],
                JSON.parse(eventPropertiesRaw)
              );
            } catch (e) {
              // Don't do anything
            }

            if (variables.length === 0) {
              variables.push(getEmptyDataJson());
            }

            setValue('eventPropertiesJsonPairs', variables, {
              shouldValidate: true,
              shouldDirty: true
            });
          } else if (
            eventPropertiesJsonPairs.length > 1 ||
            eventPropertiesJsonPairs[0].key
          ) {
            let entity = JSON.stringify(
              addToEntityFromVariables({}, eventPropertiesJsonPairs),
              null,
              2
            );

            if (entity === '{}') {
              entity = '';
            }

            setValue('eventPropertiesRaw', entity, {
              shouldValidate: true,
              shouldDirty: true
            });
          }
          // END: Auto Update Data Content
        }}
      />
    </View>
  );
}
