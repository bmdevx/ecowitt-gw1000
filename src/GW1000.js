const dgram = require('dgram');
const net = require('net');
const GW1000Utils = require('./GW1000Utils');

const Commands = {
    CMD_WRITE_SSID: 0x11,       // send router SSID and Password to wifi module
    CMD_BROADCAST: 0x12,        //looking for device inside network. Returned data size is 2 Byte

    CMD_READ_ECOWITT: 0x1E,     // read setting for Ecowitt.net
    CMD_WRITE_ECOWITT: 0x1F,    // write back setting for Ecowitt.net
    CMD_READ_WUNDERGROUND: 0x20,// read back setting for Wunderground
    CMD_WRITE_WUNDERGROUND: 0x21,// write back setting for Wunderground
    CMD_READ_WOW: 0x22,         // read setting for WeatherObservationsWebsite
    CMD_WRITE_WOW: 0x23,        // write back setting for WeatherObservationsWebsite
    CMD_READ_WEATHERCLOUD: 0x24,// read setting for Weathercloud
    CMD_WRITE_WEATHERCLOUD: 0x25,// write back setting for Weathercloud
    CMD_READ_SATION_MAC: 0x26,  // read  module MAC
    CMD_GW1000_LIVEDATA: 0x27,  // read current，return size is 2 Byte (only valid for GW1000 and WH2650)
    CMD_GET_SOILHUMIAD: 0x28,   // read Soilmoisture Sensor calibration parameter
    CMD_SET_SOILHUMIAD: 0x29,   // write back Soilmoisture Sensor calibration parameter
    CMD_READ_CUSTOMIZED: 0x2A,  // read setting for Customized sever
    CMD_WRITE_CUSTOMIZED: 0x2B, // write back customized sever setting
    CMD_GET_MUlCH_OFFSET: 0x2C, // read multi channel sensor OFFSET value
    CMD_SET_MUlCH_OFFSET: 0x2D, // write back multi sensor OFFSET value
    CMD_GET_PM25_OFFSET: 0x2E,  // read PM2.5OFFSET value
    CMD_SET_PM25_OFFSET: 0x2F,  // write back PM2.5OFFSET value
    CMD_READ_SSSS: 0x30,        // read sensor setup (sensor frequency, wh24/wh65 sensor)
    CMD_WRITE_SSSS: 0x31,       // write back sensor setup

    CMD_READ_RAINDATA: 0x34,    // read rain data
    CMD_WRITE_RAINDATA: 0x35,   // write back rain data
    CMD_READ_GAIN: 0x36,        // read rain gain
    CMD_WRITE_GAIN: 0x37,       // write back rain gain
    CMD_READ_CALIBRATION: 0x38, //  read multiple parameter offset( refer to command description below in detail)
    CMD_WRITE_CALIBRATION: 0x39,//  write back multiple parameter offset
    CMD_READ_SENSOR_ID: 0x3A,   //  read Sensors ID
    CMD_WRITE_SENSOR_ID: 0x3B,  // write back Sensors ID
    CMD_WRITE_SENSOR_ID_NEW: 0x3C,// write back Sensors ID New

    CMD_WRITE_REBOOT: 0x40,     // system reset
    CMD_WRITE_RESET: 0x41,      // system default setting reset
    CMD_WRITE_UPDATE: 0x43,     // update firmware

    CMD_READ_FIRMWARE: 0x50,    // read back firmware version
    CMD_READ_USR_PATH: 0x51,    // read path for custom Server
    CMD_WRITE_USR_PATH: 0x52,   // write path for custom Server

    CMD_GET_CO2_OFFSET: 0x53,
    CMD_SET_CO2_OFFSET: 0x54,

    CMD_READ_RSTRAIN_TIME: 0x55, // read rain reset time
    CMD_WRITE_RSTRAIN_TIME: 0x56,// write rain reset time
    CMD_READ_RAIN: 0x57,
    CMD_WRITE_RAIN: 0x58
}

