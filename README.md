# Ecowitt GW1000

![GitHub last commit](https://img.shields.io/github/last-commit/bmdevx/ecowitt-gw1000?style=flat-square)  ![npm](https://img.shields.io/npm/dt/ecowitt-gw1000?style=flat-square) ![npm](https://img.shields.io/npm/v/ecowitt-gw1000?style=flat-square) ![GitHub](https://img.shields.io/github/license/bmdevx/ecowitt-gw1000?style=flat-square)

## Features

* Gets Live Data
* Gets Device Information
* Get/Set Custom Server Configuration

### Methods

``` js
getSensors({            //Optional filter can be by type and/or status. Accepts strings or arrays of strings for type and status.
    type: 'WH65',
    status: 'active'
})

getLiveData(filterActiveSensors = true) //Gets current Weather conditions.

getRainData()           //Gets Rain Data. (in development)

getSoilMoistureCalibration() //Gets Soil Moisture Calibration Data (including current analog and digital value for all connected sensors)

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

## Future Development

* Unit Conversions
* Get & Set more configuration settings
