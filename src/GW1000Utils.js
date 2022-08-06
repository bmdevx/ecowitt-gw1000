const {
    DATA_STRUCT,
    GENERIC_RESULT_STRUCT, GENERIC_VALUE_RESULT_STRUCT,
    CUSTOMIZED_SERVER_STRUCT,
    SOIL_DATA_STRUCT_GET, SOIL_DATA_STRUCT_SET,
    USER_PATH_STRUCT,
    RAIN_DATA_STRUCT, RAIN_STRUCT,
    PM25_OFFSET_STRUCT,
    CO2_OFFSET_STRUCT
} = require('./Structs');
const {
    PARSE_DECODERS,
    BATT_FIELDS,
    parseStructStrict,
    packStructStrict,
} = require('./ParseDecoders');
const {
    decodeUgm3
} = require('./Decoders');


class GW1000Utils {
    constructor(isWH24 = false) {
        this.batt_fields = {};
        Object.assign(this.batt_fields, BATT_FIELDS);
        var multi_batt = this.batt_fields[0][3];

        if (isWH24) {
            if (multi_batt.wh24 == undefined) {
                multi_batt.wh24 = multi_batt.wh65;
                delete multi_batt.wh65;
            }
        } else {
            if (multi_batt.wh65 == undefined) {
                multi_batt.wh65 = multi_batt.wh24;
                delete multi_batt.wh24;
            }
        }
    }


    parseResult(buffer, hasValue = false) {
        const result = parseStructStrict(buffer, hasValue ? GENERIC_VALUE_RESULT_STRUCT : GENERIC_RESULT_STRUCT);
        result['cmd'] = buffer.readUInt8(3);
        return result;
    }


    parseLiveData(buffer, timestamp = null) {
        var data = {}, idx = 5;
        const size = buffer.readUInt16BE(3);

        while (idx < size - 1 && idx < buffer.length - 1) {
            const cix = buffer.readUInt8(idx++);
            if (DATA_STRUCT[cix] === undefined) {
                break;
            }

            var [field, funcName, fieldSize, extra] = DATA_STRUCT[cix];

            if (PARSE_DECODERS[funcName] != undefined) {
                if (typeof extra === 'string' && extra === 'utils') {
                    extra = this;
                }

                data[field] = PARSE_DECODERS[funcName](idx, buffer, fieldSize, extra);

                idx += fieldSize;
            } else {
                throw 'Unknown Parse/Decode Function';
            }
        }

        if ('datetime' in data === false) {
            data['datetime'] = timestamp != null ? timestamp : Date.now();
        }

        return data;
    }


    parseRainData(buffer) {
        return parseStructStrict(buffer, RAIN_DATA_STRUCT);
    }

    parseRain(buffer) {
        const size = buffer.readUInt16BE(3);
        var data = {}, idx = 5;

        while (idx < size - 1 && idx < buffer.length - 1) {
            const cix = buffer.readUInt8(idx++);
            if (DATA_STRUCT[cix] === undefined) {
                throw 'Unknown Field Type';
            }
            var [field, funcName, fieldSize, extra] = RAIN_STRUCT[cix] != undefined ? RAIN_STRUCT[cix] : DATA_STRUCT[cix];

            if (PARSE_DECODERS[funcName] != undefined) {
                if (typeof extra === 'string' && extra === 'utils') {
                    extra = this;
                }

                data[field] = PARSE_DECODERS[funcName](idx, buffer, fieldSize, extra);

                idx += fieldSize;
            } else {
                throw 'Unknown Decode Function';
            }
        }

        return data;
    }

    packRainData(data) {
        return packStructStrict(data, RAIN_DATA_STRUCT);
    }


    parseCustomServerInfo(buffer) {
        return parseStructStrict(buffer, CUSTOMIZED_SERVER_STRUCT);
    }

    packCustomServerInfo(data) {
        return packStructStrict(data, CUSTOMIZED_SERVER_STRUCT);
    }

    parseUserPathInfo(buffer) {
        return parseStructStrict(buffer, USER_PATH_STRUCT);
    }

    packUserPathInfo(data) {
        return packStructStrict(data, USER_PATH_STRUCT);
    }


    parseSoilData(buffer) {
        const sizeOfSoilDataStruct = 8
        var idx = 4
        var data = []

        while (idx < buffer.length - 1) {
            var soilSlice = buffer.slice(idx, idx + sizeOfSoilDataStruct)

            data.push(parseStructStrict(soilSlice, SOIL_DATA_STRUCT_GET, 0));

            idx += sizeOfSoilDataStruct;
        }
        return data;
    }

    packSoilData(data) {
        return packStructStrict(data, SOIL_DATA_STRUCT_SET);
    }


    parsePM25Data(buffer) {
        const sizeOfPM25Struct = 3
        var idx = 4
        var sensors = []

        while (idx < buffer.length - 3) {
            var pm25Sensor = buffer.slice(idx, idx + sizeOfPM25Struct)

            sensors.push(parseStructStrict(pm25Sensor, PM25_OFFSET_STRUCT, 0));

            idx += sizeOfPM25Struct;
        }

        return sensors;
    }


    parseCO2OffsetData(buffer) {
        return parseStructStrict(buffer, CO2_OFFSET_STRUCT);
    }


    static calcChecksum(body) {
        var chksum = 0;
        body.forEach(b => chksum += b);
        return chksum % 256;
    };
}


module.exports = GW1000Utils;