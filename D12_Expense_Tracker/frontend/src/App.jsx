import { useEffect, useState } from "react";
import axios from "axios";
import { Container, TextField, Button, List, ListItem, Typography, Card, CardContent, MenuItem, Select, InputLabel, FormControl, Box, Grid } from "@mui/material";
import { styled } from '@mui/system';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

import "./App.css";

const API_URL = "http://localhost:3000/transactions";

// Styled components for cleaner design
const StyledContainer = styled(Container)`
  margin-top: 2rem;
  padding: 2rem;
  background-color: #f9f9f9;
  border-radius: 10px;
`;

const TitleTypography = styled(Typography)`
  font-family: 'Roboto', sans-serif;
  font-weight: 600;
  color: #333;
  margin-bottom: 2rem;
`;

const StyledForm = styled('form')`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 2rem;
`;

const StyledTextField = styled(TextField)`
  margin-top: 10px;
`;

const StyledButton = styled(Button)`
  background-color: #3f51b5;
  &:hover {
    background-color: #2c387e;
  }
`;

const StyledCard = styled(Card)`
  width: 100%;
  background-color: #fff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  margin-top: 10px;
  border-radius: 8px;
`;

const StyledCardContent = styled(CardContent)`
  padding: 16px;
`;

const StyledListItem = styled(ListItem)`
  padding: 0;
`;

const BalanceContainer = styled(Box)`
  margin-bottom: 20px;
`;

const BalanceCard = styled(Card)`
  background-color: #4caf50;
  color: white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const IncomeCard = styled(Card)`
  background-color: #3f51b5;
  color: white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const ExpenseCard = styled(Card)`
  background-color: #f44336;
  color: white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const ScrollableListContainer = styled(Box)`
  max-height: 300px; // Adjust based on your desired list height
  overflow-y: auto;  // Enables scrolling when the content overflows
  margin-top: 20px;
