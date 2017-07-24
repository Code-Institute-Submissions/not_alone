queue()
   .defer(d3.json, "/mentalHealth/conditions")
   .await(makeGraphs);

function makeGraphs(error, projectsJson) {

   //Clean projectsJson data
/* var mhEmploymentMortality = projectsJson;
   var dateFormat = d3.time.format("%Y-%m-%d %H:%M:%S");
   mhEmploymentMortality.forEach(function (d) {
       d["Year"] = dateFormat.parse(d["Year"]);
       d["Year"].setDate(1);
       d["mhEmployment-nd"] = +d["mhEmployment-nd"];
   }); */


   //Create a Crossfilter instance
   var ndx = crossfilter(mhEmploymentMortality);

   //Define Dimensions
   var YearDim = ndx.dimension(function (d) {
       return d["Year-chart"];  //  matches
   });
   var mhDeathsDim = ndx.dimension(function (d) {
       return d["mhDeaths-row-chart"];  // matches
   });
   var MhEmploymentDim = ndx.dimension(function (d) {
       return d["mhEmployment"];  // matches
   });
   var popEmploymentDim = ndx.dimension(function (d) {
       return d["popEmployment-row-chart"];  // matches
   });
   var mhDeathDim = ndx.dimension(function (d) {
       return d["mhDeaths-nd"];  // variable not matched - cannot find currently
   });

   var mhEmploymentStatus = ndx.dimension(function (d) {
       return d["mhEmployment-nd"];  // variable not matched - cannot find currently
   });


   //Calculate metrics
   var numYear = YearDim.group();  // completed
   var numMhDeaths = mhDeathsDim.group();  // completed
   var numPopEmployment = popEmploymentDim.group()  // completed
   var numMhEmployment = MhEmploymentDim.group();  // completed
   var totalDeaths = YearDim.group().reduceSum(function (d) {
       return d["total_deaths"];
   });
   var YearGroup = YearDim.group();


   var all = ndx.groupAll();
   var totalDonations = ndx.groupAll().reduceSum(function (d) {
       return d["total_deaths"];
   });

   var max_year = totalDeaths.top(1)[0].value;

   //Define values (to be used in charts)
   var minYear = YearDim.bottom(1)[0]["Year"];
   var maxYear = YearDim.top(1)[0]["Year"];

   //Charts
   var YearChart = dc.barChart("#Year-chart");
   var MhDeathsChart = dc.rowChart("#mhDeaths-row-chart");
   var popEmploymentChart = dc.rowChart("#popEmployment-row-chart");
   var numberProjectsND = dc.numberDisplay("#number-projects-nd"); // need to update to my data - not sure what should go there
   var mhDeathReading = dc.numberDisplay("#mhDeaths-nd");
   var MhEmploymentChart = dc.pieChart("#mhEmployment");


   selectField = dc.selectMenu('#menu-select')
       .dimension(YearDim)
       .group(YearGroup); // should be right


   numberProjectsND  // need to update to my data - not sure what should go there
       .formatNumber(d3.format("d"))
       .valueAccessor(function (d) {
           return d;
       })
       .group(all);

   mhDeathReading
       .formatNumber(d3.format("d"))
       .valueAccessor(function (d) {
           return d;
       })
       .group(totalDonations)
       .formatNumber(d3.format(".3s"));  // completed

   YearChart
       .width(800)
       .height(200)
       .margins({top: 10, right: 50, bottom: 30, left: 50})
       .dimension(YearDim)
       .group(numYear)
       .transitionDuration(500)
       .x(d3.time.scale().domain([minDate, maxDate]))
       .elasticY(true)
       .xAxisLabel("Year")
       .yAxis().ticks(4);  // completed

   MhDeathsChart
       .width(300)
       .height(250)
       .dimension(mhDeathsDim)
       .group(numMhDeaths)
       .xAxis().ticks(4);  // completed

   popEmploymentChart
       .width(300)
       .height(250)
       .dimension(popEmploymentDim)
       .group(numPopEmployment)
       .xAxis().ticks(4);  // completed

   MhEmploymentChart
       .height(220)
       .radius(90)
       .innerRadius(40)
       .transitionDuration(1500)
       .dimension(MhEmploymentDim)
       .group(numMhEmployment);  // completed


   dc.renderAll();
}