/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

'use strict';

import Twitter from 'twitter';

import { Notifier, Outlet } from 'gateway-addon';

class TwitterOutlet extends Outlet {
  private config: any;
  private client: Twitter;

  constructor(notifier: Notifier, config: any) {
    super(notifier, TwitterOutlet.name);
    this.name = 'Twitter';
    this.config = config;

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

  notify(_title: string, message: string) {
    return this.send(message);
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

export class TwitterNotifier extends Notifier {
  outlets: any;
  constructor(addonManager: any, manifest: any) {
    super(addonManager, TwitterNotifier.name, manifest.name);

    addonManager.addNotifier(this);

    if (!this.outlets[TwitterNotifier.name]) {
      this.handleOutletAdded(
        new TwitterOutlet(this, manifest.moziot.config)
      );
    }
  }
}
