import React, { useEffect, useState } from "react";
import styled from "styled-components";
import OverViewComponents from "./OverviewComponents";
import TransactionComponents from "./TransactionComponents";
import Chart from 'chart.js/auto';

const Container = styled.div`
  background-color: white;
  color: #0d1d2c;
  display: flex;
  flex-direction: column;
  padding: 10px 22px;
  font-size: 18px;
  width: 360px;
  align-items: center;
  justify-content: space-between;
`;

const HomeComponent = (props) => {
    const [transactions, updateTransaction] = useState([]);
    const [expense, updateExpense] = useState(0);
    const [income, updateIncome] = useState(0);

    const calculateBalance = () => {
        let exp = 0;
        let inc = 0;
        transactions.map((payload) =>
            payload.type === "EXPENSE"
                ? (exp = exp + payload.amount)
                : (inc = inc + payload.amount),
        );
        updateExpense(exp);
        updateIncome(inc);
};    
        // Chart.js code for rendering the graph
        useEffect(() => {
            calculateBalance();
            const ctx = document.getElementById('myChart').getContext('2d');
            let myChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Expense', 'Income'],
                    datasets: [{
                        label: 'Expense Tracker',
                        data: [expense, income],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        
            // Destroy existing chart before rendering a new one
            return () => {
                myChart.destroy();
            };
        }, [transactions, expense, income]);
    

    useEffect(() => calculateBalance(), [transactions]);

    const addTransaction = (payload) => {
        const transactionArray = [...transactions];
        transactionArray.push(payload);
        updateTransaction(transactionArray);
    };

    return (
        <Container>
            <OverViewComponents
                expense={expense}
                income={income}
                addTransaction={addTransaction}
            />
            <canvas id='myChart' width="400" height="400"></canvas>
            {transactions?.length ? (
                <TransactionComponents transactions={transactions} />
            ) : 
                ""
            }
        </Container>
    );
};

export default HomeComponent;