const express = require("express");
const http = require("http"); // Thêm module HTTP để chạy server
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// Import routes
 const authRoutes = require("./route/authRoute");
const userRoute = require("./route/userRoute");
const companyRoute = require("./route/companyRoute");
const folderRoute = require("./route/folderRoute");
const userFolderRoute = require("./route/userFolderRoute");
const departmentRoute = require("./route/departmentRoute");
const userDepartmentRoute = require("./route/userDepartmentRoute");
const notificationRoute = require("./route/notificationRoute");
const approvalRequestRoute = require("./route/approvalRequestRoute");
const ApprovalSessionRoute = require("./route/ApprovalSessionRoute");
const LogRoute = require("./route/LogRoute");

const sequelize = require("./lib/dbConfig");
const { initializeSocket } = require("./lib/socket")

const app = express();
const server = http.createServer(app); // Tạo server HTTP

// Khởi tạo Socket.IO
initializeSocket(server);

// Lưu danh sách user đang online
const onlineUsers = new Map();

// Middleware
app.use(express.json());
app.use(cors({
  origin: "*",
}));
app.use(morgan("common"));
app.use(cookieParser());

// API Routes
app.use("/api/user", userRoute);
 app.use("/api/auth", authRoutes);

app.use("/api/company", companyRoute);

app.use("/api/department", departmentRoute);
app.use("/api/userDepartment", userDepartmentRoute);

app.use("/api/folder", folderRoute);
app.use("/api/userfolder", userFolderRoute);


app.use("/api/notification",notificationRoute);

app.use("/api/request",approvalRequestRoute);
app.use("/api/session",ApprovalSessionRoute);
app.use("/api/log",LogRoute);

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Database đã kết nối và đồng bộ!");
    server.listen(3000, () => {
      console.log(" Server đang chạy tại http://localhost:3000");
    });
  })
  .catch((err) => console.error(" Lỗi kết nối DB:", err));

