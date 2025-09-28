const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors());

// Sample budget data
const myBudget = [
  { title: "Rent", budget: 1000 },
  { title: "Groceries", budget: 300 },
  { title: "Entertainment", budget: 150 },
  { title: "Utilities", budget: 200 },
  { title: "Savings", budget: 400 },
];

// Endpoint to get budget
app.get('/budget', (req, res) => {
  res.json({ myBudget });
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