const CommandRespSize =
{
    CMD_WRITE_SSID: 1,
    CMD_BROADCAST: 2,
    CMD_READ_ECOWITT: 1,
    CMD_WRITE_ECOWITT: 1,
    CMD_READ_WUNDERGROUND: 1,
    CMD_WRITE_WUNDERGROUND: 1,
    CMD_READ_WOW: 1,
    CMD_WRITE_WOW: 1,
    CMD_READ_WEATHERCLOUD: 1,
    CMD_WRITE_WEATHERCLOUD: 1,
    CMD_READ_SATION_MAC: 1,
    CMD_READ_CUSTOMIZED: 1,
    CMD_WRITE_CUSTOMIZED: 1,
    CMD_WRITE_UPDATE: 1,
    CMD_READ_FIRMWARE_VERSION: 1,
    CMD_GW1000_LIVEDATA: 2, // the following command is only valid for GW1000 and WH2650
    CMD_GET_SOILHUMIAD: 1,
    CMD_SET_SOILHUMIAD: 1,
    CMD_GET_MulCH_OFFSET: 1,
    CMD_SET_MulCH_OFFSET: 1,
    CMD_GET_PM25_OFFSET: 1,
    CMD_SET_PM25_OFFSET: 1,
    CMD_READ_SSSS: 1,
    CMD_WRITE_SSSS: 1,
    CMD_READ_RAINDATA: 1,
    CMD_WRITE_RAINDATA: 1,
    CMD_READ_GAIN: 1,
    CMD_WRITE_GAIN: 1,
    CMD_READ_CALIBRATION: 1,
    CMD_WRITE_CALIBRATION: 1,
    CMD_READ_SENSOR_ID: 1,
    CMD_WRITE_SENSOR_ID: 1,
    CMD_WRITE_REBOOT: 1,
    CMD_WRITE_RESET: 1,

    CMD_GET_CO2_OFFSET: 0x53,
    CMD_SET_CO2_OFFSET: 0x54,

    CMD_READ_RSTRAIN_TIME: 0x55,
    CMD_WRITE_RSTRAIN_TIME: 0x56,
    CMD_READ_RAIN: 0x57,
    CMD_WRITE_RAIN: 0x58
}

const SensorIDs =
    [
        'WH65', //0 AKA 24
        'WH68', //AKA 69
        'WH80',
        'WH40',
        'WH25',
        'WH26',
        'WH31_CH1',
        'WH31_CH2',
        'WH31_CH3',
        'WH31_CH4',
        'WH31_CH5', //10
        'WH31_CH6',
        'WH31_CH7',
        'WH31_CH8',
        'WH51_CH1',
        'WH51_CH2',
        'WH51_CH3',
        'WH51_CH4',
        'WH51_CH5',
        'WH51_CH6',
        'WH51_CH7', //20
        'WH51_CH8',
        'WH41_CH1',
        'WH41_CH2',
        'WH41_CH3',
        'WH41_CH4',
        'WH57',
        'WH55_CH1',
        'WH55_CH2',
        'WH55_CH3',
        'WH55_CH4', //30
        'WH34_CH1',
        'WH34_CH2',
        'WH34_CH3',
        'WH34_CH4',
        'WH34_CH5',
        'WH34_CH6',
        'WH34_CH7',
        'WH34_CH8',
        'WH45',
        'WH35_CH1', //40
        'WH35_CH2',
        'WH35_CH3',
        'WH35_CH4',
        'WH35_CH5',
        'WH35_CH6',
        'WH35_CH7',
        'WH35_CH8',
        'WH90',

    ];

class GW1000 {
    constructor(ipAddr) {

        this.ipAddr = ipAddr;
        this.utils = new GW1000Utils();

        const buildPacket = (command, data) => {
            var size = (data !== null ? data.length : 0) + 3;
            var body = [command, size].concat(data !== null ? data : []);
            return new Uint8Array([255, 255].concat(body, [GW1000Utils.calcChecksum(body)]));
        };

        const checkResponse = (resp, cmd, callback) => {
            if (resp == null) {
                callback(resp, 'No Response');
            } else if (resp.length < 3) {
                callback(resp, 'Invalid Response');
            } else if (resp[2] != cmd) {
                callback(resp, 'Invalid Command Code Response');
            } else if (resp[resp.length - 1] != GW1000Utils.calcChecksum(resp.slice(2, resp.length - 1))) {
                callback(resp, 'Invalid Checksum');
            } else {
                callback(resp, null);
            }
        };

        this.runCommand = (command, data = null) => {
            return new Promise((res, rej) => {
                const client = new net.Socket();

                client.connect(45000, ipAddr, function () {
                    console.debug('Connected');

                    client.write(buildPacket(command, data));
                });

                client.on('data', function (buffer) {
                    console.debug(`Received Data: ${buffer != null ? buffer.length : 0} bytes`);
                    client.destroy(); // kill client after server's response as to not mix up commands

                    checkResponse(buffer, command, (data, err) => {
                        err ? rej(err) : res(data);
                    });
                });

                client.on('close', function () {
                    console.debug('Connection closed');
                });
            });
        };
    }


