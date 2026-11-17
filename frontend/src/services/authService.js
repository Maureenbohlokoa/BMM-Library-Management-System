
import api from './api';

const authService = {
    async register(memberData) {
        return api.request('/members/register', {
            method: 'POST',
            body: JSON.stringify(memberData)
        });
    },

    async login(credentials) {
        return api.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        });
    }
};

export default authService;
