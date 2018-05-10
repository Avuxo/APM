
// global, complete array of all data
// this is loaded at the start of the program
// updates are checked every 3000ms, but data is only pushed when
// a new ID is seen.
var data = [];

// the last APM ID seen. This is set at the end of the init function
// and is reset at a maximum every 3000ms.
var lastIDSeen = 0;


// HTTP get request
function httpGET(callback, url){
    let http = new XMLHttpRequest();
    http.onreadystatechange = () => {
        if(http.readyState === 4 && http.status === 200){
            callback(http.responseText);
        }
    }
    http.open("GET", url);
    http.send(null);
}

// entry point //
(function(){
    // initial fetch of data.
    httpGET(function(res){
        data = JSON.parse(res).data;
        lastIDSeen = data[0].id;
    }, "/fullMetrics");


    // every 3 seconds poll the server to check for new information.
    setInterval(function(){
        httpGET(function(res){
            let response =  JSON.parse(res);
            // ensure that the same data is not being added.
            if(response.id !== lastIDSeen){
                data.push(response);
                lastIDSeen = response.id;
            }
        }, "/metrics")
    }, 3000);
})();
