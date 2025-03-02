const express = require("express");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
app.use(express.json());

app.use("/api", require("./routes/authRoutes"));
app.use("/api", require("./routes/patientRoutes"));
app.use("/api", require("./routes/adminRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
