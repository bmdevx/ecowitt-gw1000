const LIVE_DATA_STRUCT = {
/*x01*/ 1: [decodeTemp, 2, 'intemp'],
/*x02*/ 2: [decodeTemp, 2, 'outtemp'],
/*x03*/ 3: [decodeTemp, 2, 'dewpoint'],
/*x04*/ 4: [decodeTemp, 2, 'windchill'],
/*x05*/ 5: [decodeTemp, 2, 'heatindex'],
/*x06*/ 6: [decodeHumid, 1, 'inhumid'],
/*x07*/ 7: [decodeHumid, 1, 'outhumid'],
/*x08*/ 8: [decodePress, 2, 'absbarometer'],
/*x09*/ 9: [decodePress, 2, 'relbarometer'],
/*x0A*/ 10: [decodeDir, 2, 'winddir'],
/*x0B*/ 11: [decodeSpeed, 2, 'windspeed'],
/*x0C*/ 12: [decodeSpeed, 2, 'gustspeed'],
/*x0D*/ 13: [decodeRain, 2, 'rainevent'],
/*x0E*/ 14: [decodeRainRate, 2, 'rainrate'],
/*x0F*/ 15: [decodeRain, 2, 'rainhour'],
/*x10*/ 16: [decodeRain, 2, 'rainday'],
/*x11*/ 17: [decodeRain, 2, 'rainweek'],
/*x12*/ 18: [decodeBigRain, 4, 'rainmonth'],
/*x13*/ 19: [decodeBigRain, 4, 'rainyear'],
/*x14*/ 20: [decodeBigRain, 4, 'raintotals'],
/*x15*/ 21: [decodeLight, 4, 'light'],
/*x16*/ 22: [decodeUV, 2, 'uv'],
/*x17*/ 23: [decodeUVI, 1, 'uvi'],
/*x18*/ 24: [decodeDatetime, 6, 'datetime'],
/*x19*/ 25: [decodeSpeed, 2, 'daymaxwind'],
/*x1A*/ 26: [decodeTemp, 2, 'temp1'],
/*x1B*/ 27: [decodeTemp, 2, 'temp2'],
/*x1C*/ 28: [decodeTemp, 2, 'temp3'],
/*x1D*/ 29: [decodeTemp, 2, 'temp4'],
/*x1E*/ 30: [decodeTemp, 2, 'temp5'],
/*x1F*/ 31: [decodeTemp, 2, 'temp6'],
/*x20*/ 32: [decodeTemp, 2, 'temp7'],
/*x21*/ 33: [decodeTemp, 2, 'temp8'],
/*x22*/ 34: [decodeHumid, 1, 'humid1'],
/*x23*/ 35: [decodeHumid, 1, 'humid2'],
/*x24*/ 36: [decodeHumid, 1, 'humid3'],
/*x25*/ 37: [decodeHumid, 1, 'humid4'],
/*x26*/ 38: [decodeHumid, 1, 'humid5'],
/*x27*/ 39: [decodeHumid, 1, 'humid6'],
/*x28*/ 40: [decodeHumid, 1, 'humid7'],
/*x29*/ 41: [decodeHumid, 1, 'humid8'],
/*x2A*/ 42: [decodeAq, 2, 'pm251'],
/*x2B*/ 43: [decodeTemp, 2, 'soiltemp1'],
/*x2C*/ 44: [decodeMoist, 1, 'soilmoist1'],
/*x2D*/ 45: [decodeTemp, 2, 'soiltemp2'],
/*x2E*/ 46: [decodeMoist, 1, 'soilmoist2'],
/*x2F*/ 47: [decodeTemp, 2, 'soiltemp3'],
/*x30*/ 48: [decodeMoist, 1, 'soilmoist3'],
/*x31*/ 49: [decodeTemp, 2, 'soiltemp4'],
/*x32*/ 50: [decodeMoist, 1, 'soilmoist4'],
/*x33*/ 51: [decodeTemp, 2, 'soiltemp5'],
/*x34*/ 52: [decodeMoist, 1, 'soilmoist5'],
/*x35*/ 53: [decodeTemp, 2, 'soiltemp6'],
/*x36*/ 54: [decodeMoist, 1, 'soilmoist6'],
/*x37*/ 55: [decodeTemp, 2, 'soiltemp7'],
/*x38*/ 56: [decodeMoist, 1, 'soilmoist7'],
/*x39*/ 57: [decodeTemp, 2, 'soiltemp8'],
/*x3A*/ 58: [decodeMoist, 1, 'soilmoist8'],
/*x3B*/ 59: [decodeTemp, 2, 'soiltemp9'],
/*x3C*/ 60: [decodeMoist, 1, 'soilmoist9'],
/*x3D*/ 61: [decodeTemp, 2, 'soiltemp10'],
/*x3E*/ 62: [decodeMoist, 1, 'soilmoist10'],
/*x3F*/ 63: [decodeTemp, 2, 'soiltemp11'],
/*x40*/ 64: [decodeMoist, 1, 'soilmoist11'],
/*x41*/ 65: [decodeTemp, 2, 'soiltemp12'],
/*x42*/ 66: [decodeMoist, 1, 'soilmoist12'],
/*x43*/ 67: [decodeTemp, 2, 'soiltemp13'],
/*x44*/ 68: [decodeMoist, 1, 'soilmoist13'],
/*x45*/ 69: [decodeTemp, 2, 'soiltemp14'],
/*x46*/ 70: [decodeMoist, 1, 'soilmoist14'],
/*x47*/ 71: [decodeTemp, 2, 'soiltemp15'],
/*x48*/ 72: [decodeMoist, 1, 'soilmoist15'],
/*x49*/ 73: [decodeTemp, 2, 'soiltemp16'],
/*x4A*/ 74: [decodeMoist, 1, 'soilmoist16'],

/*x4C*/ 76: [decodeBatt, 16, 'lowbatt'],
/*x4D*/ 77: [decodeAq, 2, 'pm251_24hav'],
/*x4E*/ 78: [decodeAq, 2, 'pm252_24hav'],
/*x4F*/ 79: [decodeAq, 2, 'pm253_24hav'],
/*x50*/ 80: [decodeAq, 2, 'pm254_24hav'],
/*x51*/ 81: [decodeAq, 2, 'pm252'],
/*x52*/ 82: [decodeAq, 2, 'pm253'],
/*x53*/ 83: [decodeAq, 2, 'pm254'],

/*x58*/ 88: [decodeLeak, 1, 'leak1'],
/*x59*/ 89: [decodeLeak, 1, 'leak2'],
/*x5A*/ 90: [decodeLeak, 1, 'leak3'],
/*x5B*/ 91: [decodeLeak, 1, 'leak4'],

/*x60*/ 96: [decodeDistance, 1, 'lightningdist'],
/*x61*/ 97: [decodeUTC, 4, 'lightningdettime'],
/*x62*/ 98: [decodeCount, 4, 'lightningcount'],
/*x63*/ 99: [decodeTempBatt, 3, 'usertemp1'],
/*x64*/ 100: [decodeTempBatt, 3, 'usertemp2'],
/*x65*/ 101: [decodeTempBatt, 3, 'usertemp3'],
/*x66*/ 102: [decodeTempBatt, 3, 'usertemp4'],
/*x67*/ 103: [decodeTempBatt, 3, 'usertemp5'],
/*x68*/ 104: [decodeTempBatt, 3, 'usertemp6'],
/*x69*/ 105: [decodeTempBatt, 3, 'usertemp7'],
/*x6A*/ 106: [decodeTempBatt, 3, 'usertemp8'],
}

