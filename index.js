const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"

const req = new XMLHttpRequest()
 
let dataset = []

let xScale
let yScale
let xscaleAxis
let yscaleAxis

const w = 800
const h = 450
const padding = 40

const svg = d3.select(".container")
                    .append("svg")
                    



const genererateScales = ()=>{
    xScale = d3.scaleLinear()
                .domain([0, dataset.length-1])
                .range( [padding,w - padding] )
    yScale = d3.scaleLinear()
                .domain([0, d3.max(dataset, (d)=> d[1])])
                .range( [0, h - padding*2] )
    
 let datesArray = dataset.map((item)=> new Date(item[0]))

 xscaleAxis = d3.scaleTime()
                    .domain([d3.min(datesArray), d3.max(datesArray)])
                    .range([padding,w - padding])
 yscaleAxis = d3.scaleLinear()
                .domain([0, d3.max(dataset, (d)=> d[1])])
                .range( [h - padding ,padding] )
}

function drawbars (){
    let tooltip = d3.select("main")
                    .append("div")
                    .attr("id", "tooltip")
                    .style("visibility", "hidden")
                    .style("width", "auto")
                    .style("height", "auto")
                    .style("margin", "6px")
                  

    svg.selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("x", (d,i)=> xScale(i))
        .attr("y", (d,i)=> (h-padding)-yScale(d[1]))
        .attr("class", "bar")
        .attr("data-date", (d)=> d[0])
        .attr("data-gdp", (d)=> d[1])
        .attr("width", (w- padding*2)/dataset.length)
        .attr("height", (d)=> yScale(d[1]))
        .attr('index', (d, i) => i)
        .on('mouseover', function(){
            
            var i = this.getAttribute('index');
         
            tooltip.transition()
                    .style('visibility', "visible")
            tooltip.text(dataset[i][0]+", "+dataset[i][1]+" USD"); 
            
            document.querySelector('#tooltip').setAttribute("data-date", dataset[i][0]);

        })
        .on('mouseout', (d)=>{
            tooltip.transition()
                    .style('visibility', "hidden")
        })

        svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -300)
        .attr('y', 60)
        .text('Gross Domestic Product');

}

function generateAxes (){
    const xAxis = d3.axisBottom(xscaleAxis)
        svg.append("g")
        .call(xAxis)
        .attr("id", "x-axis")
        .attr("transform", "translate(0," + (h - padding) + ")")
    
        const yAxis = d3.axisLeft(yscaleAxis)
        svg.append("g")
        .call(yAxis)
        .attr("id", "y-axis")  
        .attr("transform", "translate("+ padding + ",0)") 

}

req.open( 'GET', url , true)
req.send();
req.onload = function(){
    const  data = JSON.parse(req.responseText)
    dataset = data.data

    
    svg.attr("width", w)
    svg.attr("height", h)   
    genererateScales()
    drawbars()
    generateAxes()
}