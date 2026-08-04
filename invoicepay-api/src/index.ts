import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from "compression"
import morgan from 'morgan'
import authRoutes from './controller/auth.controller'
const app  =  express()

app.use(helmet())
app.use(express.json())
app.use(cors())
app.use(compression()); 
app.use(morgan('dev'))

// Routes
app.use("/api/auth", authRoutes);

// Health Check
app.get("/health", (_, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
  });
});


export default app;