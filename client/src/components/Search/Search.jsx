import React, { useState, useEffect, useContext } from "react";
import UserContext from "../../context/UserContext";
import { TextField, Container, Grid, Box, Card, Typography } from "@mui/material/";
import Autocomplete from "@mui/material/Autocomplete";
import { createFilterOptions } from "@mui/material/Autocomplete";
import { styled } from "@mui/material/styles";
import LineChart from "../Template/LineChart";
import BarChart from "./BarChart";
import Copyright from "../Template/Copyright";
import styles from "./Search.module.css";
import Axios from "axios";
import InfoCard from "./InfoCard";
import PriceCard from "./PriceCard";
import PurchaseCard from "./PurchaseCard";
import PurchaseModal from "./PurchaseModal";
import config from "../../config/Config";

const filter = createFilterOptions();


const StyledContainer = styled(Container)(({ theme }) => ({
  '& .addMargin': {
    marginBottom: theme.spacing(4)
  }
}));

const LineChartCard = ({ pastDataPeriod, stockInfo, duration }) => {
  return (
    <Grid
      item
      xs={12}
      sm={7}
      component={Card}
      className={styles.card}
      style={{ minHeight: "350px" }}
    >
      <LineChart
        pastDataPeriod={pastDataPeriod}
        stockInfo={stockInfo}
        duration={duration}
      />
    </Grid>
  );
};

const BarChartCard = ({ sixMonthAverages, stockInfo }) => {
  return (
    <Grid item xs={12} sm component={Card} className={styles.card}>
      <BarChart sixMonthAverages={sixMonthAverages} stockInfo={stockInfo} />
    </Grid>
  );
};

const StockCard = ({ setPurchasedStocks, purchasedStocks, currentStock }) => {
  const { userData } = useContext(UserContext);
  const [selected, setSelected] = useState(false);
  const [stockInfo, setStockInfo] = useState(undefined);
  const [sixMonthAverages, setSixMonthAverages] = useState(undefined);
  const [pastDay, setPastDay] = useState(undefined);
  const [pastMonth, setPastMonth] = useState(undefined);
  const [pastTwoYears, setPastTwoYears] = useState(undefined);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getInfo = async () => {
      try {
        const url = `${config.base_url}/api/data/prices/${currentStock.ticker}`;
        const response = await Axios.get(url);
        
        if (response.data.status === "success" && response.data.data) {
          setStockInfo({
            ...response.data.data,
            ticker: currentStock.ticker,
            name: currentStock.name
          });
        } else {
          setError(response.data.message || "Failed to load stock information");
          console.error("API Error:", response.data);
        }
      } catch (error) {
        console.error("Error fetching stock info:", error);
        setError(error.response?.data?.message || "Failed to load stock information");
      }
    };

    const getData = async () => {
      try {
        const url = `${config.base_url}/api/data/prices/${currentStock.ticker}/full`;
        const response = await Axios.get(url);
        
        if (response.data.status === "success" && 
            response.data.sixMonthAverages && 
            response.data.pastDay && 
            response.data.pastMonth && 
            response.data.pastTwoYears) {
          setSixMonthAverages(response.data.sixMonthAverages);
          setPastDay(response.data.pastDay);
          setPastMonth(response.data.pastMonth);
          setPastTwoYears(response.data.pastTwoYears);
        } else {
          setError(response.data.message || "Failed to load stock data");
          console.error("API Error:", response.data);
        }
      } catch (error) {
        console.error("Error fetching stock data:", error);
        setError(error.response?.data?.message || "Failed to load stock data");
      }
    };

    if (currentStock?.ticker) {  // Add null check for ticker
      setError(null);
      getInfo();
      getData();
    }
  }, [currentStock]);

  if (error) {
    return (
      <div className={styles.root}>
        <Typography align="center" color="error">
          {error}
        </Typography>
      </div>
    );
  }

  if (!stockInfo || !pastDay) {
    return (
      <div className={styles.root}>
        <Typography align="center">Loading stock data...</Typography>
      </div>
    );
  }

  return (
    <div className={styles.root}>
      {stockInfo && pastDay && (
        <InfoCard stockInfo={stockInfo} price={pastDay.adjClose} />
      )}
      {sixMonthAverages && pastDay && pastMonth && pastTwoYears && (
        <div>
          <Grid container spacing={3}>
            <LineChartCard
              pastDataPeriod={pastTwoYears}
              stockInfo={stockInfo}
              duration={"2 years"}
            />
            <BarChartCard
              sixMonthAverages={sixMonthAverages}
              stockInfo={stockInfo}
            />
          </Grid>
          <PriceCard pastDay={pastDay} />
          <Grid container spacing={3}>
            <PurchaseCard
              setSelected={setSelected}
              balance={userData?.user?.balance}
            />
            <LineChartCard
              pastDataPeriod={pastMonth}
              stockInfo={stockInfo}
              duration={"month"}
            />
          </Grid>
          <Box pt={4}>
            <Copyright />
          </Box>
          {selected && (
            <PurchaseModal
              stockInfo={stockInfo}
              pastDay={pastDay}
              setSelected={setSelected}
              setPurchasedStocks={setPurchasedStocks}
              purchasedStocks={purchasedStocks}
            />
          )}
        </div>
      )}
    </div>
  );
};

