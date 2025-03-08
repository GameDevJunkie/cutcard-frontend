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
            setMessage(`Cut deducted for ${customers.find(c => c._id === customerId).name}`);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error deducting cut');
        }
    };

    const handleAddCuts = async () => {
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
        }
    };

    const requestCameraPermission = async () => {
        console.log('Is secure context?', window.isSecureContext);
        console.log('navigator.mediaDevices available?', !!navigator.mediaDevices);
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            setMessage('Camera API not supported. Please ensure this page is served over HTTPS.');
            console.error('navigator.mediaDevices:', navigator.mediaDevices);
            return false;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            stream.getTracks().forEach(track => track.stop());
            console.log('Camera permission granted');
            return true;
        } catch (error) {
            console.error('Camera permission error:', error);
            if (error.name === 'NotAllowedError') {
                setMessage('Camera access denied. Please allow camera permissions in your browser settings.');
            } else if (error.name === 'NotFoundError') {
                setMessage('No camera found on this device.');
            } else {
                setMessage('Error accessing camera: ' + error.message);
            }
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

        qrScannerRef.current.start().catch((err) => {
            setMessage('Error starting QR scanner: ' + err.message);
            console.error(err);
            setScanning(false);
        });
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
        <Box sx={{ p: { xs: 2, md: 4 }, minHeight: '100vh', bgcolor: 'background.default' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <Paper
                    elevation={6}
                    sx={{
                        p: { xs: 2, md: 4 },
                        borderRadius: 4,
                        maxWidth: 900,
                        mx: 'auto',
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
                            transform: 'rotate(20deg)',
                        },
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
                                    color="error"
                                    onClick={() => { localStorage.removeItem('token'); navigate('/admin/login'); }}
                                    sx={{ px: 3, py: 1.5 }}
                                >
                                    Logout
                                </Button>
                            </motion.div>
                        </Box>

                        <Typography variant="h5" color="text.secondary" sx={{ mb: 3 }}>
                            Registered Customers
                        </Typography>
                        <List sx={{ bgcolor: 'rgba(250, 250, 250, 0.9)', borderRadius: 2, p: 2 }}>
                            {customers.length === 0 ? (
                                <Typography textAlign="center" color="text.secondary">
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
                                                borderRadius: 2,
                                                '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.03)' },
                                                transition: 'background 0.3s',
                                            }}
                                            secondaryAction={
                                                <Box display="flex" gap={1}>
                                                    <Tooltip title="Deduct Cut">
                                                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                                            <IconButton
                                                                color="secondary"
                                                                onClick={() => handleDeductCut(customer._id)}
                                                                sx={{ bgcolor: 'rgba(255, 64, 129, 0.1)' }}
                                                            >
                                                                <RemoveIcon />
                                                            </IconButton>
                                                        </motion.div>
                                                    </Tooltip>
                                                    <Tooltip title="Add Cuts">
                                                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                                            <IconButton
                                                                color="primary"
                                                                onClick={() => openAddCutsDialog(customer)}
                                                                sx={{ bgcolor: 'rgba(25, 118, 210, 0.1)' }}
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

                        <Typography variant="h5" color="text.secondary" sx={{ mt: 4, mb: 3 }}>
                            Scan QR Code
                        </Typography>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<CameraAltIcon />}
                                onClick={scanning ? stopScanning : startScanning}
                                sx={{ py: 1.5, px: 4, fontSize: '1.1rem' }}
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
                                <Box
                                    sx={{
                                        position: 'relative',
                                        width: '300px',
                                        mx: 'auto',
                                        borderRadius: 3,
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
                                            border: '2px dashed #ff4081',
                                            borderRadius: 3,
                                            pointerEvents: 'none',
                                            opacity: 0.7,
                                        }}
                                    />
                                </Box>
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
                                    sx={{ mt: 3, fontWeight: 500 }}
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
                PaperProps={{ sx: { borderRadius: 3, p: 2 } }}
            >
                <DialogTitle>
                    <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
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
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
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
                            sx={{ borderRadius: 2, px: 3 }}
                        >
                            Add Cuts
                        </Button>
                    </motion.div>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AdminDashboard;