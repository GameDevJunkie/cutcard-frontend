import React, { useState, useEffect } from 'react';
import axios from 'axios';
import QRCode from 'react-qr-code';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Typography, Paper, Box } from '@mui/material';
import API_BASE_URL from '../api';

const CustomerPage = () => {
    const { customerId } = useParams();
    const [customer, setCustomer] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchCustomer = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/customers/${customerId}`);
                setCustomer(response.data);
            } catch (error) {
                setMessage('Error fetching customer data');
            }
        };
        fetchCustomer();
    }, [customerId]);

    if (!customer) return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}
        >
            <Typography variant="h6" color="text.secondary">
                Loading...
            </Typography>
        </motion.div>
    );

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
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
                        borderRadius: 4,
                        maxWidth: 400,
                        textAlign: 'center',
                        position: 'relative',
                        overflow: 'hidden',
                        '&:before': {
                            content: '""',
                            position: 'absolute',
                            top: '-50%',
                            left: '-50%',
                            width: '200%',
                            height: '200%',
                            background: 'radial-gradient(circle, rgba(255, 64, 129, 0.1) 0%, transparent 70%)',
                            zIndex: 0,
                            transform: 'rotate(20deg)',
                        },
                    }}
                >
                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                        <Typography variant="h5" color="primary" sx={{ fontWeight: 700, mb: 2 }}>
                            Welcome, {customer.name}!
                        </Typography>
                        <Typography color="text.secondary" sx={{ mb: 1, fontWeight: 400 }}>
                            Phone: {customer.phoneNumber}
                        </Typography>
                        <Typography color="text.secondary" sx={{ mb: 3, fontWeight: 400 }}>
                            Cuts Remaining: <b>{customer.cutsRemaining}</b>
                        </Typography>
                        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
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
                                    borderRadius: 3,
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                    display: 'inline-block',
                                }}
                            >
                                <QRCode value={`http://192.168.1.100:3000/customer/${customer._id}`} size={200} />
                            </Box>
                        </motion.div>
                        {message && (
                            <Typography color="error.main" sx={{ mt: 2, fontWeight: 500 }}>
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