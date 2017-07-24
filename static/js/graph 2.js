queue()
   .defer(d3.json, "/mentalHealth/mortality_employment")
   .await(makeGraphs);

function makeGraphs(error, projectsJson) {

   //Clean projectsJson data
   var mhEmploymentMortality = projectsJson;
   var ndx = crossfilter(mhEmploymentMortality);

   //Dimensions go here

   var MhEmploymentDim = ndx.dimension(function (d) {
       return d["mhEmployment"];
   });

   // Groups go here
   var numMhEmployment = MhEmploymentDim.group();

   //Chart definitions go here
   //var MhEmploymentChart = dc.pieChart("#mhEmployment");

      MhEmploymentChart
       .height(220)
       .radius(90)
       .innerRadius(40)
       .transitionDuration(1500)
       .dimension(MhEmploymentDim)
       .group(numMhEmployment);

    dc.renderAll();
}