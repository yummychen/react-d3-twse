import { useEffect } from "react";
import * as d3 from "d3";

import useChartDimensions from "../hooks/useChartDimensions";

const marginTop = 30;
const marginBottom = 100;
const marginLeft = 80;
const marginRight = 50;
const oneMillion = 1_000_000;

const BarChart = ({ height, data }) => {
  const [ref, dms] = useChartDimensions({
    marginTop,
    marginBottom,
    marginLeft,
    marginRight,
  });
  const width = dms.width;
  const chartBottomY = height - marginBottom;
  const svg = d3.select(".viz");

  // Create the horizontal scale and its axis generator.
  const xScale = d3
    .scaleBand()
    .domain(data.map((d) => d.year))
    .range([marginLeft, width - marginRight])
    .padding(0.5);

  const xAxis = d3.axisBottom(xScale).tickSizeOuter(0);

  // Create the vertical scale and its axis generator.
  const yScale1 = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.eps)])
    .nice()
    .range([chartBottomY, marginTop]);

  const yScale2 = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.revenue)])
    .nice()
    .range([chartBottomY, marginTop]);

  const yAxis1 = d3.axisLeft(yScale1);
  const yAxis2 = d3.axisRight(yScale2);

  // 開始建立長條圖
  const barChart = svg.selectAll("rect").data(data);
  // 加上漸增動畫
  // 注意：如果要加動畫，事件要分開寫
  barChart
    .join("rect")
    .transition()
    .duration(1000)
    .attr("x", (d) => xScale(d.year))
    .attr("y", (d) => yScale1(d.eps))
    .attr("width", xScale.bandwidth())
    .attr("height", (d) => chartBottomY - yScale1(d.eps))
    .attr("fill", "#6baed6");

  // 加上滑鼠事件
  barChart
    .attr("cursor", "pointer")
    .on("mouseover", handleMouseOver)
    .on("mouseleave", handleMouseLeave);

  //line1
  const lineChart1 = d3
    .line()
    .x((d) => xScale(d.year) + xScale.bandwidth() / 2)
    .y((d) => yScale2(d.revenue));

  svg
    .selectAll(".line1")
    .data(data)
    .join("path")
    .transition()
    .attr("d", lineChart1(data))
    .attr("class", "line1")
    .attr("fill", "none")
    .attr("stroke", "red")
    .attr("strokeWidth", 1.5);

  //circle1
  const circle1 = svg.selectAll(".circle1").data(data).join("circle");

  circle1
    .transition()
    .attr("cx", (d) => xScale(d.year) + xScale.bandwidth() / 2)
    .attr("cy", (d) => yScale2(d.revenue))
    .attr("r", 5)
    .attr("class", "circle1")
    .attr("fill", "white")
    .attr("stroke", "red")
    .attr("strokeWidth", 2);

  //line2
  const lineChart2 = d3
    .line()
    .x((d) => xScale(d.year) + xScale.bandwidth() / 2)
    .y((d) => yScale2(d.profit));

  svg
    .selectAll(".line2")
    .data(data)
    .join("path")
    .transition()
    .attr("d", lineChart2(data))
    .attr("class", "line2")
    .attr("fill", "none")
    .attr("stroke", "green")
    .attr("strokeWidth", 1.5);

  //circle2
  const circle2 = svg.selectAll(".circle2").data(data).join("circle");

  circle2
    .transition()
    .attr("cx", (d) => xScale(d.year) + xScale.bandwidth() / 2)
    .attr("cy", (d) => yScale2(d.profit))
    .attr("r", 5)
    .attr("class", "circle2")
    .attr("fill", "white")
    .attr("stroke", "green")
    .attr("strokeWidth", 2);

  //line3
  const lineChart3 = d3
    .line()
    .x((d) => xScale(d.year) + xScale.bandwidth() / 2)
    .y((d) => yScale2(d.net_profit));

  svg
    .selectAll(".line3")
    .data(data)
    .join("path")
    .transition()
    .attr("d", lineChart3(data))
    .attr("class", "line3")
    .attr("fill", "none")
    .attr("stroke", "black")
    .attr("strokeWidth", 1.5);

  //circle3
  const circle3 = svg.selectAll(".circle3").data(data).join("circle");

  circle3
    .transition()
    .attr("cx", (d) => xScale(d.year) + xScale.bandwidth() / 2)
    .attr("cy", (d) => yScale2(d.net_profit))
    .attr("r", 5)
    .attr("class", "circle3")
    .attr("fill", "white")
    .attr("stroke", "black")
    .attr("strokeWidth", 2);

  function handleMouseOver(e, i) {
    d3.select(e.target).attr("fill", "#f68b47");
    //alert(e.target.__data__.year);
    // 加上文字標籤
    svg
      .append("text")
      .attr("class", "barLabel")
      .attr("x", xScale(e.target.__data__.year) + xScale.bandwidth() / 2)
      .attr("y", yScale1(e.target.__data__.eps) - 5) // Adjust -5 for desired offset
      .style("text-anchor", "middle")
      .style("fill", "black")
      .style("font-size", "14px")
      .text(Number(e.target.__data__.eps.toFixed(1)).toLocaleString());
  }

  function handleMouseLeave(e, i) {
    d3.select(e.target).attr("fill", "#6baed6");

    // 移除文字標籤
    svg.select(".barLabel").remove();
  }

  useEffect(() => {
    d3.select(".x-axis")
      .call(xAxis)
      .selectAll("text")
      .attr("font-size", "14px")
      // // 調整X軸刻度文字標籤傾斜
      .attr("transform", "rotate(-45)")
      .attr("text-anchor", "end");
    d3.select(".y-axis1")
      .call(yAxis1)
      .selectAll("text")
      .attr("font-size", "14px")
      .attr("text-anchor", "end")
      .attr("fill", "blue");
    d3.select(".y-axis2")
      .call(yAxis2)
      .selectAll("text")
      .attr("font-size", "14px");
    d3.select(".y-axis-text2")
      .selectAll("text")
      .attr("font-size", "14px")
      .attr("fill", "black");
  }, [xAxis, yAxis1, yAxis2]);

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
        <g className="x-axis" transform={`translate(0,${chartBottomY})`}></g>
        <g className="y-axis1" transform={`translate(${marginLeft},0)`}>
          <g className="y-axis-text">
            <text x={0} y={marginTop - 15} text-anchor="middle">
              元
            </text>
          </g>
          <g className="y-axis-text2">
            <text
              x={width - xScale.bandwidth() / 2 - marginLeft}
              y={marginTop - 15}
              text-anchor="middle"
            >
              億元
            </text>
          </g>
        </g>
        <g
          className="y-axis2"
          transform={`translate(${
            width - xScale.bandwidth() / 2 - marginRight
          },0)`}
        ></g>
        <g className="tags" transform={`translate(0, 0)`}>
          <rect
            x={marginLeft}
            y={chartBottomY + 60}
            height={10}
            width={20}
            fill="#6baed6"
          />
          <text x={marginLeft + 70} y={chartBottomY + 70} text-anchor="middle">
            每股盈餘(元)
          </text>
        </g>
        <g className="tags" transform={`translate(130, 0)`}>
          <line
            x1={marginLeft}
            x2={marginLeft + 30}
            y1={chartBottomY + 65}
            y2={chartBottomY + 65}
            strokeWidth={3}
            stroke="red"
          />
          <circle
            r={5}
            cx={marginLeft + 15}
            cy={chartBottomY + 65}
            fill="white"
            stroke="red"
            strokeWidth="2"
          />
          <text x={marginLeft + 65} y={chartBottomY + 70} text-anchor="middle">
            營業收入
          </text>
        </g>
        <g className="tags" transform={`translate(240, 0)`}>
          <line
            x1={marginLeft}
            x2={marginLeft + 30}
            y1={chartBottomY + 65}
            y2={chartBottomY + 65}
            strokeWidth={3}
            stroke="black"
          />
          <circle
            r={5}
            cx={marginLeft + 15}
            cy={chartBottomY + 65}
            fill="white"
            stroke="black"
            strokeWidth="2"
          />
          <text x={marginLeft + 65} y={chartBottomY + 70} text-anchor="middle">
            營業淨利
          </text>
        </g>
        <g className="tags" transform={`translate(350, 0)`}>
          <line
            x1={marginLeft}
            x2={marginLeft + 30}
            y1={chartBottomY + 65}
            y2={chartBottomY + 65}
            strokeWidth={3}
            stroke="green"
          />
          <circle
            r={5}
            cx={marginLeft + 15}
            cy={chartBottomY + 65}
            fill="white"
            stroke="green"
            strokeWidth="2"
          />
          <text x={marginLeft + 65} y={chartBottomY + 70} text-anchor="middle">
            稅後淨利
          </text>
        </g>
      </svg>
    </div>
  );
};

export default BarChart;
