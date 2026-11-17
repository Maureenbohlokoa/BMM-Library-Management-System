
import api from './api';

const transactionService = {
    async getTransactions(token) {
        return api.request('/transactions', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    },

    async stockIn(transactionData, token) {
        return api.request('/transactions/stock-in', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(transactionData)
        });
    },

    async borrowBook(transactionData, token) {
        return api.request('/transactions/borrow', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(transactionData)
        });
    },

    async returnBook(transactionData, token) {
        return api.request('/transactions/return', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(transactionData)
        });
    }
};

export default transactionService;
