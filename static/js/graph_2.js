queue()
   .defer(d3.json, "/mentalHealth/employment")
   .await(makeGraphs);

function makeGraphs(error, projectsJson) {


    //Clean projectsJson data
    var mhEmployment = projectsJson;

    var dateFormat = d3.time.format("%Y-%m-%d");
    mhEmployment.forEach(function (d) {
        d["Year"] = dateFormat.parse(d["Year"] + "-1-1");
        d["Year"].setDate(1);
       // d["Employment rate of people with mental illness"] = +d["Employment rate of people with mental illness"]; //added this line in - may not need - commented out for now
    });

    var ndx = crossfilter(mhEmployment);


    //Dimensions go here

    var YearDim = ndx.dimension(function (d) {
        return d["Year"];
    });

   var mhEmployedDim = ndx.dimension(function (d) {
       return d["Employment rate of people with mental illness"];
   });

   var popEmployedDim = ndx.dimension(function (d) {
       return d["Employment rate of population"];
   });


   // Groups go here

    var numYear = YearDim.group();
    var numMhEmployed = mhEmployedDim.group();
    var numPopEmployed = popEmployedDim.group();


    //Chart definitions go here

    var minYear = YearDim.bottom(1)[0]["Year"];
    var maxYear = YearDim.top(1)[0]["Year"];

    var YearChart = dc.lineChart("#Year-chart");  // need to change to line chart and experiment with num
    var MhEmployedChart = dc.rowChart("#mhEmployed-row-chart");
    var PopEmployedChart = dc.rowChart("#popEmployed-row-chart");  // manipulate css to be my own

       YearChart
       .width(800)
       .height(200)
       .margins({top: 10, right: 50, bottom: 30, left: 50})
       .dimension(YearDim) // was YearDim
       .group(numYear)  // was numYear
       .transitionDuration(500)
       .x(d3.time.scale().domain([minYear, maxYear]))
       .elasticY(true)
       .xAxisLabel("Year")
       .brushOn(false)
       .yAxisLabel("Employment (%)")
       .yAxis().ticks(4);

        MhEmployedChart
       .width(300)
       .height(250)
       .dimension(mhEmployedDim) // was mhEmployedDim - experimenting
       .group(numMhEmployed)  // was numMhEmployed - works nicely on numYear
       .xAxis().ticks(4);

        PopEmployedChart
       .width(300)
       .height(250)
       .dimension(popEmployedDim)
       .group(numPopEmployed)
       .xAxis().ticks(4);

    dc.renderAll();
}