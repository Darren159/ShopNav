const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

const stores = require("./data/stores.json");

app.use(cors());

app.get("/", (req, res) => {
  const storeName = req.query.name;
  const store = stores.find((store) => store.name === storeName);

  if (store) {
    res.json(store);
  } else {
    res.status(404).json({ error: "Store not found" });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
