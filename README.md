# Ecowitt GW1000 [DEPRECATED]

## Use [ECOWITT-GATEWAY](https://github.com/bmdevx/ecowitt-gateway) instead

![maintenance-status](https://img.shields.io/badge/maintenance-deprecated-red.svg)  ![npm](https://img.shields.io/npm/dt/ecowitt-gw1000?style=flat-square) ![npm](https://img.shields.io/npm/v/ecowitt-gw1000?style=flat-square) ![GitHub](https://img.shields.io/github/license/bmdevx/ecowitt-gw1000?style=flat-square)

## Features

* Gets Live Data
* Gets Device Information
* Get/Set Custom Server Configuration

### Requirements

* NodeJS 8+
* Ecowitt Gateway Firmware 1.5.7+ (1.5.9+ for CO2 and 1.6.4+ for Rain commands)

### Methods

``` js
getSensors({            //Optional filter can be by type and/or status. Accepts strings or arrays of strings for type and status.
    type: 'WH65',
    status: 'active'
})

getLiveData(filterActiveSensors = true) //Gets current Weather conditions.

getRainData()           //Gets Rain Data.

getRain()               //New method to get Rain information including, Rain Events

getSoilMoistureCalibration() //Gets Soil Moisture Calibration Data (including current analog and digital value for all connected sensors)

getPM25Offset()         // Gets PM25 Offset Data

getCO2Offset()          // Gets CO2 Offset Data

getFirmwareVersion()    //Gets current Firmware version.

getSystemParams()       //Gets System Parameters. (in development)

getMacAddr()            //Gets MAC Address

getCustomServerInfo()   //Gets Custom Server Information

setCustomServerInfo({   //Sets Custom Server Information (All Fields optional)
    station: 'STATION ID',  //Station Name
    key: 'KEY',             //Station Key
    server: '127.0.0.1',    //Server Location
    port: 3000,             //Port Number
    interval: 60,           //Interval to send update in seconds(minimum 16)
    protocol: 'wunderground', //Protocol (wunderground or ecowitt)
    enabled: true,            //Custom Server Enabled
    path_ecowitt: '/weather',     //Server Path for Wunderground Protocol
    path_wunderground: '/weather' //Server Path for Ecowitt Protocol
})

static discover(timeout)    //Find GW1000, Timeout in milliseconds
```

### Example

``` js
const GW1000 = require('ecowitt-gw1000');
const gw = new GW1000('192.168.X.X', 45000); //port default is 45000 and is optional

gw.getLiveData()
   .then(data => {
      console.log(JSON.stringify(data));
   });
```

## Future Development

* Unit Conversions
* Get & Set more configuration settings
