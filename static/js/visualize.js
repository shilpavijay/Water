var h = 500;
var w = 800;

var svg = 	d3.select("body").append("svg")
			.attr("id","chart")
			.attr("width",w)
			.attr("height",h);

var num = 30;
var types = 6;
var margin = {
	top: 60,
	bottom: 80,
	left: 80,
	right: 80
};

var width = w - margin.left - margin.right;
var height = h - margin.top - margin.bottom;

var g = svg.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//get data in JSON from the flask view
// $.get("/getData/",function(data){
//    json = $.parseJSON(data);
// 	 console.log(json);
//  });


var x = d3.scaleBand()
				.rangeRound([0,width])
				.paddingInner(0.15)
				.align(0.1)


var y = d3.scaleLinear()
				.rangeRound([height,0]);

// var colorScale = d3.scaleOrdinal(d3.schemeCategory20);

var z = d3.scaleOrdinal()
				// .range(["#7ed39c","#70bc8b","#62a479","#548d68","#467557","#385e45","#2a4634"]);
				.range(["#6b3638","#7c3f41","#8d474a","#9e5053","#a76164","#b17275"]);


d3.csv("/static/dataRefined.csv", function(d,i,cols){
		for (i = 1, t = 0; i < cols.length; ++i) t += d[cols[i]] = +d[cols[i]];
	  d.total = t;
		// console.log(d)
	  return d;
},
function(error, data) {
  if (error) throw error;

	var keys = data.columns.slice(1);
	// console.log(keys);
	// data.sort(function(a,b){
	// 	return b.total - a.total;
	// });

	x.domain(data.map(function(d){
		return d.Country;
	}));

	y.domain([0,d3.max(data, function(d){
		return d.total;
	})]).nice();

	z.domain(keys);

	g.append("g")
		.selectAll("g")
		.data(d3.stack().keys(keys)(data))
		.enter()
			.append("g")
			.attr("fill", function(d){
				return z(d.key);
			})
			.selectAll("rect")
			.data(function(d){ return d;})
			.enter()
				.append("rect")
				.attr("x", function(d){
						return x(d.data.Country);
				})
				.attr("y", function(d){
						return y(d[1]);
				})
				.attr("height", function(d){
						return y(d[0]) - y(d[1]);
				})
				.attr("width", function(d){
					  console.log(x.bandwidth)
						return x.bandwidth();
				})


  g.append("g")
	  .classed("axis", true)
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(x))
			.selectAll("text")
				.classed("x-axis text",true)
				.style("text-anchor","end")
				.attr("dx",-13)
				.attr("dy",-6)
				.attr("transform","translate(0,0) rotate(-45)")

		g.append("g")
	      .classed("axis", true)
	      .call(d3.axisLeft(y).ticks(null, "s"))
	    .append("text")
	      .attr("x", 2)
	      .attr("y", y(y.ticks().pop()) + 0.5)
	      .attr("dy", "0.5em")
	      .attr("fill", "#000")
	      .attr("font-weight", "bold")
	      .attr("text-anchor", "start")
	      .text("Population using basic drinking-water services(%)")
				.attr("transform","translate(-55," + (height - 30) + ") rotate(-90)");


//Top right Legend
var legend = g.append("g")
				.attr("font-family","sans-serif")
				.attr("font-size", 10)
				.attr("text-anchor","end")
			.selectAll("g")
			.data(keys.slice().reverse())
			.enter()
				.append("g")
				.attr("transform", function(d,i){
					 return "translate(0," + i*20 + ")"
				});

		legend.append("rect")
      .attr("x", width)
      // .attr("y", -2)
      .attr("width", 19)
      .attr("height", 19)
      .attr("fill", z);

  legend.append("text")
      .attr("x", width - 3)
      .attr("y", 9.5)
      .attr("dy", "0.32em")
      .text(function(d) { return d; });
});