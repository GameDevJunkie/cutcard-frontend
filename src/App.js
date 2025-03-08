import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import CustomerRegister from './components/CustomerRegister';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import CustomerPage from './components/CustomerPage';

function App() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            sx={{
                bgcolor: 'background.default',
                minHeight: '100vh',
                overflow: 'hidden',
                position: 'relative',
                '&:before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'radial-gradient(circle, rgba(25, 118, 210, 0.05) 0%, rgba(255, 255, 255, 0) 70%)',
                    zIndex: 0,
                },
            }}
        >
            <Routes>
                <Route path="/" element={<CustomerRegister />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/customer/:customerId" element={<CustomerPage />} />
            </Routes>
        </motion.div>
    );
}

export default App;