`;

const App = () => {
  const [transactions, setTransactions] = useState([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [transactionType, setTransactionType] = useState("income"); // "income" or "expense"
  const [transactionDate, setTransactionDate] = useState(""); // Store selected date
  const [editingTransaction, setEditingTransaction] = useState(null); // Track transaction being edited

  // Fetch transactions from the backend
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(API_URL);
        setTransactions(response.data);
        localStorage.setItem("transactions", JSON.stringify(response.data)); // Store locally
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, []);

  // Calculate the total income
  const calculateIncome = () => {
    return transactions
      .filter((tx) => tx.type === "income")
      .reduce((sum, tx) => sum + parseFloat(tx.amount), 0)
      .toFixed(2);
  };

  // Calculate the total expenses
  const calculateExpense = () => {
    return transactions
      .filter((tx) => tx.type === "expense")
      .reduce((sum, tx) => sum + parseFloat(tx.amount), 0)
      .toFixed(2);
  };

  // Calculate the current balance
  const calculateBalance = () => {
    return (parseFloat(calculateIncome()) - parseFloat(calculateExpense())).toFixed(2);
  };

  // Handle form submission for add or update
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !amount || !transactionType || !transactionDate) return alert("Please fill out all fields!");

    try {
      if (editingTransaction) {
        // Update existing transaction
        const updatedTransaction = {
          title,
          amount,
          type: transactionType,
          date: transactionDate,
        };

        await axios.put(`${API_URL}/${editingTransaction._id}`, updatedTransaction);
        const updatedTransactions = transactions.map(tx =>
          tx._id === editingTransaction._id ? { ...tx, ...updatedTransaction } : tx
        );
        setTransactions(updatedTransactions);
        localStorage.setItem("transactions", JSON.stringify(updatedTransactions));
      } else {
        // Add new transaction
        const response = await axios.post(API_URL, { title, amount, type: transactionType, date: transactionDate });
        const updatedTransactions = [...transactions, response.data];
        setTransactions(updatedTransactions);
        localStorage.setItem("transactions", JSON.stringify(updatedTransactions));
      }

      // Reset form and state
      setTitle("");
      setAmount("");
      setTransactionType("income");
      setTransactionDate("");
      setEditingTransaction(null); // Reset editing state
    } catch (error) {
      console.error("Error submitting transaction:", error);
    }
  };

  // Handle delete of a transaction
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      const updatedTransactions = transactions.filter(tx => tx._id !== id);
      setTransactions(updatedTransactions);
      localStorage.setItem("transactions", JSON.stringify(updatedTransactions));
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  // Handle edit (fill in the form)
  const handleEdit = (tx) => {
    setTitle(tx.title);
    setAmount(tx.amount);
    setTransactionType(tx.type);
    setTransactionDate(tx.date);
    setEditingTransaction(tx); // Mark as editing
  };

  return (
    <StyledContainer maxWidth="md">
      <TitleTypography variant="h4" align="center" gutterBottom>
        Expense Tracker
      </TitleTypography>

      {/* Balance, Income, Expense in one row */}
      <BalanceContainer>
        <Grid container spacing={3}>
          {/* Balance Card */}
          <Grid item xs={12} sm={4}>
            <BalanceCard>
              <AccountBalanceIcon sx={{ fontSize: 45, marginRight: 2 }} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Balance
                </Typography>
                <Typography variant="h8">${calculateBalance()}</Typography>
              </Box>
            </BalanceCard>
          </Grid>

          {/* Income Card */}
          <Grid item xs={12} sm={4}>
            <IncomeCard>
              <AttachMoneyIcon sx={{ fontSize: 50 }} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Income
                </Typography>
                <Typography variant="h8">${calculateIncome()}</Typography>
              </Box>
            </IncomeCard>
          </Grid>

          {/* Expense Card */}
          <Grid item xs={12} sm={4}>
            <ExpenseCard>
              <ShoppingCartIcon sx={{ fontSize: 45, marginRight: 2 }} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Expense
                </Typography>
                <Typography variant="h8">${calculateExpense()}</Typography>
              </Box>
            </ExpenseCard>
          </Grid>
        </Grid>
      </BalanceContainer>

      <StyledForm onSubmit={handleSubmit}>
        <StyledTextField
          label="Title"
          variant="outlined"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          required
        />
        <StyledTextField
          label="Amount"
          variant="outlined"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          fullWidth
          required
        />
        <FormControl fullWidth required>
          <InputLabel>Transaction Type</InputLabel>
          <Select
            value={transactionType}
            onChange={(e) => setTransactionType(e.target.value)}
            label="Transaction Type"
          >
            <MenuItem value="income">Income</MenuItem>
            <MenuItem value="expense">Expense</MenuItem>
          </Select>
        </FormControl>
        <StyledTextField
          label="Transaction Date"
          variant="outlined"
          type="date"
          value={transactionDate}
          onChange={(e) => setTransactionDate(e.target.value)}
          fullWidth
          required
          InputLabelProps={{
            shrink: true,
          }}
        />
        <StyledButton variant="contained" type="submit">
          {editingTransaction ? "Update Transaction" : "Add Transaction"}
        </StyledButton>
      </StyledForm>

      <ScrollableListContainer>
        <List >
          {transactions.sort((a, b) => new Date(a.date) - new Date(b.date)).map((tx) => (
            <StyledListItem key={tx._id}>
              <StyledCard sx={{ borderLeft: `5px solid ${tx.type === "income" ? "#4caf50" : "#f44336"}` }}>
                <StyledCardContent>
                  <Typography variant="body1" sx={{ fontWeight: '500' }}>
                    {tx.title} - <strong>${tx.amount}</strong>
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {tx.type ? (tx.type.charAt(0).toUpperCase() + tx.type.slice(1)) : 'Unknown'}
                  </Typography>&nbsp; - &nbsp;
                  <Typography variant="caption" color="textSecondary">
                    {new Date(tx.date).toLocaleDateString()}
                  </Typography>

                  <Box sx={{ marginTop: 2 }}>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleDelete(tx._id)}
                      sx={{ paddingLeft: 2 }}
                      startIcon={<DeleteIcon sx={{ marginRight: 1 }} />}
                    >
                      Delete
                    </Button>

                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleEdit(tx)}
                      sx={{ marginLeft: 2 }}
                      startIcon={<EditIcon sx={{ marginRight: 1 }} />}
                    >
                      Edit
                    </Button>
                  </Box>
                </StyledCardContent>
              </StyledCard>
            </StyledListItem>
          ))}
        </List>
      </ScrollableListContainer>
    </StyledContainer>
  );
};

export default App;
