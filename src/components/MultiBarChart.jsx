import { useEffect } from "react";
import * as d3 from "d3";

import useChartDimensions from "../hooks/useChartDimensions";

const marginTop = 30;
const marginBottom = 100;
const marginLeft = 80;
const marginRight = 50;
const oneThousand = 1_000;

const MultiBarChart = ({ height, data }) => {
  const [ref, dms] = useChartDimensions({
    marginTop,
    marginBottom,
    marginLeft,
    marginRight,
  });
  const width = dms.width;
  const chartBottomY = height - marginBottom;

  // 設定要給x軸用的scale和axis.
  const xData = data.map((d) => d.year);
  const xScale1 = d3
    .scaleBand()
    .domain(xData)
    .range([marginLeft, width - marginRight])
    .padding(0.5);

  const xAxis1 = d3.axisBottom(xScale1).tickSizeOuter(0);

  // 設定要給y軸用的scale和axis.
  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.assets / 1000)])
    .nice()
    .range([chartBottomY, marginTop]);

  const yAxis = d3.axisLeft(yScale);

  useEffect(() => {
    d3.select(".x-axis1")
      .call(xAxis1)
      .selectAll("text")
      .attr("font-size", "14px")
      // Rotate the labels to make them easier to read.
      .attr("transform", "rotate(-45)")
      .attr("text-anchor", "end");
    d3.select(".y-axis")
      .call(yAxis)
      .selectAll("text")
      .attr("font-size", "14px")
      .attr("text-anchor", "end")
      .attr("fill", "blue");
  }, [xAxis1, yAxis]);

  return (
    <div
      ref={ref}
      style={{
        height,
      }}
      className="container"
    >
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="viz"
      >
        <g className="x-axis1" transform={`translate(0,${chartBottomY})`}></g>
        <g className="y-axis" transform={`translate(${marginLeft},0)`}>
          <g className="y-axis-text">
            <text x={0} y={marginTop - 15} text-anchor="middle">
              仟元
            </text>
          </g>
        </g>
        <g className="tags" transform={`translate(0, 0)`}>
          <rect
            x={marginLeft}
            y={chartBottomY + 60}
            height={10}
            width={20}
            fill="#6baed6"
          />
          <text x={marginLeft + 40} y={chartBottomY + 70} text-anchor="middle">
            資產
          </text>
        </g>
        <g className="tags" transform={`translate(0, 0)`}>
          <rect
            x={marginLeft + 70}
            y={chartBottomY + 60}
            height={10}
            width={20}
            fill="red"
          />
          <text x={marginLeft + 110} y={chartBottomY + 70} text-anchor="middle">
            負債
          </text>
        </g>
        <g className="tags" transform={`translate(0, 0)`}>
          <rect
            x={marginLeft + 140}
            y={chartBottomY + 60}
            height={10}
            width={20}
            fill="green"
          />
          <text x={marginLeft + 180} y={chartBottomY + 70} text-anchor="middle">
            權益
          </text>
        </g>
        <g className="tags" transform={`translate(210, 0)`}>
          <line
            x1={marginLeft}
            x2={marginLeft + 30}
            y1={chartBottomY + 65}
            y2={chartBottomY + 65}
            strokeWidth={3}
            stroke="orange"
          />
          <circle
            r={5}
            cx={marginLeft + 15}
            cy={chartBottomY + 65}
            fill="white"
            stroke="orange"
            strokeWidth="2"
          />
          <text x={marginLeft + 65} y={chartBottomY + 70} text-anchor="middle">
            每股淨值
          </text>
        </g>
      </svg>
    </div>
  );
};

export default MultiBarChart;
