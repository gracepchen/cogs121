const request = require("request");

const caliParkCodes = ['redw', 'seki', 'jotr', 'deva', 'yose', 'alca', 'cabr',
    'camo', 'chis', 'lavo', 'moja', 'muwo', 'pinn', 'samo'];
const NPSurl = "https://developer.nps.gov/api/v1/parks?stateCode=CA&api_key=w3MK8VP4xrCkCN83HG80Efj5vrg8o5VsIxQDsI5l";

exports.findCoords = function() {
    request({
            url: NPSurl,
            method: "GET",
            json: true
        }, (error, response, body) => {
        
        for(const i of body.data) {
            let comma = i.latLong.indexOf(",");
            let lat = i.latLong.substring(0 + 4, comma);
            let lng = i.latLong.substring(comma + 1 + 6, i.latLong.length);

            console.log("Lat sub: " + lat + "\nLng sub: " + lng);
        }
    });
}
