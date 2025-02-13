import axios from "axios";

export const getNewsData = async (req, res) => {
  try {
    const token = process.env.STOCK_API_KEY;
    const url = `https://finnhub.io/api/v1/news?category=general&token=${token}`;

    const response = await axios.get(url);
    return res.status(200).json({
      status: "success",
      data: response.data,
    });
  } catch (error) {
    return res.status(200).json({
      status: "fail",
    });
  }
};
