const express = require("express");

const dotenv = require("dotenv");
dotenv.config();

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const filesRoutes = require("./routes/filesRoutes");
const logoutRoutes = require("./routes/logoutRoutes");

const corsMiddleware = require("./middleware/corsMiddleware");
const sessionMiddleware = require("./middleware/sessionMiddleware");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

async function main() {
  const app = express();

  app.use(express.json());
  app.use(corsMiddleware);
  app.use(sessionMiddleware);

  // Middleware to log session data
  app.use((req, res, next) => {
    console.log("Session:", req.session);
    next();
  });

  app.use("/api", userRoutes);
  app.use("/oauth2callback", authRoutes);
  app.use("/reportDashboard", filesRoutes);
  app.use("/revoke", logoutRoutes);

  // Error Handling middlewares
  app.use(notFound);
  app.use(errorHandler);

  const PORT = process.env.PORT || 5050;
  app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
  });
}
main().catch(console.error);
