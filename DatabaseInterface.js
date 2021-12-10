// The interface to interact with the backend app
//
//

// const DEFAULT_WEB = "http://192.168.0.39:3000";
const DEFAULT_WEB = "http://fel.ddns.net:3000";
const DEFAULT_URL = DEFAULT_WEB+"/data/list";
const DEFAULT_HIEARCHY_URL = DEFAULT_WEB+"/data/hierarchy";

// Acquire the list database
// onLoaded: function(err, responseJSON)
function getDatabaseJSON(onLoaded, reqURL = DEFAULT_URL) {
    let req = new XMLHttpRequest();
    req.open("GET", reqURL, true);
    req.setRequestHeader("Accept", "application/json");
    req.onload = () => {
        let status = req.status;
        if(status === 200) {
            onLoaded(null, req.response);
        } else {
            onLoaded(status, req.response);
        }
    };
    req.send();
}

function getDatabaseHiearchyJSON(onLoaded, reqURL = DEFAULT_HIEARCHY_URL) {
    return getDatabaseJSON(onLoaded, reqURL);
}