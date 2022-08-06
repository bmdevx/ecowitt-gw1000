const dgram = require('dgram');
const net = require('net');
const GW1000Utils = require('./GW1000Utils');

const { COMMANDS } = require('./Commands');
const { SENSOR_IDS } = require('./Sensors');


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
            this.runCommand(COMMANDS.CMD_READ_SENSOR_ID)
                .then(buffer => {
                    if (buffer.length > 200) {
                        var sensors = [];

                        for (var i = 4; i < buffer[3]; i += 7) {
                            var id = buffer.toString('hex', i + 1, i + 5).toUpperCase();
                            var typeID = buffer[i];
                            var type = typeID < SENSOR_IDS.length && typeID >= 0 ? SENSOR_IDS[typeID] : `Unknown Type (${id})`;

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
            this.runCommand(COMMANDS.CMD_GW1000_LIVEDATA)
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
            this.runCommand(COMMANDS.CMD_READ_RAINDATA)
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

                    this.runCommand(COMMANDS.CMD_WRITE_RAINDATA, packetRain)
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
            this.runCommand(COMMANDS.CMD_READ_RAIN)
                .then(buffer => {
                    res(this.utils.parseRain(buffer));
                });
        });
    }


    getSoilMoistureCalibration() {
        return new Promise((res, rej) => {
            this.runCommand(COMMANDS.CMD_GET_SOILHUMIAD)
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

                    this.runCommand(COMMANDS.CMD_SET_SOILHUMIAD, packetSoil)
                        .then(ss => {
                            const ssResult = this.utils.parseResult(ss);

                            if (ssResult.result) {
                                res({
                                    status: 'Soil Updated',
                                    data: sd
                                });
                            } else {
                                rej({
                                    status: 'Soil Calibration Not Updated',
                                    data: sd
                                });
                            }
                        });
                });
        });
    }


    getPM25Offset() {
        return new Promise((res, rej) => {
            this.runCommand(COMMANDS.CMD_GET_PM25_OFFSET)
                .then(buffer => {
                    res(this.utils.parsePM25Data(buffer));
                });
        });
    }

    getCO2Offset() {
        return new Promise((res, rej) => {
            this.runCommand(COMMANDS.CMD_GET_CO2_OFFSET)
                .then(buffer => {
                    res(this.utils.parseCO2OffsetData(buffer));
                });
        });
    }


    getFirmwareVersion() {
        return new Promise((res, rej) => {
            this.runCommand(COMMANDS.CMD_READ_FIRMWARE)
                .then(buffer => {
                    res(buffer.slice(5, buffer.length - 1).toString('ascii'));
                });
        });
    }


    getSystemParams() {
        return new Promise((res, rej) => {
            this.runCommand(COMMANDS.CMD_READ_SSSS)
                .then(buffer => {
                    //todo parse
                    res(buffer.toString('hex'));
                });
        });
    }


    getMacAddr() {
        return new Promise((res, rej) => {
            this.runCommand(COMMANDS.CMD_READ_SATION_MAC)
                .then(buffer => {
                    res(buffer.toString('hex', 4, buffer.length - 1).toUpperCase());
                });
        });
    }


    getCustomServerInfo() {
        return new Promise((res, rej) => {
            this.runCommand(COMMANDS.CMD_READ_CUSTOMIZED)
                .then(buffer => {
                    var info = this.utils.parseCustomServerInfo(buffer);

                    this.runCommand(COMMANDS.CMD_READ_USR_PATH)
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

                    this.runCommand(COMMANDS.CMD_WRITE_CUSTOMIZED, packetCI)
                        .then(cr => {
                            const crResult = this.utils.parseResult(cr);

                            if (crResult.result) {
                                this.runCommand(COMMANDS.CMD_WRITE_USR_PATH, packetUP)
                                    .then(wspRes => {
                                        const wspResult = this.utils.parseResult(wspRes);

                                        if (wspResult.result) {
                                            res({
                                                status: 'Server Updated',
                                                data: csi
                                            });
                                        } else {
                                            rej({
                                                status: 'Server Not Updated',
                                                data: csi
                                            })
                                        }
                                    });
                            } else {
                                rej({
                                    status: 'Server Not Updated',
                                    data: csi
                                })
                            }
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