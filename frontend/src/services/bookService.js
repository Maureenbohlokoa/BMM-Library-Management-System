
import api from './api';

const bookService = {
    async getBooks(token) {
        return api.request('/books', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    },

    async getBook(id, token) {
        return api.request(`/books/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    },

    async addBook(bookData, token) {
        return api.request('/books', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(bookData)
        });
    },

    async updateBook(id, bookData, token) {
        return api.request(`/books/${id}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(bookData)
        });
    },

    async deleteBook(id, token) {
        return api.request(`/books/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    }
};

export default bookService;