const CUSTOMIZED_SERVER_STRUCT = [
    ['station', 'string', null],
    ['key', 'string', null],
    ['server', 'string', null],
    ['port', 'uint16', 2],
    ['interval', 'uint16', 2],
    ['protocol', 'protocol', 1],
    ['enabled', 'bool', 1]
]

const USER_PATH_STRUCT = [
    ['path_ecowitt', 'string', null],
    ['path_wunderground', 'string', null]
]

const RAIN_DATA_STRUCT = [
    ['rain_event', 'rain', 2], // confirm (may not exist)
    ['rain_rate', 'rain', 2], // confirm (may be 4)
    ['rain_hour', 'rain', 2], // confirm (may not exist)
    ['rain_day', 'rain', 2], // confirm (may be 4)
    ['rain_week', 'bigRain', 4], // confirm (may be 2)
    ['rain_month', 'bigRain', 4],
    ['rain_year', 'bigRain', 4]
]

var MULTI_BATT = {
    'wh40': 4,
    'wh26': 5,
    'wh25': 6,
    'wh65': 7  //aka wh24
}


class GW1000Utils {
    constructor(isWH24 = false) {
        if (isWH24) {
            if (MULTI_BATT.wh24 == undefined) {
                MULTI_BATT.wh24 = MULTI_BATT.wh65;
                delete MULTI_BATT.wh65;
            }
        } else {
            if (MULTI_BATT.wh65 == undefined) {
                MULTI_BATT.wh65 = MULTI_BATT.wh24;
                delete MULTI_BATT.wh24;
            }
        }

        this.parseStructStrict = (buffer, struct) => {
            var data = {}, idx = 4;

            struct.forEach(([field, func, fieldSize]) => {
                if (fieldSize == null) {
                    fieldSize = buffer.readInt8(idx);

                    var rfunc = PARSE[func];
                    if (rfunc === undefined) {
                        console.log(func);
                    }

                    data[field] = rfunc(idx + 1, buffer, fieldSize);
                    idx += fieldSize + 1;
                } else {
                    data[field] = PARSE[func](idx, buffer, fieldSize);
                    idx += fieldSize;
                }
            });

            return data;
        }

        this.packStructStrict = (data, struct) => {
            var buffer = new Buffer.alloc(256);
            var idx = 0;

            struct.forEach(([field, func, fieldSize]) => {
                const [nidx, nbuffer] = PACK[func](idx, buffer, data[field]);
                idx = nidx;
                buffer = nbuffer;
            });

            return Uint8Array.from(buffer.slice(0, idx));
        }
    }

