import React from "react";
import * as d3 from "d3";
import timeseries from "d3-timeseries";

const Chart = ({ issues }) => {
  console.log(issues);
  const chartRef = React.useRef();
  React.useLayoutEffect(() => {
    const chart = timeseries()
      .addSerie(
        issues,
        { x: "date", y: "count" },
        { interpolate: "monotone", color: "#333" }
      )
      .width(820);
    chart(chartRef.current);
  }, [issues]);

  return <div id="chart" ref={chartRef} />;
};
export default Chart;
