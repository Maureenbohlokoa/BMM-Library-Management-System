
import api from './api';

const memberService = {
    async getMembers(token) {
        return api.request('/members', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    },

    async getMember(id, token) {
        return api.request(`/members/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    },

    async updateMember(id, memberData, token) {
        return api.request(`/members/${id}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(memberData)
        });
    },

    async deleteMember(id, token) {
        return api.request(`/members/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    }
};

export default memberService;
