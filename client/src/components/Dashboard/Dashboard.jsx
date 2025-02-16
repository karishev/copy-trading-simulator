import React from "react";
import styles from "../Template/PageTemplate.module.css";
import clsx from "clsx";
import { styled } from "@mui/material/styles";
import { Box, Container, Grid, Paper } from "@mui/material";
import Chart from "./Chart";
import Balance from "./Balance";
import Purchases from "./Purchases";
import Copyright from "../Template/Copyright";

const StyledPaper = styled(Paper)(({ theme }) => ({
  paper: {
    padding: theme.spacing?.(2) ?? 16,
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
}));

const Dashboard = ({ purchasedStocks }) => {
  const fixedHeightStyle = {
    height: 350
  };

  return (
    <Container maxWidth="lg" className={styles.container}>
      <Grid container spacing={3}>
        {/* Chart */}
        <Grid item xs={12} md={8} lg={9}>
          <StyledPaper sx={fixedHeightStyle}>
            <Chart />
          </StyledPaper>
        </Grid>
        {/* Balance */}
        <Grid item xs={12} md={4} lg={3}>
          <StyledPaper sx={fixedHeightStyle}>
            <Balance purchasedStocks={purchasedStocks} />
          </StyledPaper>
        </Grid>
        {/* Recent Purchases */}
        <Grid item xs={12}>
          <StyledPaper>
            <Purchases purchasedStocks={purchasedStocks} />
          </StyledPaper>
        </Grid>
      </Grid>
      <Box pt={4}>
        <Copyright />
      </Box>
    </Container>
  );
};

export default Dashboard;
