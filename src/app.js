const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require("./routes/auth.routes.js");
const taskRoutes = require("./routes/task.routes.js");

const app = express();
app.use(express.json()) //middlewear to read json
app.use(cookieParser()) //middlewear to handle cookies

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);


module.exports = app;