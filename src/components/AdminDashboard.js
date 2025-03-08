import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import QrScanner from 'qr-scanner';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Button,
    Typography,
    Paper,
    Box,
    List,
    ListItem,
    ListItemText,
    Divider,
    IconButton,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    CircularProgress,
} from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import API_BASE_URL from '../api';

const AdminDashboard = () => {
    const [customers, setCustomers] = useState([]);
    const [message, setMessage] = useState('');
    const [scanning, setScanning] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [cutsToAdd, setCutsToAdd] = useState(1);
    const [loading, setLoading] = useState(false);
    const videoRef = useRef(null);
    const qrScannerRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/admin/login');
            return;
        }

        const fetchCustomers = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${API_BASE_URL}/api/admin/customers`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCustomers(response.data);
            } catch (error) {
                setMessage('Error fetching customers');
                if (error.response?.status === 401) {
                    localStorage.removeItem('token');
                    navigate('/admin/login');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchCustomers();

        return () => {
            if (qrScannerRef.current) {
                qrScannerRef.current.stop();
                qrScannerRef.current = null;
            }
        };
    }, [navigate]);

    const handleDeductCut = async (customerId) => {
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            const response = await axios.put(
                `${API_BASE_URL}/api/admin/customers/deduct/${customerId}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setCustomers(customers.map((c) =>
                c._id === customerId ? { ...c, cutsRemaining: response.data.cutsRemaining } : c
            ));
            setMessage(`Cut deducted for ${customers.find((c) => c._id === customerId).name}`);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error deducting cut');
        } finally {
            setLoading(false);
        }
    };

    const handleAddCuts = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            const response = await axios.put(
                `${API_BASE_URL}/api/admin/customers/deduct/${selectedCustomer._id}`,
                { cuts: -cutsToAdd },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setCustomers(customers.map((c) =>
                c._id === selectedCustomer._id ? { ...c, cutsRemaining: response.data.cutsRemaining } : c
            ));
            setMessage(`Added ${cutsToAdd} cut(s) to ${selectedCustomer.name}`);
            setOpenDialog(false);
            setCutsToAdd(1);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error adding cuts');
        } finally {
            setLoading(false);
        }
    };

    const requestCameraPermission = async () => {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            setMessage('Camera API not supported. Ensure HTTPS.');
            return false;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            stream.getTracks().forEach((track) => track.stop());
            return true;
        } catch (error) {
            setMessage(error.name === 'NotAllowedError' ? 'Camera access denied. Allow permissions.' : `Error: ${error.message}`);
            return false;
        }
    };

    const startScanning = async () => {
        setScanning(true);
        setMessage('');

        const permissionGranted = await requestCameraPermission();
        if (!permissionGranted) {
            setScanning(false);
            return;
        }

        const videoElement = videoRef.current;
        if (!videoElement) {
            setMessage('No video element available.');
            setScanning(false);
            return;
        }

        qrScannerRef.current = new QrScanner(
            videoElement,
            (result) => {
                const customerId = result.data.split('/').pop();
                setScanning(false);
                qrScannerRef.current.stop();
                handleDeductCut(customerId);
            },
            {
                returnDetailedScanResult: true,
                highlightScanRegion: true,
                highlightCodeOutline: true,
            }
        );

        try {
            await qrScannerRef.current.start();
        } catch (err) {
            setMessage(`Error starting QR scanner: ${err.message}`);
            setScanning(false);
        }
    };

    const stopScanning = () => {
        if (qrScannerRef.current) {
            qrScannerRef.current.stop();
            qrScannerRef.current = null;
        }
        setScanning(false);
    };

    const openAddCutsDialog = (customer) => {
        setSelectedCustomer(customer);
        setOpenDialog(true);
    };

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, minHeight: 'calc(100vh - 64px)', bgcolor: 'background.default' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <Paper
                    elevation={6}
                    sx={{
                        p: { xs: 2, md: 4 },
                        borderRadius: 16,
                        maxWidth: 1000,
                        mx: 'auto',
                        position: 'relative',
                    }}
                >
                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                            <Typography variant="h4" color="primary" sx={{ fontWeight: 700 }}>
                                Admin Dashboard
                            </Typography>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => { localStorage.removeItem('token'); navigate('/admin/login'); }}
                                    sx={{ px: 3, py: 1.5, borderRadius: 12 }}
                                >
                                    Logout
                                </Button>
                            </motion.div>
                        </Box>

                        {loading && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                                <CircularProgress color="primary" />
                            </Box>
                        )}
                        <Typography variant="h5" color="text.primary" sx={{ mb: 3 }}>
                            Registered Customers
                        </Typography>
                        <List sx={{ bgcolor: 'background.paper', borderRadius: 12, p: 2 }}>
                            {customers.length === 0 && !loading ? (
                                <Typography textAlign="center" color="text.secondary" sx={{ py: 2 }}>
                                    No customers registered yet.
                                </Typography>
                            ) : (
                                customers.map((customer, index) => (
                                    <motion.div
                                        key={customer._id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                    >
                                        <ListItem
                                            sx={{
                                                py: 2,
                                                borderRadius: 8,
                                                '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.03)' },
                                                transition: 'background 0.3s',
                                            }}
                                            secondaryAction={
                                                <Box display="flex" gap={1}>
                                                    <Tooltip title="Deduct Cut" arrow>
                                                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                                            <IconButton
                                                                color="secondary"
                                                                onClick={() => handleDeductCut(customer._id)}
                                                                sx={{ bgcolor: 'rgba(216, 27, 96, 0.1)', borderRadius: 8 }}
                                                            >
                                                                <RemoveIcon />
                                                            </IconButton>
                                                        </motion.div>
                                                    </Tooltip>
                                                    <Tooltip title="Add Cuts" arrow>
                                                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                                            <IconButton
                                                                color="primary"
                                                                onClick={() => openAddCutsDialog(customer)}
                                                                sx={{ bgcolor: 'rgba(30, 136, 229, 0.1)', borderRadius: 8 }}
                                                            >
                                                                <AddIcon />
                                                            </IconButton>
                                                        </motion.div>
                                                    </Tooltip>
                                                </Box>
                                            }
                                        >
                                            <ListItemText
                                                primary={
                                                    <Typography variant="body1" sx={{ fontWeight: 600, color: 'primary.main' }}>
                                                        {customer.name}
                                                    </Typography>
                                                }
                                                secondary={
                                                    <Box>
                                                        <Typography component="span" variant="body2" color="text.secondary" display="block">
                                                            {customer.phoneNumber}
                                                        </Typography>
                                                        <Typography component="span" variant="body2" color="text.secondary" display="block">
                                                            Cuts Remaining: <b>{customer.cutsRemaining}</b>
                                                        </Typography>
                                                    </Box>
                                                }
                                            />
                                        </ListItem>
                                        {index < customers.length - 1 && <Divider sx={{ bgcolor: 'rgba(0, 0, 0, 0.05)' }} />}
                                    </motion.div>
                                ))
                            )}
                        </List>

                        <Typography variant="h5" color="text.primary" sx={{ mt: 4, mb: 3 }}>
                            Scan Customer QR Code
                        </Typography>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<CameraAltIcon />}
                                onClick={scanning ? stopScanning : startScanning}
                                disabled={loading || scanning}
                                sx={{ py: 1.5, px: 4, fontSize: '1.1rem', borderRadius: 12 }}
                            >
                                {scanning ? 'Stop Scanning' : 'Start Scanning'}
                            </Button>
                        </motion.div>
                        {scanning && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                                sx={{ mt: 3 }}
                            >
                                <Paper
                                    elevation={6}
                                    sx={{
                                        position: 'relative',
                                        width: '320px',
                                        mx: 'auto',
                                        borderRadius: 12,
                                        overflow: 'hidden',
                                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                                    }}
                                >
                                    <video ref={videoRef} style={{ width: '100%', display: 'block' }} />
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            border: '3px dashed #D81B60',
                                            borderRadius: 12,
                                            pointerEvents: 'none',
                                            opacity: 0.7,
                                        }}
                                    />
                                </Paper>
                            </motion.div>
                        )}
                        {message && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                            >
                                <Typography
                                    color={message.includes('deducted') || message.includes('Added') ? 'success.main' : 'error.main'}
                                    textAlign="center"
                                    sx={{ mt: 3, fontWeight: 500, py: 1, px: 2, borderRadius: 8, bgcolor: 'rgba(0, 0, 0, 0.03)' }}
                                >
                                    {message}
                                </Typography>
                            </motion.div>
                        )}
                    </Box>
                </Paper>
            </motion.div>

            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                PaperProps={{ sx: { borderRadius: 16, p: 2 } }}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle>
                    <Typography variant="h5" color="primary" sx={{ fontWeight: 600 }}>
                        Add Cuts for {selectedCustomer?.name}
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <TextField
                        label="Number of Cuts to Add"
                        type="number"
                        value={cutsToAdd}
                        onChange={(e) => setCutsToAdd(Math.max(1, parseInt(e.target.value) || 1))}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        inputProps={{ min: 1 }}
                        InputProps={{ sx: { borderRadius: 12 } }}
                        autoFocus
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="inherit" sx={{ fontWeight: 500 }}>
                        Cancel
                    </Button>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                            onClick={handleAddCuts}
                            variant="contained"
                            color="primary"
                            disabled={loading}
                            sx={{ borderRadius: 12, px: 3 }}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Add Cuts'}
                        </Button>
                    </motion.div>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AdminDashboard;