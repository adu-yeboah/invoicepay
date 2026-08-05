import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from "compression"
import morgan from 'morgan'
import authRoutes from './routes/auth.route.js'
import clientRoutes from './routes/client.route.js'
import invoiceRoutes, { publicRouter } from './routes/invoice.route.js'

const app  =  express()

app.use(helmet())
app.use(express.json())
app.use(cors())
app.use(compression());
app.use(morgan('dev'))

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/invoices", publicRouter); // Must come after to not override protected routes

// Health Check
app.get("/health", (_, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
  });
});


export default app;