    parseLiveData(buffer, timestamp = null) {
        var data = {}, idx = 5;

        while (idx < buffer.length - 1) {
            var [func, fieldSize, field] = LIVE_DATA_STRUCT[buffer.readInt8(idx++)];

            data[field] = func(idx, buffer);

            idx += fieldSize;
        }

        if ('datetime' in data === false) {
            data['datetime'] = timestamp != null ? timestamp : Date.now();
        }

        return data;
    }

    parseCustomServerInfo(buffer) {
        return this.parseStructStrict(buffer, CUSTOMIZED_SERVER_STRUCT);
    }

    parseUserPathInfo(buffer) {
        return this.parseStructStrict(buffer, USER_PATH_STRUCT);
    }

    parseRainData(buffer) {
        return this.parseStructStrict(buffer, RAIN_DATA_STRUCT);
    }


    packCustomServerInfo(data) {
        return this.packStructStrict(data, CUSTOMIZED_SERVER_STRUCT);
    }

    packUserPathInfo(data) {
        return this.packStructStrict(data, USER_PATH_STRUCT);
    }

    packRainData(data) {
        return this.packStructStrict(data, RAIN_DATA_STRUCT);
    }


    static calcChecksum(body) {
        return calcChecksum(body);
    }
}

const PARSE = {
    'string': parseString,
    'int8': parseInt8,
    'uint16': parseUInt16,
    'uint32': parseUInt32,
    'bool': parseBool,
    'protocol': parseProtocol,
    'rain': decodeRain,
    'bigRain': decodeBigRain
}

const PACK = {
    'string': packString,
    'int8': packInt8,
    'uint16': packUInt16,
    'uint32': packUInt32,
    'bool': packBool,
    'protocol': packProtocol,
    'rain': packRain,
    'bigRain': packBigRain
}



