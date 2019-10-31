function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  // Use d3 to select the panel with id of `#sample-metadata`

  var app_metadata = "/metadata/" + sample;

  console.log("app_metadata = ", app_metadata)

  var sampleMetadata = d3.select("#sample-metadata");
  sampleMetadata.html("")

  d3.json(app_metadata, function (data) {
    Object.entries(data).forEach(([key, value]) => {
      var row = sampleMetadata.append("div").text(`${key}: ${value}`);
    });
  })
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots

  var app_samples = "/samples/" + sample;
  console.log("app_samples = ", app_samples)

  d3.json(app_samples).then(data => {

    // Pie chart
    trace = {
      labels: data["otu_ids"].slice(0, 10),
      values: data["sample_values"].slice(0, 10),
      type: "pie"
    }

    Plotly.newPlot('pie', [trace])

    // Bubble chart  
    var trace1 = {
      x: data.otu_ids,
      y: data.sample_values,
      text: data.otu_labels,
      mode: 'markers',

      marker: {
        size: data.sample_values,
        color: data.otu_ids,
        colorscale: 'Rainbow'
      }
    };

    var layout1 = {
      title: "Belly Button Bacteria",
      height: 600,
      width: 1200,
      xaxis: { title: "OTU ID" }
    };

    Plotly.newPlot('bubble', [trace1], layout1)
  })

  // Gauge
  var appMetadata = "/metadata/" + sample;
  console.log("appMetadata = ", appMetadata)

  d3.json(appMetadata).then(metadata => {

    console.log("metadata = ", metadata["WFREQ"])

    var data = [
      {
        domain: {
          x: [0, 1], y: [0, 1]
        },
        value: metadata["WFREQ"], title: { text: "Scrubs Per Week" },
        type: "pie", mode: "gauge+number",
        gauge:
        {
          axis:
            { range: [0, 9] },
          bar: { color: "darkblue" },
          steps: [
            { range: [0, 1], color: "#E5E7E9 " },
            { range: [1, 2], color: "#BDC3C7" },
            { range: [2, 3], color: "#909497" },
            { range: [3, 4], color: "#F7DC6F" },
            { range: [4, 5], color: "#F1C40F" },
            { range: [5, 6], color: "#B7950B" },
            { range: [6, 7], color: "#2ECC71" },
            { range: [7, 8], color: "#229954" },
            { range: [8, 9], color: "#145A32" },
          ],
        }
      }

    ];

    var layout = {
      title: 'Belly Button Washing Frequency',
    };

    Plotly.newPlot('gauge', data, layout);
  })
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });


    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];

    console.log("Sample = ", firstSample)
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {

  //console.log("Sample = ", newSample)
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
