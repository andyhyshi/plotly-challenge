// build function to get the metadata for demographic table
function getMeta(samples) {
  d3.json("samples.json").then((data) => {
      var mData = data.metadata;

      var idFilter = mData.filter(sampleID => sampleID.id == samples);
      var IDnumber = idFilter[0];

      var panelData = d3.select("#sample-metadata");
      panelData.html("");

      Object.entries(IDnumber).forEach(([key, value]) => {
          panelData.append("h6").text(`${key.toUpperCase()}: ${value}`);
      });
  });
};

// plot the charts
function bubbleData(samples) {
  d3.json("samples.json").then((data) => {
      var bubSample = data.samples;
      
      var idFilter = bubSample.filter(sampleID => sampleID.id == samples);
      var IDnum = idFilter[0];

      var otuids = IDnum.otu_ids;
      var otulabels = IDnum.otu_labels;
      var sampleVals = IDnum.sample_values;

      var bubbleLayout = {
          title: "Bacteria Cultures Per Sample",
          margin: { t: 0},
          hovermode: "closest",
          xaxis:  {title: "OTU ID" },
          margin: { t: 30 }
      };
      var bubbleData = [{
          x: otuids,
          y: sampleVals,
          text: otulabels,
          mode: "markers",
          marker: {
              size: sampleVals,
              color: otuids,
              colorscale: "Portland"
          }
      }];
      
      Plotly.newPlot("bubble", bubbleData, bubbleLayout);
      
      var yticks = otuids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
      var barData = [{
          y: yticks,
          x: sampleVals.slice(0, 10).reverse(),
          text: otulabels.slice(0, 10).reverse(),
          type: "bar",
          orientation: "h",
      }];
      var barLayout = {
          title: "Top 10 Bacteria Cultures Found",
          margin: {
              t: 30,
              l: 150
          }
      };
      Plotly.newPlot("bar", barData, barLayout);

  });
};

function init() {
  // grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");
  // use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
      var sampleNames = data.names;
      sampleNames.forEach((sample) => {
          selector
              .append("option")
              .text(sample)
              .property("value", sample);
      });
      var firstSample = sampleNames[0];
      bubbleData(firstSample);
      getMeta(firstSample);
  });
}

// build the function to grab new data each time a new sample is selected
function optionChanged(newSample) {
  bubbleData(newSample);
  getMeta(newSample);
}
// initialize dashboard
init();