queue()
   .defer(d3.json, "/mentalHealth/employment")
   .await(makeGraphs);

function makeGraphs(error, projectsJson) {


    // Clean projectsJson data
    var mhEmployment = projectsJson;
    //
    // var dateFormat = d3.time.format("%Y-%m-%d");
    // mhEmployment.forEach(function (d) {
    //     d["Year"] = dateFormat.parse(d["Year"] + "-1-1");            //  Torn between keeping date format or not
    //     d["Year"].setDate(1);
    // });



    // //pie experiment
    // mhEmployment.forEach(function (d) {
    //     d.gender = Gender(d.Gender);
    //     d.total = d.Gender + d.Region + d.Age;       //come back to this - onto something
    //     d.Year = d.date.getFullYear();
    // })
    // //pie experiment



    var ndx = crossfilter(mhEmployment);

    // new functions

    function reduceAdd(p, v) {
        ++p.count;
        p.total += v["Employment rate of people with mental illness"];
        p.average = p.total / p.count;
        return p;
}

function reduceRemove(p, v) {
        --p.count;
        p.total += v["Employment rate of people with mental illness"];
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
        p.total += v["Employment rate of population"];
        p.average = p.total / p.count;
        return p;
}

function reduceInitialGen() {
        return {count: 0, total: 0, average: 0};
        }

        // functions as above but for pie
//
//     function reduceAddGender(p, v) {
//         ++p.count;
//         p.total += v["Gender"];
//         p.average = p.total / p.count;
//         return p;
// }
//
// function reduceRemoveGender(p, v) {
//         --p.count;
//         p.total += v["Gender"];
//         p.average = p.total / p.count;
//         return p;
// }
//
// function reduceInitialGender() {
//         return {count: 0, total: 0, average: 0};
// }


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

   var genderDim = ndx.dimension(function (d) {
       return d["Gender"];
   });

   var regionDim = ndx.dimension(function (d) {
       return d["Region"];
   });

   var filterDimension = ndx.dimension(function(d) {return d["Region"];});

       filterDimension.filter(function (d) { return d !== 'England'; });

      var ageDim = ndx.dimension(function (d) {
       return d["Age"];
   });

   // var ageFilterDimension = ndx.dimension(function(d) {return d["Age"];});
   //
   //     ageFilterDimension.filter(function (d) { return d !== 'All'; });


   // Groups go here

    var numYear = YearDim.group();
 //   var numMhEmployed = mhEmployedDim.group();
 //    var numMhEmployed = YearDim.group().reduceSum(function (d) {
 //        return d["Employment rate of people with mental illness"];
  //   });
    var numMhEmployed = YearDim.group().reduce(reduceAdd, reduceRemove, reduceInitial);
    var numPopEmployed = YearDim.group().reduce(reduceAddGen, reduceRemoveGen, reduceInitialGen);

    var numGender = genderDim.group();   // was YearDim
    var numRegion = regionDim.group();
    var numAge = ageDim.group();

    // var functionRegionGroup = regionDim.group();
    // var filteredFunctionGroup = {
    // all: function () {
    //     return functionRegionGroup.top(Infinity).filter( function (d) { return d["Region"] !== "England"; } );
    // }
// };

    // var numRegion = YearDim.group().reduce(reduceAdd, reduceRemove, reduceInitial);
    // var numAge = YearDim.group().reduce(reduceAdd, reduceRemove, reduceInitial);



//     // remove comma experiment
//
//     var array =  [ "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014"  ];
//
//
//
// //Removes the comma from each string
// array.forEach(function(string, i){
//    array[i] = string.replace(',', '');
// });
//
//
// //Output the whole array
// for(var i = array.length; i--;)
//    print(array[i]);
//
//
//
//
//
// //Sends things to the DOM
// function print(text){
//    var elem = document.createElement('p');
//    elem.innerHTML = text;
//    document.body.appendChild(elem);
// }







    // remove comma experiment

    //Chart definitions go here

    var minYear = YearDim.bottom(1)[0]["Year"];
    var maxYear = YearDim.top(1)[0]["Year"];

    var YearChart = dc.compositeChart("#Year-chart");  // was #Year-chart
    var MhEmployedChart = dc.rowChart("#mhEmployed-row-chart");
    var PopEmployedChart = dc.rowChart("#popEmployed-row-chart");  // manipulate css to be my own
    var regionPieChart = dc.pieChart("#region-pie-chart");
    var agePieChart = dc.pieChart("#age-pie-chart");

    var colorScale = d3.scale.ordinal().range(["#ffc0cb", "#ff6680", "#ff1a40", "#acbdec", "#2e59cd", "#121382", "#0c0e5a", "#ffd280","#ffc14d", "#ffa500", "#b37400"  ]);

    // (["#b3b3b3", "#808080", "#595959", "#acbdec", "#2e59cd", "#121382", "#0c0e5a", "#ffd280","#ffc14d", "#ffa500", "#b37400"  ]);  ==== original color array

       YearChart
       .width(800)
       .height(500) // was 400
       .margins({top: 10, right: 50, bottom: 30, left: 50})
       .dimension(YearDim) // was YearDim
       // .group(numYear)  // was numYear
       .transitionDuration(500)
       .x(d3.scale.linear().domain([2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014]))      // .x(d3.time.scale().domain([minYear, maxYear]))
       .y(d3.scale.linear().domain([0, 100]))
       .xAxisLabel("Year")
       .elasticX(true)
       .brushOn(false)
       .title(false)  // fixes 'object bug'
       .yAxisLabel("Employment rate (in %)")
       .compose([dc.lineChart(YearChart).group(numPopEmployed, "Employment rate of general population").colors('#2e59cd').valueAccessor(function(k) { return k.value.average }).renderArea(true),dc.lineChart(YearChart).group(numMhEmployed, "Employment rate of people with mental illness").colors('#ff6680').valueAccessor(function(k) { return k.value.average }).renderArea(true)])
       .legend(dc.legend().x(550).y(0).gap(5))
       .yAxis().ticks(48);
       // .x(tickFormat(d3.format("d")));                                                                                  //#ff6680 works nicely with blue here

        MhEmployedChart
       .width(550)
       .height(250)
       .dimension(YearDim) // was mhEmployedDim - experimenting
       .group(numMhEmployed)  // was numMhEmployed - works nicely on numYear
       // .x(d3.scale.linear().domain([0, 100]))
       .colors(colorScale)
       .valueAccessor(function(k) { return k.value.average })
       .xAxis().ticks(8);

        PopEmployedChart
       .width(550)
       .height(250)
       .dimension(YearDim)
       .group(numPopEmployed)
       .colors(colorScale)
       .valueAccessor(function(k) { return k.value.average })
       .xAxis().ticks(8);

        regionPieChart
       .height(220)
       .radius(90)
       .innerRadius(40)
       .transitionDuration(1500)
       .dimension(regionDim)     //was YearDim
      // .group(numGender)
       .group(numRegion)
       .colors(colorScale);
       // .title(function(d){return d.value;});
       // .valueAccessor(function(k) { return k.value.average });

        agePieChart
       .height(220)
       .radius(90)
       .innerRadius(40)
       .transitionDuration(1500)
       .dimension(ageDim)     //was YearDim
      // .group(numGender)
       .group(numAge)
       .colors(colorScale);
       // .title(function(d){return d.value;});

        // var x = '2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014';
        // x.replace(',','');

    dc.renderAll();
}