// Use d3.json() to fetch data from JSON file
var belly_data = "samples.json"

function panelFunction(d) {
  d3.json("samples.json").then((data) => {
      var firstData = data.metadata;

      var id_dropdown = firstData.filter(sampleID => sampleID.id == d);
      var IDNum = id_dropdown[0];

      var metadisplay = d3.select("#sample-metadata");
      metadisplay.html("");

      Object.entries(IDNum).forEach(([key, value]) => {
        metadisplay.append("h6").text(`${key}: ${value}`);
      });
  });
};

function getPlot(id) {
  d3.json(belly_data).then((data)=> {
           var data = data.samples;

      var id_data  = data.filter(sampleID => sampleID.id == id);
          
      var id_names = []     

    function appendIDs(otus) {
        var d = []
        for (var i = 0; i < otus.length; i++) {
          d.push(otus[i].id);};
      return d[0];              
      };
    
      function appendOtu(otus) {
        var e = []
        e_sliced = []
        for (var i = 0; i < otus.length; i++) {
          e.push(otus[i].otu_ids);};

        for (var i = 0; i < e.length; i++) {
          e_sliced.push(e[i].slice(0, 10).reverse());}; 

      return e_sliced[0];              
      };
     

      function appendValues(otus) {
        var f = []
        f_sliced = []
        for (var i = 0; i < otus.length; i++) {
          f.push(otus[i].sample_values);};

        for (var i = 0; i < f.length; i++) {
          f_sliced.push(f[i].slice(0, 10).reverse());};   
      return f_sliced[0];              
      };

      id_names = appendIDs(id_data);

      otu_list = appendOtu(id_data);

      values_list = appendValues(id_data);

      otu_string = otu_list.toString().split(",")
    
      console.log(id_names);
      console.log(otu_string);   
      console.log(values_list);

      
 //Bar Chart

 var ylabelbar = otu_string.map(otuID => `OTU ${otuID}`)


var tracebar= [{
  y: ylabelbar,
  x: values_list,
  text: otu_string,
  type: "bar",
  orientation: "h",
 }];

var barlayout = {
  title: `OTUs for ${id_names}`,
  xaxis: {title: "Count of OTU"},
  yaxis: {tickmode: "auto",tick0: 0.5,dtick: 0.75}
};

Plotly.newPlot("bar", tracebar, barlayout);

//bubble

var xlabelbubble = otu_string.map(otuID => `OTU ${otuID}`)

var bubbletrace = {
  type: "scatter",
  mode: "markers",
  x: xlabelbubble,
  y: values_list,
  marker: {
    size: values_list,
    text : xlabelbubble    
     },
     showlegend: true
};

var bubdata = [bubbletrace];
 
var bublayout = {
  title: `Count of OTUs`
};

Plotly.plot("bubble", bubdata, bublayout);
    
      });
    };

    function init() {
        var selector = d3.select("#selDataset");
     d3.json("samples.json").then((belly_data) => {
          var IDDropDown = belly_data.names;
          IDDropDown.forEach((s) => {
              selector
                  .append("option")
                  .text(s)
                  .property("value", s);
          });       
      });
  } 
  
  function optionChanged(x) {
           panelFunction(x);
           getPlot(x);
  }

  init();