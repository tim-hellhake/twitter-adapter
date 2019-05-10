# Twitter Adapter

[![Build Status](https://travis-ci.org/tim-hellhake/twitter-adapter.svg?branch=master)](https://travis-ci.org/tim-hellhake/twitter-adapter)
[![dependencies](https://david-dm.org/tim-hellhake/twitter-adapter.svg)](https://david-dm.org/tim-hellhake/twitter-adapter)
[![devDependencies](https://david-dm.org/tim-hellhake/twitter-adapter/dev-status.svg)](https://david-dm.org/tim-hellhake/twitter-adapter?type=dev)
[![optionalDependencies](https://david-dm.org/tim-hellhake/twitter-adapter/optional-status.svg)](https://david-dm.org/tim-hellhake/twitter-adapter?type=optional)
[![license](https://img.shields.io/badge/license-MPL--2.0-blue.svg)](LICENSE)

Send tweets.

## Configuration
1. Go to https://developer.twitter.com/en/apps
2. Create a new app
3. Go to `Keys and tokens`
4. Create `Access token & access token secret`
5. Copy all 4 keys to the addon config

## Usage
The addon registers a twitter device with a `tweet(message)` action.

Currently, a rule can only trigger parameterless actions.

To send twitter messages from a rule, you have to register an action with a predefined message.

Go to the settings of the addon and add a rule with a name and a message of your choice.

The twitter device now provides a new action with the specified name you can use in a rule.
