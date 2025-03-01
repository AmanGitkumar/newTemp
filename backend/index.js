const express = require('express');
const app = express();
const cors = require('cors');
const AuthRouter = require('./Routes/AuthRouter');
const ExpenseRouter = require('./Routes/ExpenseRouter');
const CategoryRouter = require("./Routes/CategoryRouter");
const IncomeRouter = require("./Routes/IncomeRouter"); // ✅ Added this line
const DashboardRouter = require("./Routes/DashboardRouter");
const ensureAuthenticated = require('./Middlewares/Auth');
const transactionRoutes = require("./Routes/TransactionRouter");
require('dotenv').config();
require('./Models/db');


const PORT = process.env.PORT || 8080;



app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.get('/ping', (req, res) => {
    res.send('PONG');
});

app.use('/auth', AuthRouter);

app.use('/expenses', ensureAuthenticated, ExpenseRouter);
app.use('/categories', CategoryRouter);
app.use('/incomes', ensureAuthenticated, IncomeRouter); // ✅ Added this line
app.use("/dashboard", DashboardRouter);
app.use("/transactions", transactionRoutes);




app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