    getSensors(filter = null) {
        const statusFilter = (filter && filter.status) ?
            (typeof filter.status === 'string') ?
                (status) => status.includes(filter.status.toLowerCase()) :
                Array.isArray(filter.status) ?
                    (status) => filter.status.includes(status.toLowerCase()) :
                    (x) => true
            : (x) => true;

        const typeFilter = (filter && filter.type) ?
            (typeof filter.type === 'string') ?
                (type) => type.includes(filter.type.toUpperCase()) :
                Array.isArray(filter.type) ?
                    (type) => filter.type.includes(type.toUpperCase()) :
                    (x) => true
            : (x) => true;

        return new Promise((res, rej) => {
            this.runCommand(Commands.CMD_READ_SENSOR_ID)
                .then(buffer => {
                    if (buffer.length > 200) {
                        var sensors = [];

                        for (var i = 4; i < buffer[3]; i += 7) {
                            var id = buffer.toString('hex', i + 1, i + 5).toUpperCase();
                            var typeID = buffer[i];
                            var type = typeID < SensorIDs.length && typeID >= 0 ? SensorIDs[typeID] : `Unknown Type (${id})`;

                            var status =
                                id == 'FFFFFFFE' ? 'disabled' :
                                    id == 'FFFFFFFF' ? 'registering' :
                                        'active';

                            if (statusFilter(status) && typeFilter(type)) {
                                sensors.push({
                                    type: type,
                                    status: status,
                                    id: status == 'active' ? parseInt(id, 16).toString(16).toUpperCase() : null, //remove leading 0's
                                    signal: status == 'active' ? buffer[i + 5] : null,
                                    battery: status == 'active' ? buffer[i + 6] : null
                                });
                            }
                        }

                        if (filter === null) {
                            this.sensors = sensors;
                        }

                        res(sensors);
                    } else {
                        rej('Invalid Data Length');
                    }
                });
        });
    }


    getLiveData(filterActiveSensors = true) {
        return new Promise((res, rej) => {
            this.runCommand(Commands.CMD_GW1000_LIVEDATA)
                .then(buffer => {
                    var data = this.utils.parseLiveData(buffer);

                    if (filterActiveSensors) {
                        const filterSensors = (data, sensors) => {
                            if (data.lowbatt) {
                                Object.keys(data.lowbatt).forEach(key => {
                                    var ukey = key.toUpperCase();

                                    if (typeof data.lowbatt[key] === 'object') {

                                        Object.keys(data.lowbatt[key]).forEach(chn => {
                                            const uchn = chn.toUpperCase();
                                            const usen = key.toUpperCase();

                                            if (sensors.filter(s => s.type === `${usen}_${uchn}` && s.status === 'active').length < 1) {
                                                delete data.lowbatt[key][chn];
                                            }
                                        });

                                        if (Object.keys(data.lowbatt[key]).length < 1) {
                                            delete data.lowbatt[key];
                                        }
                                    } else {
                                        if (sensors.filter(s => s.type === ukey && s.status === 'active').length < 1) {
                                            delete data.lowbatt[key];
                                        }
                                    }
                                });
                            }

                            res(data);
                        };

                        if (this.sensors === undefined) {
                            this.getSensors()
                                .then(sensors => {
                                    filterSensors(data, sensors);
                                });
                        } else {
                            filterSensors(data, this.sensors);
                        }
                    } else {
                        res(data);
                    }
                });
        });
    }


    getRainData() {
        return new Promise((res, rej) => {
            this.runCommand(Commands.CMD_READ_RAINDATA)
                .then(buffer => {
                    res(this.utils.parseRainData(buffer));
                });
        });
    }

    setRainData(data) {
        return new Promise((res, rej) => {
            this.getRainData()
                .then(rd => {
                    Object.assign(rd, data);

                    if (typeof rd.rain_rate !== 'number' || rd.rain_rate < 0) {
                        rej('Rain Rate must be a number >= 0.');
                        return;
                    }

                    if (typeof rd.rain_day !== 'number' || rd.rain_day < 0) {
                        rej('Rain Day must be a number >= 0.');
                        return;
                    }

                    if (typeof rd.rain_week !== 'number' || rd.rain_week < 0) {
                        rej('Rain Week must be a number >= 0.');
                        return;
                    }

                    if (typeof rd.rain_month !== 'number' || rd.rain_month < 0) {
                        rej('Rain Month must be a number >= 0.');
                        return;
                    }

                    if (typeof rd.rain_year !== 'number' || rd.rain_year < 0) {
                        rej('Rain Year must be a number >= 0.');
                        return;
                    }

                    const packetRain = this.utils.packRainData(rd);

                    this.runCommand(Commands.CMD_WRITE_RAINDATA, packetRain)
                        .then(cr => {
                            res({
                                status: 'Rain Updated',
                                data: rd
                            });
                        });
                });
        });
    }

    //New Implementation with Event and Piezo data
    getRain() {
        return new Promise((res, rej) => {
            this.runCommand(Commands.CMD_READ_RAIN)
                .then(buffer => {
                    res(this.utils.parseRain(buffer));
                });
        });
    }


    getSoilMoistureCalibration() {
        return new Promise((res, rej) => {
            this.runCommand(Commands.CMD_GET_SOILHUMIAD)
                .then(buffer => {
                    res(this.utils.parseSoilData(buffer));
                });
        });
    }

