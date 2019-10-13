/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

'use strict';

const Twitter = require('twitter');

const {
  Notifier,
  Outlet,
} = require('gateway-addon');

class TwitterOutlet extends Outlet {
  constructor(notifier, id, config) {
    super(notifier, id);
    this.name = 'Twitter';
    this.config = config;

    const keys = {
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

  notify(title, message) {
    return this.send(message);
  }

  async send(message) {
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

class TwitterNotifier extends Notifier {
  constructor(addonManager, manifest) {
    super(addonManager, TwitterNotifier.name, manifest.name);

    addonManager.addNotifier(this);

    if (!this.outlets[TwitterNotifier.name]) {
      this.handleOutletAdded(
        new TwitterOutlet(this, TwitterNotifier.name, manifest.moziot.config)
      );
    }
  }
}

module.exports = TwitterNotifier;
