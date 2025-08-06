import { useEffect, useState } from "react";
import * as d3 from "d3";

import MyLogo from "./assets/Taiwan_Stock_Exchange_Corporation_logo_(since_2023).svg";
import BarChart from "./components/BarChart";
import MultiBarChart from "./components/MultiBarChart";
import performanceData from "./data/performance_by_year.json";
import financeData from "./data/finance_by_year.json";

function App() {
  const [worldPopulation, setWorldPopulation] = useState(null);
  const [topography, setTopography] = useState(null);
  const [barChartData, setBarChartData] = useState([]);
  const [multiBarChartData, setMultiBarChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);

      let populationData = {};
      await Promise.all([
        d3.json(
          "https://res.cloudinary.com/tropicolx/raw/upload/v1/Building%20Interactive%20Data%20Visualizations%20with%20D3.js%20and%20React/world.geojson"
        ),
        d3.csv(
          "https://res.cloudinary.com/tropicolx/raw/upload/v1/Building%20Interactive%20Data%20Visualizations%20with%20D3.js%20and%20React/world_population.csv",
          (d) => {
            populationData = {
              ...populationData,
              [d.code]: +d.population,
            };
          }
        ),
      ]).then((fetchedData) => {
        const topographyData = fetchedData[0];
        setBarChartData(performanceData);
        setMultiBarChartData(financeData);
        setWorldPopulation(populationData);
        setTopography(topographyData);
      });

      setLoading(false);
    };

    getData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="dashboard">
      <div className="wrapper">
        <h1>
          <span>
            <img src={MyLogo} className="myLogo" />
          </span>
          <span className="thin">TWSE</span>
          <span className="bold">大數據儀表板</span> 財務部
        </h1>
        <main className="main">
          <div className="grid">
            <div className="bar-chart-container">
              <h2>營運績效</h2>
              <BarChart width={1280} height={450} data={barChartData} />
            </div>
            <div className="multibar-chart-container">
              <h2>財務狀況</h2>
              <MultiBarChart
                width={1280}
                height={450}
                data={multiBarChartData}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
