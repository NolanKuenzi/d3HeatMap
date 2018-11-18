import "../css/style.css";
import * as d3 from "d3";

const width = 1600;
const height = 450;

let svg = d3.select("#svg1")
            .attr("height", height)
            .attr("width", width);

let margin = {top: 22, right: 86, bottom: 30, left: 150};
const viewWidth = +svg.attr("width") - margin.right - margin.left;
const viewHeight = +svg.attr("height") - margin.top - margin.bottom;

svg = svg.append("g")
         .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json").then(function(data) { 
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]; 

  const xAxisScale = d3.scaleLinear()
                       .domain([(d3.min(data.monthlyVariance, d => d.year) - 0.5), (d3.max(data.monthlyVariance, d => d.year) + 1)])
                       .range([0, viewWidth]);  

  const xAxisCall = d3.axisBottom(xAxisScale)
                      .ticks(26)
                      .tickSize(8)
                      .tickSizeOuter(0) 
                      .tickFormat(d3.format("d"));

  const xAxis = svg.append("g")
                   .attr("id", "x-axis")
                   .attr("transform", "translate(" + 0 + "," + viewHeight + ")")
                   .style("font-size", 16)
                   .call(xAxisCall);
  
  const yAxisScale = d3.scaleBand()
                       .domain([...months])
                       .range([0, viewHeight]);
             
  const yAxisCall = d3.axisLeft(yAxisScale)
                      .tickSize(8)
                      .tickSizeOuter(0);
  
  const yAxis = svg.append("g")
                   .attr("id", "y-axis")
                   .style("font-size", 16)
                   .call(yAxisCall);

  const heatMapData = [{number: 2.8, color: "#0040ff"}, {number: 3.9, color: "#0080ff"},
                       {number: 5.0, color: "#00bfff"}, {number: 6.1, color: "#00ffff"}, 
                       {number: 7.2, color: "#e6e6e6"}, {number: 8.3, color: "#ffa64d"}, 
                       {number: 9.5, color: "#ff9933"}, {number: 10.6, color: "#cc6600"},
                       {number: 11.7, color: "#804000"}, {number: 12.8, color: "#ff3300"},
                       {number: "", color: "#801a00"}];

  const toolTip = d3.select("body")
                    .append("div")
                    .attr("id", "toolTip")
                    .style("position", "absolute")
                    .style("background-color", "black")
                    .style("color", "white")
                    .style("display", "none");
  
  svg.append("text")
     .attr("id", "y-axisLabel")
     .attr("text-anchor", "end")
     .attr("x", -160)
     .attr("y", -75)
     .attr("transform", "rotate(-90)")
     .style("font-size", "18px")
     .text("Months");
     
  const bars = d3.select("svg").append("g")
                 .selectAll("rect")
                 .data(data.monthlyVariance)
                 .enter()
                 .append("rect")
                 .attr("class", "cell")
                 .attr("data-month", d => d.month)
                 .attr("data-year", d => d.year)
                 .attr("data-temp", d => (8.66 + d.variance).toFixed(1))
                 .attr("x", (d, i) => xAxisScale(d.year) + margin.left - 1.5)
                 .attr("y", d => yAxisScale(months[d.month - 1]) + margin.top)
                 .attr("width", 6)
                 .attr("height", 33)
                 .style("fill", function(d) {
                   const testValue = (8.66 + d.variance).toFixed(1);
                   let fillColor;
                     for (let i = 0; i < heatMapData.length; i++) {
                       if (testValue < heatMapData[i].number) {
                         fillColor = heatMapData[i].color;
                         return fillColor;
                       }
                       if (testValue >= heatMapData[9].number) {
                         fillColor = heatMapData[10].color;
                         return fillColor;
                       }
                     }  
                  })
                 .on("mouseover", function(d) {
                 const toolT = document.getElementById("toolTip");
                 const monthNumber = d.month - 1;
                 const positive = d.variance.toString().slice(0, 1);
                   d3.select(this)
                     .style("stroke", "black")
                     .style("stroke-width", 3);
                   toolTip
                     .attr("data-year", d.year)
                     .style("display", "inline-block")
                     .html(() => `${d.year} - ${months[monthNumber]} <br> ${(8.66 + d.variance).toFixed(1)}°C <br> ${positive === "-" ? d.variance.toFixed(1) : "+" + d.variance.toFixed(1)}°C`)
                     .style("left", d3.event.pageX - (toolT.offsetWidth / 2) + "px")   
                     .style("top", d3.event.pageY - 125 + "px");
                 })
                 .on("mouseleave", function(d) {
                   d3.select(this)
                     .style("stroke", "none");
                   toolTip
                     .style("display", "none");
                   });   

  const width2 = 400;
  const height2 = 90;

  let svg2 = d3.select("#legend") 
               .attr("height", height2)
               .attr("width", width2);

  const margin2 = {top: 5, right: 35, bottom: 0, left: 20};
  const viewHeight2 = +svg2.attr("height") - margin2.right - margin2.left;
  
  svg = svg.append("g")
           .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");   
  
  let legendNumbers = [...heatMapData];
  legendNumbers = legendNumbers.map(d => d.number.toString());
  legendNumbers.splice(10, 1);
  
  const legendScale = d3.scaleBand()
                        .domain([...legendNumbers])
                        .range([0, 359]);

  const legendFormat1 = d3.format(".2n");
  const legendFormat2 = d3.format(".3n");
 
  const legendCall = d3.axisBottom(legendScale)
                      .tickValues(legendNumbers)
                      .tickFormat(d => d.length === 4 ? legendFormat2(d) : legendFormat1(d))
                      .tickSize(12)
                      .tickSizeOuter(0);
                   
  const legendAxis = svg2.append("g")
                         .attr("transform", "translate(" + margin2.left + "," + viewHeight2 + ")")
                         .style("font-size", 16)
                         .style("stroke-width", 1.5)
                         .call(legendCall);
  
  const legendColors = svg2.append("g")
                           .selectAll("rect")  
                           .data(heatMapData)
                           .enter()
                           .append("rect")
                           .attr("x", (d, i) => (i * 395) / heatMapData.length + 2.5)
                           .attr("y", 6)
                           .attr("height", 30)
                           .attr("width", 35)
                           .style("fill", d => d.color)
                           .style("stroke", "black")
                           .style("stroke-width", 1.5);

}).catch(function(error) {
  alert("Data failed to load, please try again");
});
                        
/* For mobile devices */
const clear = document.querySelector("body");
clear.addEventListener("touchstart", function(e) {
  const clearCells = document.getElementsByClassName("cell");
  const clearToolTip = document.getElementById("toolTip");
  if (e.target.className.baseVal !== "cell") {
    clearToolTip.style.display = "none";
  } 
  for (let i = 0; i < clearCells.length; i++) {
    clearCells[i].style.stroke = "none";
  }
  if (e.target.className.baseVal === "cell") {
      e.target.style.stroke = "black";
      e.target.style.strokeWidth = 3;
  }              
});