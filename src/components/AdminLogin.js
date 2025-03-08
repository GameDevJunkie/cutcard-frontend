import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button, TextField, Typography, Paper, Box, CircularProgress } from '@mui/material';
import API_BASE_URL from '../api';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(`${API_BASE_URL}/api/admin/login`, { username, password });
            localStorage.setItem('token', response.data.token);
            setMessage('Login successful!');
            setTimeout(() => navigate('/admin/dashboard'), 1000);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error logging in');
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
                minHeight: 'calc(100vh - 64px)',
                bgcolor: 'background.default',
                position: 'relative',
            }}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                sx={{ zIndex: 1 }}
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
                            Admin Login
                        </Typography>
                        <form onSubmit={handleSubmit}>
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                            >
                                <TextField
                                    label="Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    fullWidth
                                    margin="normal"
                                    variant="outlined"
                                    required
                                    placeholder="Enter username"
                                    InputProps={{ sx: { borderRadius: 12 } }}
                                />
                            </motion.div>
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                            >
                                <TextField
                                    label="Password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    fullWidth
                                    margin="normal"
                                    variant="outlined"
                                    required
                                    placeholder="Enter password"
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
                                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
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

export default AdminLogin;