function parseString(idx, buffer, length) {
    return buffer.toString('utf8', idx, idx + length);
}

function parseBool(idx, buffer) {
    return buffer.readInt8(idx) == 1;
}

function parseInt8(idx, buffer) {
    return buffer.readInt8(idx);
}

function parseUInt16(idx, buffer) {
    return buffer.readInt16BE(idx);
}

function parseUInt32(idx, buffer) {
    return buffer.readInt32BE(idx);
}

function parseProtocol(idx, buffer) {
    return (buffer.readInt8(idx) == 0) ? 'ecowitt' : 'wunderground';
}


function packString(idx, buffer, str) {
    buffer.writeInt8(str.length, idx);
    idx++;
    buffer.write(str, idx, str.length, 'utf8');
    idx += str.length;

    return [idx, buffer];
}

function packBool(idx, buffer, data) {
    return packInt8(idx, buffer, data ? 1 : 0);
}

function packInt8(idx, buffer, data) {
    buffer.writeInt8(data, idx);
    return [idx + 1, buffer];
}

function packUInt16(idx, buffer, data) {
    buffer.writeUInt16BE(data, idx);
    return [idx + 2, buffer];
}

function packUInt32(idx, buffer, data) {
    buffer.writeUInt32BE(data, idx);
    return [idx + 4, buffer];
}

function packProtocol(idx, buffer, data) {
    return packInt8(idx, buffer, ('ecowitt' == data ? 0 : 1));
}

function packRain(idx, buffer, value) {
    return packUInt16(idx, buffer, value * 10);
}

function packBigRain(idx, buffer, value) {
    return packUInt32(idx, buffer, value * 10);
}



/* Decode temperature data.
Data is contained in a two byte big endian signed integer and represents tenths of a degree celcius.
*/
function decodeTemp(idx, buffer) {
    return buffer.readInt16BE(idx) / 10;
}

/* Decode humidity data.
Data is contained in a single unsigned byte and represents whole units (%).
*/
function decodeHumid(idx, buffer) {
    return buffer.readInt8(idx);
}

/* Decode pressure data.
Data is contained in a two byte big endian integer and represents tenths of a unit (hpa).
*/
function decodePress(idx, buffer) {
    return buffer.readUInt16BE(idx) / 10.0;
}

/* Decode direction data.
Data is contained in a two byte big endian integer and represents whole degrees.
*/
function decodeDir(idx, buffer) {
    return buffer.readUInt16BE(idx);
}

/* Decode speed data.
Data is contained in a two byte big endian integer and represents tenths of m/s.
*/
function decodeSpeed(idx, buffer) {
    return buffer.readUInt16BE(idx) / 10.0;
}

/* Decode rain data.
Data is contained in a two byte big endian integer and represents tenths of mm.
*/
function decodeRain(idx, buffer) {
    return buffer.readUInt16BE(idx) / 10.0;
}

/* Decode rain rate data.
Data is contained in a two byte big endian integer and represents tenths of mm/hr.
*/
function decodeRainRate(idx, buffer) {
    return buffer.readUInt16BE(idx) / 10.0;
}

/* Decode 4 byte rain data.
Data is contained in a four byte big endian integer and represents tenths of a unit mm.
*/
function decodeBigRain(idx, buffer) {
    return buffer.readUInt32BE(idx) / 10.0;
}

/* Decode 4 byte light data.
Data is contained in a four byte big endian integer and represents tenths of a unit (lux).
*/
function decodeLight(idx, buffer) {
    return buffer.readUInt32BE(idx) / 10.0;
}

/* Decode 2 byte UV data.
Data is contained in a two byte big endian integer and represents tenths of a unit (µW/cm²).
*/
function decodeUV(idx, buffer) {
    return buffer.readUInt16BE(idx) / 10.0;
}

/* Decode UV Index.
Data is contained in a single unsigned byte and represents whole units (0-15).
*/
function decodeUVI(idx, buffer) {
    return buffer.readInt8(idx);
}

