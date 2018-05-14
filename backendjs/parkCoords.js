const request = require("request");

const caliParkCodes = ['redw', 'seki', 'jotr', 'deva', 'yose', 'alca', 'cabr',
    'camo', 'chis', 'lavo', 'moja', 'muwo', 'pinn', 'samo'];
const NPSurl = "https://developer.nps.gov/api/v1/parks?stateCode=CA&api_key=w3MK8VP4xrCkCN83HG80Efj5vrg8o5VsIxQDsI5l";
const latOffset = 4;
const lngOffset = 7;

exports.findCoords = function(parkIdToSearch) {
    request({
            url: NPSurl,
            method: "GET",
            json: true
        }, (error, response, body) => {
        
        let coords = 0;

        for(const i of body.data) {
            if(i.parkCode === parkIdToSearch) {
                let comma = i.latLong.indexOf(",");
                let lat = i.latLong.substring(latOffset, comma);
                let lng = i.latLong.substring(comma + lngOffset, i.latLong.length);

                if(lat === ''){
                    console.log("no lat/lng data available");
                }

                coords = [lat, lng];
                break;
            }
        }
        //console.log(coords);
        return coords;
    });
}
