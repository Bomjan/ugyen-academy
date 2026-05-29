require("dotenv").config();
const express      = require("express");
const cors         = require("cors");
const connectDB    = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

connectDB();

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000", credentials: true }));
app.use(express.json());

app.use("/api/auth",          require("./routes/auth"));
app.use("/api/progress",      require("./routes/progress"));
app.use("/api/attendance",    require("./routes/attendance"));
app.use("/api/announcements", require("./routes/announcements"));
app.use("/api/fees",          require("./routes/fees"));
app.use("/api/users",         require("./routes/users"));
app.use("/api/library",       require("./routes/library"));

app.get("/api/health", (_, res) => res.json({ status: "ok", timestamp: new Date() }));
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