/* Decode date-time data.
Unknown format but length is six bytes.
*/
function decodeDatetime(idx, buffer) {
    return buffer.slice(idx, idx + 6);
}

/* Decode UTC time.

The GW1000 API claims to provide 'UTC time' as a 4 byte big endian
integer. The 4 byte integer is a unix epoch timestamp; however,
the timestamp is offset by the stations timezone. So for a station
in the +10 hour timezone, the timestamp returned is the present
epoch timestamp plus 10 * 3600 seconds.

When decoded in localtime the decoded date-time is off by the
station time zone, when decoded as GMT the date and time figures
are correct but the timezone is incorrect.

In any case decode the 4 byte big endian integer as is and any
further use of this timestamp needs to take the above time zone
offset into account when using the timestamp.
*/
function decodeUTC(idx, buffer) {
    var val = buffer.readUInt32BE(idx);
    return (val === 0xFFFFFFFF) ? null : val;
}

/* Decode combined temperature and battery status data.
Data consists of three bytes; bytes 0 and 1 are normal temperature data
and byte 3 is battery status data.
*/
function decodeTempBatt(idx, buffer) {
    return {
        temp: buffer.readInt16BE(idx),
        batt: buffer.readInt8(idx + 2)
    }
}

/* Decode lightning distance.
Data is contained in a single byte integer and represents a value from 0 to 40km.
*/
function decodeDistance(idx, buffer) {
    var val = buffer.readInt8(idx);
    return val <= 40 ? val : null;
}

/* Decode lightning count.
Count is an integer stored in a 4 byte big endian integer.
*/
function decodeCount(idx, buffer) {
    return buffer.readUInt32BE(idx);
}

/* Decode moist data.
Data is contained in a single unsigned byte and represents whole units.
*/
function decodeMoist(idx, buffer) {
    return buffer.readInt8(idx);
}

/* Decode aq data.
Data is contained in a two byte big endian integer and represents tenths of a unit.
*/
function decodeAq(idx, buffer) {
    return buffer.readUInt16BE(idx) / 10.0;
}

/* Decode leak data.
Data is contained in a single unsigned byte and represents whole units.
*/
function decodeLeak(idx, buffer) {
    return buffer.readInt8(idx);
}

/* Decode battery status data.
Battery status data is provided in 16 bytes using a variety of
representations. Different representations include:
-   use of a single bit to indicate low/OK
-   use of a nibble to indicate battery level
-   use of a byte to indicate battery voltage

WH24, WH25, WH26(WH32), WH31, WH40, WH41 and WH51
stations/sensors use a single bit per station/sensor to indicate OK or
low battery. WH55 and WH57 sensors use a single byte per sensor to
indicate OK or low battery. WH68 and WS80 sensors use a single byte to
store battery voltage.

The battery status data is allocated as follows
Byte #  Sensor          Value               Comments
byte 1  WH40(b4)        0/1                 1=low, 0=normal
        WH26(WH32?)(b5) 0/1                 1=low, 0=normal
        WH25(b6)        0/1                 1=low, 0=normal
        WH24(b7)        0/1                 may be WH65, 1=low, 0=normal
        2  WH31 ch1(b0)    0/1                 1=low, 0=normal, 8 channels b0..b7
                ...
                ch8(b7)    0/1                 1=low, 0=normal
        3  WH51 ch1(b0)    0/1                 1=low, 0=normal, 16 channels b0..b7 over 2 bytes
                ...
                ch8(b7)    0/1                 1=low, 0=normal
        4       ch9(b0)    0/1                 1=low, 0=normal
                ...
                ch16(b7)   0/1                 1=low, 0=normal
        5  WH57            0-5                 <=1 is low
        6  WH68            0.02*value Volts
        7  WS80            0.02*value Volts
        8  Unused
        9  WH41 ch1(b0-b3) 0-5                 <=1 is low
                ch2(b4-b7) 0-5                 <=1 is low
        10      ch3(b0-b3) 0-5                 <=1 is low
                ch4(b4-b7) 0-5                 <=1 is low
        11 WH55 ch1        0-5                 <=1 is low
        12 WH55 ch2        0-5                 <=1 is low
        13 WH55 ch3        0-5                 <=1 is low
        14 WH55 ch4        0-5                 <=1 is low
        15 Unused
        16 Unused

For stations/sensors using a single bit for battery status 0=OK and
1=low. For stations/sensors using a single byte for battery
status >1=OK and <=1=low. For stations/sensors using a single byte for
battery voltage the voltage is 0.02 * the byte value.

    # WH24 F/O THWR sensor station
    # WH25 THP sensor
    # WH26(WH32) TH sensor
    # WH40 rain gauge sensor
*/
function decodeBatt(idx, buffer) {
    var status = {};

    batt_fields.forEach(([sensor, size, func, format]) => {
        var data = null;

        // if (size == 1)
        //     data = buffer.readUInt8(idx);
        // else if (size == 2)
        //     data = buffer.readUInt16BE(idx);
        // else if (size == 4)
        //     data = buffer.readUInt32BE(idx);

        data = buffer.readUIntBE(idx, size);

        idx += size;

        if (func !== null) {
            func(status, sensor, data, size, format);
        }
    });

    return status;
}



