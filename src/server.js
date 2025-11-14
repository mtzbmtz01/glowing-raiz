const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Glowing Raiz Dating App API is running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} for API documentation`);
});
