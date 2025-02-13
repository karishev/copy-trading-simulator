import express from "express";
import { getStockMetaData, getStockInfo, getStockHistoricData, getRandomStockData } from "../controllers/dataController.js";
import axios from 'axios';

const router = express.Router();

router.route("/prices/:ticker").get(getStockInfo);
router.route("/prices/:ticker/full").get(getStockHistoricData);
router.route("/random").get(async (req, res) => {
  try {
    // List of popular stocks to randomly choose from
    const stocks = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'META'];
    const randomStock = stocks[Math.floor(Math.random() * stocks.length)];
    
    const url = `https://api.tiingo.com/tiingo/daily/${randomStock}/prices?startDate=2020-01-01`;
    console.log('Requesting URL:', url);
    console.log('Using API Key:', process.env.TIINGO_API_KEY);

    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${process.env.TIINGO_API_KEY}`
      }
    });

    console.log('Tiingo API Response:', response.status, response.statusText);
    
    if (!response.data || !Array.isArray(response.data)) {
      throw new Error('Invalid data format received from Tiingo API');
    }

    // Format the data for the client
    const stockData = {
      status: 'success',
      ticker: randomStock,
      name: randomStock,
      data: response.data
    };

    res.json(stockData);
  } catch (error) {
    console.error('Random stock data error:', error);
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    
    res.json({
      status: 'fail',
      message: 'Failed to fetch stock data: ' + (error.response?.data?.detail || error.message)
    });
  }
});

export default router;
