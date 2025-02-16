import React, { useState, useEffect } from "react";
import {
  Typography,
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Link,
  Box,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Skeleton from "@mui/lab/Skeleton";
import Axios from "axios";
import config from "../../config/Config";

const StyledContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(8),
  paddingBottom: theme.spacing(8),
}));

const StyledCard = styled(Card)({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
});

const StyledCardMedia = styled(CardMedia)({
  paddingTop: '56.25%', // 16:9
});

const StyledCardContent = styled(CardContent)({
  flexGrow: 1,
});

const LoadingCards = ({ loading }) => {
  return (
    <div>
      <Typography gutterBottom align="center">
        {loading}
      </Typography>
      <br />
      <Grid container spacing={4}>
        {Array.from(new Array(6)).map((item, index) => (
          <Grid item key={index} xs={12} sm={6} md={4}>
            <Box key={index} width={210} marginRight={0.5}>
              <Skeleton variant="rect" width={300} height={200} />

              <Box pt={0.5}>
                <Skeleton />
                <Skeleton width="60%" />
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

const NewsCards = ({ cards }) => {
  return (
    <Grid container spacing={4}>
      {cards.map((card) => (
        <Grid item key={card.id} xs={12} sm={6} md={4}>
          <StyledCard>
            <Link href={card.url} target="_blank" rel="noopener noreferrer">
              <StyledCardMedia
                image={card.image}
                title={card.headline}
              />
            </Link>
            <StyledCardContent>
              <Typography gutterBottom variant="h6" component="h4">
                {card.headline}
              </Typography>
            </StyledCardContent>
          </StyledCard>
        </Grid>
      ))}
    </Grid>
  );
};

const News = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState("Loading...");

  useEffect(() => {
    const getCards = async () => {
      const url = config.base_url + "/api/news";
      const response = await Axios.get(url);
      if (response.data.status === "success" && response.data.data.length > 0) {
        const newsCards = response.data.data.slice(0, 9);
        setCards(newsCards);
      } else {
        setLoading(
          "Sorry, we couldn't load any articles from our provider. Please try again later!"
        );
      }
    };

    getCards();
  }, []);

  return (
    <StyledContainer>
      {cards.length === 0 ? (
        <LoadingCards loading={loading} />
      ) : (
        <NewsCards cards={cards} />
      )}
    </StyledContainer>
  );
};

export default News;
