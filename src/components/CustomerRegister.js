import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Button, TextField, Typography, Paper, Box } from '@mui/material';
import API_BASE_URL from '../api';

const CustomerRegister = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_BASE_URL}/api/customers`, {
                phoneNumber,
                name,
            });
            setMessage('Registration successful! Check your SMS.');
            setPhoneNumber('');
            setName('');
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error registering customer');
        }
    };

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
                        position: 'relative',
                        overflow: 'hidden',
                        '&:before': {
                            content: '""',
                            position: 'absolute',
                            top: '-50%',
                            left: '-50%',
                            width: '200%',
                            height: '200%',
                            background: 'radial-gradient(circle, rgba(25, 118, 210, 0.1) 0%, transparent 70%)',
                            zIndex: 0,
                            transform: 'rotate(-20deg)',
                        },
                    }}
                >
                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                        <Typography variant="h5" color="primary" sx={{ fontWeight: 700, textAlign: 'center', mb: 3 }}>
                            Register for Cutcard
                        </Typography>
                        <form onSubmit={handleSubmit}>
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                            >
                                <TextField
                                    label="Phone Number (e.g., +4512345678)"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    fullWidth
                                    margin="normal"
                                    variant="outlined"
                                    required
                                    sx={{
                                        '& .MuiOutlinedInput-root': { borderRadius: 2 },
                                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.light' },
                                    }}
                                />
                            </motion.div>
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                            >
                                <TextField
                                    label="Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    fullWidth
                                    margin="normal"
                                    variant="outlined"
                                    required
                                    sx={{
                                        '& .MuiOutlinedInput-root': { borderRadius: 2 },
                                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.light' },
                                    }}
                                />
                            </motion.div>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                            >
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    sx={{ mt: 2, py: 1.5, fontSize: '1.1rem' }}
                                >
                                    Register
                                </Button>
                            </motion.div>
                        </form>
                        {message && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                            >
                                <Typography
                                    color={message.includes('successful') ? 'success.main' : 'error.main'}
                                    textAlign="center"
                                    sx={{ mt: 2, fontWeight: 500 }}
                                >
                                    {message}
                                </Typography>
                            </motion.div>
                        )}
                    </Box>
                </Paper>
            </motion.div>
        </Box>
    );
};

export default CustomerRegister;