    setSoilMoistureCalibration(data) {
        return new Promise((res, rej) => {
            this.getSoilMoistureCalibration()
                .then(sd => {
                    Object.assign(sd, data);

                    if (typeof sd.channel !== 'number' || sd.channel < 1 || sd.channel > 8) {
                        rej('Channel must be a number from 1 to 8.');
                        return;
                    }

                    if (typeof sd.current_humidity !== 'number' || sd.current_humidity < 0) {
                        rej('Current Humidity must be a number >= 0.');
                        return;
                    }

                    if (typeof sd.current_ad !== 'number' || sd.current_ad < 0) {
                        rej('Current AD must be a number >= 0.');
                        return;
                    }

                    if (typeof sd.calibration_enabled !== 'number' || sd.calibration_enabled < 0 || sd.calibration_enabled > 1) {
                        rej('Customize Calibration Option must be either 1 or enabled or 0 for disabled.');
                        return;
                    }

                    if (typeof sd.min_ad !== 'number' || sd.min_ad < 0) {
                        rej('min AD must be a number >= 0.');
                        return;
                    }

                    if (typeof sd.max_ad !== 'number' || sd.max_ad < 0) {
                        rej('min AD must be a number >= 0.');
                        return;
                    }

                    const packetSoil = this.utils.packSoilData(sd);

                    this.runCommand(Commands.CMD_SET_SOILHUMIAD, packetSoil)
                        .then(cr => {
                            res({
                                status: 'Soil Updated',
                                data: sd
                            });
                        });
                });
        });
    }


    getFirmwareVersion() {
        return new Promise((res, rej) => {
            this.runCommand(Commands.CMD_READ_FIRMWARE)
                .then(buffer => {
                    res(buffer.slice(5, buffer.length - 1).toString('ascii'));
                });
        });
    }


    getSystemParams() {
        return new Promise((res, rej) => {
            this.runCommand(Commands.CMD_READ_SSSS)
                .then(buffer => {
                    //todo parse
                    res(buffer.toString('hex'));
                });
        });
    }


    getMacAddr() {
        return new Promise((res, rej) => {
            this.runCommand(Commands.CMD_READ_SATION_MAC)
                .then(buffer => {
                    res(buffer.toString('hex', 4, buffer.length - 1).toUpperCase());
                });
        });
    }


    getCustomServerInfo() {
        return new Promise((res, rej) => {
            this.runCommand(Commands.CMD_READ_CUSTOMIZED)
                .then(buffer => {
                    var info = this.utils.parseCustomServerInfo(buffer);

                    this.runCommand(Commands.CMD_READ_USR_PATH)
                        .then(buffer => {
                            Object.assign(info, this.utils.parseUserPathInfo(buffer));
                            res(info);
                        });
                });
        });
    }

    setCustomServerInfo(data) {
        return new Promise((res, rej) => {
            this.getCustomServerInfo()
                .then(csi => {
                    Object.assign(csi, data);

                    if (csi.interval < 16) {
                        rej('Upload Interval must be >= 16 and < 3600 seconds.');
                        return;
                    }

                    if (csi.protocol !== 'wunderground' && csi.protocol !== 'ecowitt') {
                        rej('Protocol must be \'wunderground\' or \'ecowitt\'.');
                        return;
                    }

                    const packetCI = this.utils.packCustomServerInfo(csi);
                    const packetUP = this.utils.packUserPathInfo(csi);

                    this.runCommand(Commands.CMD_WRITE_CUSTOMIZED, packetCI)
                        .then(cr => {
                            this.runCommand(Commands.CMD_WRITE_USR_PATH, packetUP)
                                .then(cr2 => {
                                    res({
                                        status: 'Server Updated',
                                        data: csi
                                    });
                                });
                        });

                    // console.debug(packetCI.toString('hex'));
                    // console.debug(JSON.stringify(this.utils.parseCustomServerInfo(Buffer.from([0, 0, 0, 0].concat(Array.from(packetCI)))), null, 1));

                    // console.debug(packetUP.toString('hex'));
                    // console.debug(JSON.stringify(this.utils.parseUserPathInfo(Buffer.from([0, 0, 0, 0].concat(Array.from(packetUP)))), null, 1));
                });
        });
    }



    static discover(timeout = 5000) {
        return new Promise((res, rej) => {
            const server = dgram.createSocket('udp4');
            var ips = [];

            server.on('message', (msg, rinfo) => {
                if (!ips.includes(rinfo.address)) {
                    ips.push(rinfo.address);
                }
            });

            server.bind(59387);

            setTimeout(() => {
                server.close(() => {
                    res(ips);
                });
            }, timeout);
        });
    }
}

module.exports = GW1000;