const Search = ({ setPurchasedStocks, purchasedStocks }) => {
  const [value, setValue] = useState(null);
  const [currentStock, setCurrentStock] = useState(null);

  const onSearchChange = (event, newValue) => {
    if (newValue && typeof newValue === 'object') {
      setValue(newValue);
      setCurrentStock(newValue);
    } else {
      setValue(null);
      setCurrentStock(null);
    }
  };

  return (
    <StyledContainer>
      <Autocomplete
        value={value}
        onChange={onSearchChange}
        filterOptions={(options, params) => {
          const filtered = filter(options, params);
          return filtered.slice(0, 4);
        }}
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        id="stock-search-bar"
        options={stocks}
        getOptionLabel={(option) => option?.name || ''}
        renderOption={(props, option) => (
          <li {...props}>{option.name}</li>
        )}
        style={{
          maxWidth: "700px",
          margin: "30px auto",
          marginBottom: "60px",
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search for a stock"
            variant="outlined"
          />
        )}
      />
      {currentStock && (
        <StockCard
          setPurchasedStocks={setPurchasedStocks}
          purchasedStocks={purchasedStocks}
          currentStock={currentStock}
        />
      )}
      <br />
      <br />
      <br />
    </StyledContainer>
  );
};

const stocks = [
  { name: "Apple", ticker: "AAPL" },
  { name: "Amazon", ticker: "AMZN" },
  { name: "Google", ticker: "GOOG" },
  { name: "Microsoft", ticker: "MSFT" },
  { name: "Walmart", ticker: "WMT" },
  { name: "Intel", ticker: "INTC" },
  { name: "American Express", ticker: "AXP" },
  { name: "Boeing", ticker: "BA" },
  { name: "Cisco", ticker: "CSCO" },
  { name: "Goldman Sachs", ticker: "GS" },
  { name: "Johson & Johnson", ticker: "JNJ" },
  { name: "Coca-Cola", ticker: "KO" },
  { name: "McDonald's", ticker: "MCD" },
  { name: "Nike", ticker: "NKE" },
  { name: "Procter & Gamble", ticker: "PG" },
  { name: "Verizon", ticker: "VZ" },
  { name: "Salesforce", ticker: "CRM" },
  { name: "Visa", ticker: "V" },
  { name: "UnitedHealth", ticker: "UNH" },
  { name: "IBM", ticker: "IBM" },
  { name: "Chevron", ticker: "CVX" },
];

export default Search;
