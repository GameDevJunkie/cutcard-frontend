import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion'; // Correct import
import { Button, TextField, Typography, Paper, Box, CircularProgress } from '@mui/material';
import API_BASE_URL from '../api';

const CustomerRegister = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(`${API_BASE_URL}/api/customers`, { phoneNumber, name });
            setMessage('Registration successful! Check your SMS.');
            setPhoneNumber('');
            setName('');
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error registering customer');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: 'calc(100vh - 64px)', // Adjust for header
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
                            Join Cutcard
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
                                    placeholder="+4512345678"
                                    InputProps={{ sx: { borderRadius: 12 } }}
                                />
                            </motion.div>
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                            >
                                <TextField
                                    label="Full Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    fullWidth
                                    margin="normal"
                                    variant="outlined"
                                    required
                                    placeholder="John Doe"
                                    InputProps={{ sx: { borderRadius: 12 } }}
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
                                    disabled={loading}
                                    sx={{ mt: 2, py: 1.5, fontSize: '1.1rem', position: 'relative' }}
                                >
                                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Register'}
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