const wh41_batt = {
    1: { 'shift': 0, 'mask': 0x0FFFF },
    2: { 'shift': 4, 'mask': 0x0FFF },
    3: { 'shift': 8, 'mask': 0x0FF },
    4: { 'shift': 12, 'mask': 0x0F }
}

const wh55_batt = {
    1: { 'shift': 0, 'mask': 0xFF },
    2: { 'shift': 8, 'mask': 0xFF },
    3: { 'shift': 16, 'mask': 0xFF },
    4: { 'shift': 24, 'mask': 0xFF }
}

const batt_fields = [
    ['multi', 1, battMultiMask, MULTI_BATT],
    ['wh31', 1, battMaskAll, null],
    ['wh51', 2, battMaskAll, null],
    ['wh57', 1, battVal, null],
    ['wh68', 1, battVolt, null],
    ['ws80', 1, battVolt, null],
    ['unused', 1, null, null],
    ['wh41', 2, battValSplit, wh41_batt],
    ['wh55', 4, battValEach, wh55_batt],
    ['unused', 1, null, null],
    ['unused', 1, null, null]
]


function battMultiMask(status, multiSensor, data, size, format) {
    for (const [sensor, maskBit] of Object.entries(format)) {
        status[sensor] = (data & maskBit) == 1;
    }
}

function battMaskAll(status, sensor, data, size) {
    var sensorStatus = {};

    for (var i = 0; i < 8 * size; i++) {
        sensorStatus[`ch${i + 1}`] = (data & i) == 1;
    }

    status[sensor] = sensorStatus;
}

function battVal(status, sensor, data, size, format) {
    status[sensor] = data >= 0 && data < 2;
}

function battValSplit(status, sensor, data, size, format) {
    var sensorStatus = {};

    for (const [ch, f] of Object.entries(format)) {
        var _data = (f.shift != null) ? data >> f.shift : data;

        if (f.mask != null) {
            _data = (_data & f.mask);

            if (_data == f.mask)
                _data = false;
        }

        sensorStatus[`ch${ch}`] = _data;
    }

    status[sensor] = sensorStatus;
}

function battValEach(status, sensor, data, size, format) {
    var sensorStatus = {};

    for (const [ch, f] of Object.entries(format)) {
        var _data = (f.shift != null) ? data >> f.shift : data;

        if (f.mask != null) {
            _data = (_data & f.mask);

            if (_data == f.mask)
                _data = false;
        }

        sensorStatus[`ch${ch}`] = _data;
    }

    status[sensor] = sensorStatus;
}

function battVolt(status, sensor, data, size) {
    status[sensor] = data < 256 ? false : data * 0.2;
}


function calcChecksum(body) {
    var chksum = 0;
    body.forEach(b => chksum += b);
    return chksum % 256;
};


module.exports = GW1000Utils;