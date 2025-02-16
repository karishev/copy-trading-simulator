const dev = {
  base_url: "http://localhost:5001",
};

const prod = {
  base_url: "https://your-production-url.com", // Update when deploying
};

const config = process.env.NODE_ENV === "production" ? prod : dev;

export default config;
