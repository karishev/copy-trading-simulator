import React, { useState, useEffect } from "react";
import Title from "../Template/Title.jsx";
import LineChart from "../Template/LineChart";
import axios from "axios";
import config from "../../config/Config";

const COMPANY_NAMES = {
  'AAPL': 'Apple',
  'GOOGL': 'Google',
  'MSFT': 'Microsoft',
  'AMZN': 'Amazon',
  'META': 'Meta'
};

const Chart = () => {
  const [chartData, setChartData] = useState(undefined);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get('/api/data/random', {
          withCredentials: true
        });
        
        if (response.data.status === "success") {
          const stockData = {
            status: 'success',
            ticker: response.data.ticker,
            name: COMPANY_NAMES[response.data.ticker] || response.data.ticker,
            data: response.data.data
          };
          setChartData(stockData);
        } else {
          setError(response.data.message || 'Failed to load chart data');
        }
      } catch (err) {
        console.error('Chart data error:', err);
        setError('Failed to load chart data');
      }
    };
    getData();
  }, []);

  if (error) {
    return (
      <div style={{ minHeight: "240px", padding: "1rem" }}>
        <Title>Chart Data</Title>
        <div style={{ color: 'red' }}>{error}</div>
      </div>
    );
  }

  return (
    <React.Fragment>
      {chartData ? (
        <div style={{ maxHeight: "240px" }}>
          <Title>Explore {chartData.name}'s Stock Chart</Title>
          <LineChart
            pastDataPeriod={chartData.data}
            stockInfo={{ ticker: chartData.ticker }}
            duration={"3 years"}
          />
        </div>
      ) : (
        <div style={{ minHeight: "240px", padding: "1rem" }}>
          <Title>Loading chart data...</Title>
        </div>
      )}
    </React.Fragment>
  );
};

export default Chart;
