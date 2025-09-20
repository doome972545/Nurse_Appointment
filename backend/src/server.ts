import express from "express";
import dotenv from "dotenv";
import cors from "cors"; // ✅ เพิ่ม cors
import authRouter from "./routes/auth.routes";
import test from "./routes/test.routes";
import shift from "./routes/shift.routes";
import leave from "./routes/leave-request.routes";

dotenv.config(); // โหลด environment variables จาก .env
const app = express();
const port = 3000;
app.use(
  cors({
    origin: "http://localhost:5173", // URL ของ React dev server
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true, // ถ้าใช้ cookies
    exposedHeaders: ["Authorization"], // ✅ ต้องใส่ตรงนี้
  })
);
app.use(express.json());

const API_VERSION = process.env.API_VERSION || "/api/v1";

app.use(API_VERSION, authRouter);
app.use(API_VERSION, test);
app.use(API_VERSION, shift);
app.use(API_VERSION, leave);

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
