
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Catalogue from './pages/Catalogue';
import MemberDashboard from './pages/MemberDashboard';
import AdminDashboard from './pages/AdminDashboard';
import BookManagement from './pages/BookManagement';
import MemberManagement from './pages/MemberManagement';
import TransactionManagement from './pages/TransactionManagement';
import Navbar from './components/Navbar';
import FeaturedBooks from './components/FeaturedBooks';
import LibraryStats from './components/LibraryStats';
import About from './components/About';
import Footer from './components/Footer';
import './App.css';

function HomePage() {
    return (
        <>
            <Navbar />
            <Home />
            <FeaturedBooks />
            <LibraryStats />
            <About />
            <Footer />
        </>
    );
}

function RegisterPage() {
    return (
        <>
            <Navbar />
            <Register />
            <Footer />
        </>
    );
}

function LoginPage() {
    return (
        <>
            <Navbar />
            <Login />
            <Footer />
        </>
    );
}

function CataloguePage() {
    return (
        <>
            <Navbar />
            <Catalogue />
            <Footer />
        </>
    );
}

function MemberDashboardPage() {
    return (
        <>
            <Navbar />
            <MemberDashboard />
            <Footer />
        </>
    );
}

function AdminDashboardPage() {
    return (
        <>
            <Navbar />
            <AdminDashboard />
            <Footer />
        </>
    );
}

function BookManagementPage() {
    return (
        <>
            <Navbar />
            <BookManagement />
            <Footer />
        </>
    );
}

function MemberManagementPage() {
    return (
        <>
            <Navbar />
            <MemberManagement />
            <Footer />
        </>
    );
}

function TransactionManagementPage() {
    return (
        <>
            <Navbar />
            <TransactionManagement />
            <Footer />
        </>
    );
}

function App() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/catalogue" element={<CataloguePage />} />
            <Route path="/member-dashboard" element={<MemberDashboardPage />} />
            <Route path="/admin-dashboard" element={<AdminDashboardPage />} />
            <Route path="/book-management" element={<BookManagementPage />} />
            <Route path="/member-management" element={<MemberManagementPage />} />
            <Route path="/transaction-management" element={<TransactionManagementPage />} />
        </Routes>
    );
}

export default App;
