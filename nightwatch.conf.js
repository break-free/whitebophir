// Autogenerated by Nightwatch
// Refer to the online docs for more details: https://nightwatchjs.org/gettingstarted/configuration/
const Services = {}; loadServices();

module.exports = {
  "src_folders": ["tests"],

  "test_workers": {
    "enabled": true,
    "workers": "auto"
  },

  "webdriver": {
    "start_process": true,
    "server_path": "./node_modules/.bin/geckodriver",
    "cli_args": [
      "--log", "debug"
    ],
    "port": 4444,
  },

  "test_settings": {
    "default": {
      "launch_url": "",
      "desiredCapabilities": {
        "browserName": "firefox",
        "acceptInsecureCerts": true,
        "alwaysMatch": {
          "moz:firefoxOptions": {
            "w3c": false,
            "args": ["-headless"]
            
          }
        }

      }
    }
  }
};

function loadServices() {
  try {
    Services.seleniumServer = require('selenium-server');
  } catch (err) { }

  try {
    Services.chromedriver = require('chromedriver');
  } catch (err) { }

  try {
    Services.geckodriver = require('geckodriver');
  } catch (err) { }
}
