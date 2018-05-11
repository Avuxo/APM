
// global, complete array of all data
// this is loaded at the start of the program
// updates are checked every 3000ms, but data is only pushed when
// a new ID is seen.
var data = [];

// the last APM ID seen. This is set at the end of the init function
// and is reset at a maximum every 3000ms.
var lastIDSeen = 0;


/*
  Create the C3 charts
*/

// line graph for strings and objects created live
var numUsed = c3.generate({
    bindto: '#numUsedChart',
    data: {
        columns:[
            ['number of strings allocated', 27, 3, 3, 0, 3],
            ['number of classes loaded', 45, 5, 5, 0, 5]
        ]
    },
    title: {
        text: 'Number of objects allocated'
    }
});

// line graph to map the time per request
var timePerRequest = c3.generate({
    bindto: '#timePerRequestChart',
    data: {
        columns:[
            ['Time per request (ms)', 421, 568, 812, 532, 714]
        ]
    },
    title: {
        text: 'Time per request in milliseconds'
    }
});

// bar graph to show the averages of the allocated objects
var averageObjects = c3.generate({
    bindto: '#averageObjectsChart',
    data: {
        columns: [
            ["number of strings", 13],
            ["number of classes", 25]
        ],
        types: {
            'number of strings': 'bar',
            'number of classes': 'bar'
        }
        
    },
    title: {
        text: 'Average number of objects allocated'
    }
});

// donut chart to show memory usage by `region'.
var memoryUsage = c3.generate({
    bindto: '#memoryUsageChart',
    data: {
        columns: [
            ['Other', 70],
            ['Strings', 10],
            ['Classes', 20]
        ],
        type: 'donut'
    },
    donut: {
        title: 'Memory Usage Breakdown'
    }
})

// async HTTP get request wrapper around XMLHR
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
        // the first ID is the id of the first thing found.
        data = JSON.parse(res).data;
        lastIDSeen = data[data.length - 1].id;
    }, "/fullMetrics");


    // every 3 seconds poll the server to check for new information.
    setInterval(function(){
        console.log('mom');
        httpGET(function(res){
            let response =  JSON.parse(res);
            // ensure that the same data is not being added twice.
            if(response.id !== lastIDSeen){
                data.push(response);
                lastIDSeen = response.id;
            }
        }, "/metrics")
    }, 3000);
})();
