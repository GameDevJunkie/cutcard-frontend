import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import CustomerRegister from './components/CustomerRegister';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import CustomerPage from './components/CustomerPage';
import { Box, Typography } from '@mui/material';

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
            }}
        >
            {/* Header with Logo */}
            <Box
                sx={{
                    p: 2,
                    background: 'linear-gradient(90deg, #1E88E5 0%, #1565C0 100%)',
                    color: '#FFFFFF',
                    textAlign: 'center',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                }}
            >
                <Typography variant="h1" sx={{ fontSize: '2rem', fontWeight: 700 }}>
                    Cutcard
                </Typography>
            </Box>

            {/* Background Gradient */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'radial-gradient(circle at top left, rgba(30, 136, 229, 0.05) 0%, transparent 70%)',
                    zIndex: -1,
                }}
            />

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