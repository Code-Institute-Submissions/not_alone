queue()
   .defer(d3.json, "/mentalHealth/employment")
   .await(makeGraphs);

function makeGraphs(error, projectsJson) {


    // Clean projectsJson data

    var mhEmployment = projectsJson;


    var dateFormat = d3.time.format("%Y-%m-%d");
   mhEmployment.forEach(function (d) {
        d["Year"] = dateFormat.parse(d["Year"]+"-1-1");
        d["Year"].setDate(1);
   });



    var ndx = crossfilter(mhEmployment);

    // New functions

    function reduceAdd(p, v) {
        ++p.count;
        p.total += v["Employment rate of people with mental illness"];
        p.average = p.total / p.count;
        return p;
    }

    function reduceRemove(p, v) {
        --p.count;
        p.total -= v["Employment rate of people with mental illness"];
        p.average = p.total / p.count;
        return p;
    }

    function reduceInitial() {
        return {count: 0, total: 0, average: 0};
    }

   function reduceAddGen(p, v) {
        ++p.count;
        p.total += v["Employment rate of population"];
        p.average = p.total / p.count;
        return p;
    }

    function reduceRemoveGen(p, v) {
        --p.count;
        p.total -= v["Employment rate of population"];
        p.average = p.total / p.count;
        return p;
    }

    function reduceInitialGen() {
        return {count: 0, total: 0, average: 0};
        }

    //Dimensions

    var YearDim = ndx.dimension(function (d) {
        return d["Year"];
    });

   var mhEmployedDim = ndx.dimension(function (d) {
       return d["Employment rate of people with mental illness"];
   });

   var popEmployedDim = ndx.dimension(function (d) {
       return d["Employment rate of population"];
   });

   var regionDim = ndx.dimension(function (d) {
       return d["Region"];
   });

   var rowYearDim = ndx.dimension(function (d) {
       return d["Row Year"];
   });

   var filterDimension = ndx.dimension(function(d) {return d["Region"];});

       filterDimension.filter(function (d) { return d !== 'England'; });

   // Groups

    var numYear = YearDim.group();
    var numRowYear = rowYearDim.group();
    var numMhEmployed = YearDim.group().reduce(reduceAdd, reduceRemove, reduceInitial);
    var numPopEmployed = YearDim.group().reduce(reduceAddGen, reduceRemoveGen, reduceInitialGen);
    var numRowMhEmployed = rowYearDim.group().reduce(reduceAdd, reduceRemove, reduceInitial);
    var numRowPopEmployed = rowYearDim.group().reduce(reduceAddGen, reduceRemoveGen, reduceInitialGen);  // ALTERATION - lines 96-97 - new groups
    var numRegion = regionDim.group().reduceCount(function(d) { return d["Region"];});

    //Chart definitions

    var minYear = YearDim.bottom(1)[0]["Year"];
    var maxYear = YearDim.top(1)[0]["Year"];

    var YearChart = dc.compositeChart("#Year-chart");
    var MhEmployedChart = dc.rowChart("#mhEmployed-row-chart");
    var PopEmployedChart = dc.rowChart("#popEmployed-row-chart");
    var regionPieChart = dc.pieChart("#region-pie-chart");

    var colorScale = d3.scale.ordinal().range(["#ffc0cb", "#ff6680", "#ff1a40", "#acbdec", "#2e59cd", "#121382", "#0c0e5a", "#ffd280","#ffc14d", "#ffa500", "#b37400"  ]);

       YearChart
       .width(800)
       .height(500)
       .margins({top: 10, right: 50, bottom: 30, left: 50})
       .dimension(YearDim)
       .transitionDuration(500)
       .x(d3.time.scale().domain([minYear, maxYear]))
       .y(d3.scale.linear().domain([0, 100]))
       .xAxisLabel("Year (2006-2014)")
       .elasticX(true)
       .brushOn(false)
       .title(false)
       .yAxisLabel("Employment rate (in %)")
       .compose([dc.lineChart(YearChart).group(numPopEmployed, "Employment rate of general population").colors('#2e59cd').valueAccessor(function(k) { return k.value.average }).renderArea(true),dc.lineChart(YearChart).group(numMhEmployed, "Employment rate of people with mental illness").colors('#ff6680').valueAccessor(function(k) { return k.value.average }).renderArea(true)])
       .legend(dc.legend().x(550).y(0).gap(5))
       .yAxis().ticks(48);

        MhEmployedChart
       .width(550)
       .height(250)
       .dimension(rowYearDim)
       .group(numRowMhEmployed)
       .colors(colorScale)
       .valueAccessor(function(k) { return k.value.average })
       .xAxis().ticks(8);

        PopEmployedChart
       .width(550)
       .height(250)
       .dimension(rowYearDim)
       .group(numRowPopEmployed)
       .colors(colorScale)
       .valueAccessor(function(k) { return k.value.average })
       .xAxis().ticks(8);

        regionPieChart
       .height(270)
       .width(370)
       .radius(90)
       .innerRadius(40)
       .transitionDuration(1500)
       .dimension(regionDim)
       .group(numRegion)
       .colors(colorScale)
       .externalLabels(40);

    dc.renderAll();
    }