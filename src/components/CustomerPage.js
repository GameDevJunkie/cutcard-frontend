import React, { useState, useEffect } from 'react';
import axios from 'axios';
import QRCode from 'react-qr-code';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Typography, Paper, Box, CircularProgress } from '@mui/material';
import API_BASE_URL from '../api';

const CustomerPage = () => {
    const { customerId } = useParams();
    const [customer, setCustomer] = useState(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCustomer = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/customers/${customerId}`);
                setCustomer(response.data);
            } catch (error) {
                setMessage('Error fetching customer data');
            } finally {
                setLoading(false);
            }
        };
        fetchCustomer();
    }, [customerId]);

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <CircularProgress color="primary" />
        </Box>
    );

    if (!customer) return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 64px)' }}
        >
            <Typography variant="h6" color="error.main">
                Customer not found.
            </Typography>
        </motion.div>
    );

    const qrCodeLink = `${window.location.origin}/customer/${customer._id}`;

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: 'calc(100vh - 64px)',
                bgcolor: 'background.default',
                position: 'relative',
            }}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
            >
                <Paper
                    elevation={6}
                    sx={{
                        p: 4,
                        borderRadius: 16,
                        maxWidth: 450,
                        textAlign: 'center',
                        position: 'relative',
                    }}
                >
                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                        <Typography variant="h4" color="primary" sx={{ fontWeight: 700, mb: 3 }}>
                            Welcome, {customer.name}!
                        </Typography>
                        <Typography color="text.secondary" sx={{ mb: 1, fontWeight: 400 }}>
                            Phone: {customer.phoneNumber}
                        </Typography>
                        <Typography color="text.secondary" sx={{ mb: 3, fontWeight: 400 }}>
                            Cuts Remaining: <b>{customer.cutsRemaining}</b>
                        </Typography>
                        <Typography variant="h6" color="text.primary" sx={{ mb: 2 }}>
                            Your Cutcard QR Code
                        </Typography>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            whileHover={{ scale: 1.05 }}
                        >
                            <Box
                                sx={{
                                    p: 2,
                                    bgcolor: 'white',
                                    borderRadius: 12,
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                    display: 'inline-block',
                                }}
                            >
                                <QRCode value={qrCodeLink} size={220} />
                            </Box>
                        </motion.div>
                        {message && (
                            <Typography color="error.main" sx={{ mt: 2, fontWeight: 500, py: 1, px: 2, borderRadius: 8, bgcolor: 'rgba(0, 0, 0, 0.03)' }}>
                                {message}
                            </Typography>
                        )}
                    </Box>
                </Paper>
            </motion.div>
        </Box>
    );
};

export default CustomerPage;