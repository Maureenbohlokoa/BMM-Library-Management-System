
import { useEffect, useState } from 'react';
import { Users, Search, Pencil, Trash2, UserPlus } from 'lucide-react';
import memberService from '../services/memberService';
import authService from '../services/authService';
import '../styles/MemberManagement.css';

function MemberManagement() {
    const [members, setMembers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        membershipId: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const token = localStorage.getItem('bmmToken');

    async function fetchMembers() {
        setError('');

        try {
            if (!token) {
                throw new Error('Please log in as an administrator.');
            }

            const response = await memberService.getMembers(token);

            setMembers(response.data.map((member) => ({
                id: member.user_id,
                fullName: member.full_name,
                email: member.email,
                membershipId: member.membership_id
            })));
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchMembers();
    }, []);

    const filteredMembers = members.filter((member) =>
        `${member.fullName} ${member.email} ${member.membershipId}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    function handleChange(event) {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    }

    function resetForm() {
        setFormData({
            fullName: '',
            email: '',
            password: '',
            membershipId: ''
        });
        setEditingId(null);
        setShowForm(false);
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setError('');
        setSuccess('');

        if (!formData.fullName.trim() || !formData.email.trim()) {
            setError('Please enter the member name and email address.');
            return;
        }

        if (editingId === null && formData.password.length < 6) {
            setError('The password must contain at least 6 characters.');
            return;
        }

        setSaving(true);

        try {
            if (editingId !== null) {
                const response = await memberService.updateMember(
                    editingId,
                    {
                        full_name: formData.fullName.trim(),
                        email: formData.email.trim()
                    },
                    token
                );

                setSuccess(response.message || 'Member updated successfully.');
            } else {
                const response = await authService.register({
                    full_name: formData.fullName.trim(),
                    email: formData.email.trim(),
                    password: formData.password
                });

                setSuccess(
                    `${response.message} Membership ID: ${response.data.membership_id}`
                );
            }

            resetForm();
            await fetchMembers();
        } catch (error) {
            setError(error.message);
        } finally {
            setSaving(false);
        }
    }

    function handleEdit(member) {
        setFormData({
            fullName: member.fullName,
            email: member.email,
            password: '',
            membershipId: member.membershipId
        });

        setEditingId(member.id);
        setShowForm(true);
        setError('');
        setSuccess('');
    }

    async function handleDelete(id) {
        const confirmed = window.confirm(
            'Are you sure you want to delete this member?'
        );

        if (!confirmed) {
            return;
        }

        setError('');
        setSuccess('');

        try {
            const response = await memberService.deleteMember(id, token);
            setSuccess(response.message || 'Member deleted successfully.');
            await fetchMembers();
        } catch (error) {
            setError(error.message);
        }
    }

    return (
        <main className="member-management">
            <section className="member-management-heading">
                <div>
                    <p className="member-management-label">ADMINISTRATOR PORTAL</p>
                    <h1>Member <span>Management</span></h1>
                    <p>View and manage registered members of BMM Library.</p>
                </div>

                <button
                    className="add-member-button"
                    onClick={() => {
                        resetForm();
                        setShowForm(true);
                        setError('');
                        setSuccess('');
                    }}
                >
                    <UserPlus size={18} />
                    Add Member
                </button>
            </section>

            {error && <p role="alert">{error}</p>}
            {success && <p role="status">{success}</p>}

            {showForm && (
                <section className="member-form-section">
                    <div className="member-form-heading">
                        <h2>
                            {editingId !== null ? 'Edit Member Details' : 'Add a Member'}
                        </h2>
                        <button type="button" onClick={resetForm}>Close</button>
                    </div>

                    <form onSubmit={handleSubmit} className="member-form">
                        <div className="member-form-grid">
                            <label>
                                Full Name
                                <input
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    placeholder="Enter full name"
                                    required
                                />
                            </label>

                            <label>
                                Email Address
                                <input
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter email address"
                                    required
                                />
                            </label>

                            {editingId === null ? (
                                <label>
                                    Temporary Password
                                    <input
                                        name="password"
                                        type="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="At least 6 characters"
                                        minLength="6"
                                        required
                                    />
                                </label>
                            ) : (
                                <label>
                                    Membership ID
                                    <input
                                        name="membershipId"
                                        value={formData.membershipId}
                                        readOnly
                                    />
                                </label>
                            )}
                        </div>

                        <div className="member-form-actions">
                            <button
                                type="button"
                                className="cancel-member-button"
                                onClick={resetForm}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="save-member-button"
                                disabled={saving}
                            >
                                {saving
                                    ? 'Saving...'
                                    : editingId !== null
                                        ? 'Update Member'
                                        : 'Save Member'}
                            </button>
                        </div>
                    </form>
                </section>
            )}

            <section className="member-list-section">
                <div className="member-list-heading">
                    <div>
                        <h2>Registered Members</h2>
                        <p>{members.length} members recorded</p>
                    </div>

                    <div className="member-search">
                        <Search size={18} />
                        <input
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                            placeholder="Search members..."
                        />
                    </div>
                </div>

                <div className="member-table-wrapper">
                    <table className="member-table">
                        <thead>
                            <tr>
                                <th>Full Name</th>
                                <th>Email Address</th>
                                <th>Membership ID</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="empty-members">
                                        Loading members...
                                    </td>
                                </tr>
                            ) : filteredMembers.length > 0 ? (
                                filteredMembers.map((member) => (
                                    <tr key={member.id}>
                                        <td>{member.fullName}</td>
                                        <td>{member.email}</td>
                                        <td>
                                            <span className="membership-badge">
                                                {member.membershipId}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="member-actions">
                                                <button
                                                    type="button"
                                                    className="edit-member-button"
                                                    onClick={() => handleEdit(member)}
                                                    aria-label="Edit member"
                                                >
                                                    <Pencil size={16} />
                                                </button>

                                                <button
                                                    type="button"
                                                    className="delete-member-button"
                                                    onClick={() => handleDelete(member.id)}
                                                    aria-label="Delete member"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="empty-members">
                                        <Users size={35} />
                                        <strong>No members found</strong>
                                        <span>Registered members will appear here.</span>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </main>
    );
}

export default MemberManagement;
