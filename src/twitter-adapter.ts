/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

'use strict';

import Twitter from 'twitter';

import { Adapter, Device } from 'gateway-addon';

const notifyDescription = {
  '@type': 'NotificationAction',
  title: 'tweet',
  description: 'Send a tweet',
  input: {
    type: 'object',
    properties: {
      message: {
        type: 'string'
      }
    }
  }
};

class TwitterDevice extends Device {
  private config: any;
  private messages: { [key: string]: string };
  private client: Twitter;

  constructor(adapter: Adapter, manifest: any) {
    super(adapter, manifest.display_name);
    this['@context'] = 'https://iot.mozilla.org/schemas/';
    this.name = manifest.display_name;
    this.description = manifest.description;
    this.config = manifest.moziot.config;

    this.addAction(notifyDescription.title, notifyDescription);

    this.messages = {};

    if (this.config.messages) {
      for (const message of this.config.messages) {
        this.messages[message.name] = message.message;

        const action = {
          '@type': notifyDescription['@type'],
          title: message.name,
          description: notifyDescription.description
        };

        console.log(`Creating action for ${message.name}`);
        this.addAction(message.name, action);
      }
    }

    const keys: any = {
      consumer_key: this.config.consumer_key,
      consumer_secret: this.config.consumer_secret,
      access_token_key: this.config.access_token_key,
      access_token_secret: this.config.access_token_secret
    };

    for (const key in keys) {
      if (!keys[key]) {
        console.error(`No ${key} specified`);
      }
    }

    this.client = new Twitter(keys);
  }

  async performAction(action: any) {
    action.start();

    if (action.name === notifyDescription.title) {
      await this.send(action.input.message);
    } else {
      const message = this.messages[action.name];

      if (message) {
        await this.send(message);
      } else {
        console.warn(`Unknown action ${action}`);
      }
    }

    action.finish();
  }

  async send(message: string) {
    console.log(`Sending tweet: ${message}`);
    const tweet = {
      status: message
    };

    this.client.post('statuses/update', tweet, (errors) => {
      if (errors) {
        for (const error of errors) {
          console.error(`Could not send tweet: ${error.message}`);
        }
      }
    });
  }
}

export class TwitterAdapter extends Adapter {
  constructor(addonManager: any, manifest: any) {
    super(addonManager, TwitterAdapter.name, manifest.name);
    addonManager.addAdapter(this);
    const device = new TwitterDevice(this, manifest);
    this.handleDeviceAdded(device);
  }
}

module.exports = TwitterAdapter;
