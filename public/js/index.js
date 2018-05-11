/* 
   this script manages obtaining data for and updating the graphs on the `/'
   endpoint for APM. All charts and graphs are made using the C3js library,
   based off of D3js.
*/

// structured data object for updating charts more easily.
// this is loaded at the start of the program
// updates are checked every 3000ms, but data is only pushed when
// a new ID is seen.
var data = {
    numStrings: [],
    numClasses: [],
    numNodes: [],
    time: [],
    averageObjects: {
        numStrings: 0,
        numClasses: 0,
        numNodes: 0
    },
    memoryUsageData: {
        other: [],
        strings: [],
        classes: []
    },
    lastIDSeen: 0
};

/*
  Create the C3 charts
*/

// line graph for strings and objects created live
var numUsed = c3.generate({
    bindto: '#numUsedChart',
    data: {
        columns:[
            ['number of strings allocated'],
            ['number of classes loaded']
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
            ['Time per request (ms)']
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
            ["number of strings"],
            ["number of classes"]
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
            ['Other'],
            ['Strings'],
            ['Classes']
        ],
        type: 'donut'
    },
    donut: {
        title: 'Heap Usage Breakdown'
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


// calculate the average of a dataset with a given key
// average time per request: calculateAverage('time')
// always uses the `data' object.
function calculateAverage(key){
    // look through the dataset
    let total = 0;
    for(let item in data[key]){
        // sum up the data
        total += data[key][item];
    }
    // calculate the mean.
    return (total / data[key].length);
}





// entry point //
(function(){
    // initial fetch of data.
    httpGET(function(res){
        // the first ID is the id of the first thing found.
        let response = JSON.parse(res).data;

        loadInitialData(response);
    }, "/fullMetrics");


    // every 3 seconds poll the server to check for new information.
    setInterval(function(){
        httpGET(function(res){
            let response =  JSON.parse(res);
            // ensure that the same data is not being added twice.
            if(response.id !== data.lastIDSeen){
                // update the charts
                updateData(response);
            }
        }, "/metrics")
    }, 3000);
})();





// load the data initially.
// this is only called at the start of the main function.
// parses original object into the `data' object.
function loadInitialData(res){
    data.lastIDSeen = res[res.length - 1].id;

    // map the result number strings to create the number strings array
    data.numStrings = res.map(obj => obj.numStrings);
    data.numClasses = res.map(obj => obj.numClasses);
    data.time       = res.map(obj => obj.time);
    data.numNodes   = res.map(obj => obj.numNodes);

    // calculate the averages for the bar graph.
    data.averageObjects.numStrings = (calculateAverage('numStrings'));
    data.averageObjects.numClasses = (calculateAverage('numClasses'));
    data.averageObjects.numNodes   = (calculateAverage('numNodes'));
    
    // update the charts
    updateCharts();
}

// parse response into the `data' global object
function updateData(res){
    data.lastIDSeen = res.id;

    // add all of `res' data into the data object in the correct format
    data.numStrings.push(res.numStrings);
    data.numClasses.push(res.numClasses);
    data.numNodes.push(res.numNodes);
    data.time.push(res.time);
    
    // calculate the averages for the bar graph.
    data.averageObjects.numStrings = (calculateAverage('numStrings'));
    data.averageObjects.numClasses = (calculateAverage('numClasses'));
    data.averageObjects.numNodes   = (calculateAverage('numNodes'));

    updateCharts();
}

// update all of the charts with new data
// assumes the top of the array is new data (is dependent on where it's called from).
function updateCharts(){
    // update the strings and objects creation graph
    numUsed.load({
        columns: [
            ['number of strings allocated'].concat(data.numStrings),
            ['number of classes loaded'].concat(data.numClasses)
        ],
        duration: 100
    });

    // update the `time per request' graph.
    timePerRequest.load({
        columns: [
            ['Time per request (ms)'].concat(data.time)
        ],
        duration: 100
    });

    // update the average bar graph.
    averageObjects.load({
        columns: [
            ['number of strings', data.averageObjects.numStrings],
            ['number of classes', data.averageObjects.numClasses]
        ]
    });

    // update the donut graph
    // get the number of nodes not used by strings or objects
    let diffedNodes = data.averageObjects.numNodes - data.averageObjects.numStrings - data.averageObjects.numClasses;
    memoryUsage.load({
        columns: [
            ['Other', Math.floor(100 * (diffedNodes / data.averageObjects.numNodes))],
            ['Strings', Math.floor(100 * (data.averageObjects.numStrings / data.averageObjects.numNodes))],
            ['Classes', Math.floor(100 * (data.averageObjects.numClasses / data.averageObjects.numNodes))]
        ]
    });
    
}
