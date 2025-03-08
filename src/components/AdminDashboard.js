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
    InputAdornment,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    TableSortLabel,
} from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import SearchIcon from '@mui/icons-material/Search';
import API_BASE_URL from '../api';

const AdminDashboard = () => {
    const [customers, setCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [message, setMessage] = useState('');
    const [scanning, setScanning] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [cutsToAdd, setCutsToAdd] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('name');
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
                setFilteredCustomers(response.data);
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

    // Search Functionality
    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        const filtered = customers.filter(
            (customer) =>
                customer.name.toLowerCase().includes(term) ||
                customer.phoneNumber.toLowerCase().includes(term)
        );
        setFilteredCustomers(filtered);
        setPage(0); // Reset to first page on search
    };

    // Sorting Functionality
    const handleSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
        const sorted = [...filteredCustomers].sort((a, b) => {
            if (property === 'cutsRemaining') {
                return isAsc ? a[property] - b[property] : b[property] - a[property];
            }
            return isAsc
                ? a[property].localeCompare(b[property])
                : b[property].localeCompare(a[property]);
        });
        setFilteredCustomers(sorted);
    };

    // Pagination Functionality
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleDeductCut = async (customerId) => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.put(
                `${API_BASE_URL}/api/admin/customers/deduct/${customerId}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setCustomers((prev) =>
                prev.map((c) =>
                    c._id === customerId ? { ...c, cutsRemaining: response.data.cutsRemaining } : c
                )
            );
            setFilteredCustomers((prev) =>
                prev.map((c) =>
                    c._id === customerId ? { ...c, cutsRemaining: response.data.cutsRemaining } : c
                )
            );
            setMessage(`Cut deducted for ${customers.find((c) => c._id === customerId).name}`);
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
            setCustomers((prev) =>
                prev.map((c) =>
                    c._id === selectedCustomer._id ? { ...c, cutsRemaining: response.data.cutsRemaining } : c
                )
            );
            setFilteredCustomers((prev) =>
                prev.map((c) =>
                    c._id === selectedCustomer._id ? { ...c, cutsRemaining: response.data.cutsRemaining } : c
                )
            );
            setMessage(`Added ${cutsToAdd} cut(s) to ${selectedCustomer.name}`);
            setOpenDialog(false);
            setCutsToAdd(1);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error adding cuts');
        }
    };

    const requestCameraPermission = async () => {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            setMessage('Camera API not supported. Please ensure this page is served over HTTPS.');
            return false;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            stream.getTracks().forEach(track => track.stop());
            return true;
        } catch (error) {
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
        <Box
            sx={{
                minHeight: '100vh',
                bgcolor: 'background.default',
                position: 'relative',
                overflow: 'hidden',
                background: 'linear-gradient(135deg, #F7F8FC 30%, #E6F0FA 100%)',
                '&:before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: `
                        url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E
                        %3Cpath fill='%233A86FF' fill-opacity='0.1' d='M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'%3E%3C/path%3E%3C/svg%3E")
                    `,
                    backgroundSize: 'cover',
                    backgroundPosition: 'bottom',
                    zIndex: 0,
                    opacity: 0.4,
                },
                '&:after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: `
                        url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E
                        %3Cpath fill='%23FF6B6B' fill-opacity='0.1' d='M0,224L48,208C96,192,192,160,288,160C384,160,480,192,576,208C672,224,768,224,864,208C960,192,1056,160,1152,160C1248,160,1344,192,1392,208L1440,224L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z'%3E%3C/path%3E%3C/svg%3E")
                    `,
                    backgroundSize: 'cover',
                    backgroundPosition: 'top',
                    zIndex: 0,
                    opacity: 0.4,
                },
            }}
        >
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
            >
                <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 2, md: 4 } }}>
                    {/* Header Section */}
                    <Paper
                        elevation={6}
                        sx={{
                            p: 3,
                            mb: 4,
                            borderRadius: 4,
                            background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(245, 247, 250, 0.9) 100%)',
                            border: '1px solid rgba(58, 134, 255, 0.15)',
                            backdropFilter: 'blur(8px)',
                        }}
                    >
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography
                                variant="h4"
                                sx={{
                                    fontWeight: 700,
                                    fontFamily: "'Lora'",
                                    background: 'linear-gradient(90deg, #3A86FF, #60A5FA)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                Admin Dashboard
                            </Typography>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={() => {
                                        localStorage.removeItem('token');
                                        navigate('/admin/login');
                                    }}
                                    sx={{ px: 3, py: 1.5 }}
                                >
                                    Logout
                                </Button>
                            </motion.div>
                        </Box>
                    </Paper>

                    {/* Customer List Section */}
                    <Paper
                        elevation={6}
                        sx={{
                            p: 3,
                            mb: 4,
                            borderRadius: 4,
                            background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(245, 247, 250, 0.9) 100%)',
                            border: '1px solid rgba(58, 134, 255, 0.15)',
                            backdropFilter: 'blur(8px)',
                        }}
                    >
                        <Typography
                            variant="h5"
                            sx={{
                                fontFamily: "'Lora'",
                                fontWeight: 600,
                                mb: 2,
                                color: 'text.primary',
                            }}
                        >
                            Registered Customers
                        </Typography>

                        {/* Search Bar */}
                        <TextField
                            placeholder="Search by name or phone number..."
                            value={searchTerm}
                            onChange={handleSearch}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{ color: 'primary.main', opacity: 0.7 }} />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                mb: 3,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 12,
                                    background: 'rgba(255, 255, 255, 0.5)',
                                    transition: 'all 0.3s ease',
                                    '&:hover': { background: 'rgba(255, 255, 255, 0.7)' },
                                    '&.Mui-focused': { background: 'rgba(255, 255, 255, 0.9)' },
                                },
                            }}
                        />

                        {/* Customer Table */}
                        {filteredCustomers.length === 0 ? (
                            <Typography textAlign="center" color="text.secondary">
                                No customers found.
                            </Typography>
                        ) : (
                            <>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>
                                                    <TableSortLabel
                                                        active={orderBy === 'name'}
                                                        direction={orderBy === 'name' ? order : 'asc'}
                                                        onClick={() => handleSort('name')}
                                                    >
                                                        Name
                                                    </TableSortLabel>
                                                </TableCell>
                                                <TableCell>
                                                    <TableSortLabel
                                                        active={orderBy === 'phoneNumber'}
                                                        direction={orderBy === 'phoneNumber' ? order : 'asc'}
                                                        onClick={() => handleSort('phoneNumber')}
                                                    >
                                                        Phone Number
                                                    </TableSortLabel>
                                                </TableCell>
                                                <TableCell>
                                                    <TableSortLabel
                                                        active={orderBy === 'cutsRemaining'}
                                                        direction={orderBy === 'cutsRemaining' ? order : 'asc'}
                                                        onClick={() => handleSort('cutsRemaining')}
                                                    >
                                                        Cuts Remaining
                                                    </TableSortLabel>
                                                </TableCell>
                                                <TableCell align="right">Actions</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {filteredCustomers
                                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                .map((customer, index) => (
                                                    <motion.tr
                                                        key={customer._id}
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                                    >
                                                        <TableCell>
                                                            <Typography
                                                                variant="body1"
                                                                sx={{ fontWeight: 600, color: 'primary.main' }}
                                                            >
                                                                {customer.name}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography variant="body2" color="text.secondary">
                                                                {customer.phoneNumber}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography variant="body2" color="text.secondary">
                                                                <b>{customer.cutsRemaining}</b>
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            <Box display="flex" gap={1} justifyContent="flex-end">
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
                                                        </TableCell>
                                                    </motion.tr>
                                                ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>

                                {/* Pagination */}
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25]}
                                    component="div"
                                    count={filteredCustomers.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                    sx={{ mt: 2 }}
                                />
                            </>
                        )}
                    </Paper>

                    {/* QR Scanner Section */}
                    <Paper
                        elevation={6}
                        sx={{
                            p: 3,
                            mb: 4,
                            borderRadius: 4,
                            background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(245, 247, 250, 0.9) 100%)',
                            border: '1px solid rgba(58, 134, 255, 0.15)',
                            backdropFilter: 'blur(8px)',
                        }}
                    >
                        <Typography
                            variant="h5"
                            sx={{
                                fontFamily: "'Lora'",
                                fontWeight: 600,
                                mb: 2,
                                color: 'text.primary',
                            }}
                        >
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
                                transition={{ duration: 0.5, ease: 'easeOut' }}
                                sx={{ mt: 3 }}
                            >
                                <Box
                                    sx={{
                                        position: 'relative',
                                        width: { xs: '100%', sm: '300px' },
                                        mx: 'auto',
                                        borderRadius: 3,
                                        overflow: 'hidden',
                                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                                        border: '2px solid rgba(58, 134, 255, 0.3)',
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
                                            border: '2px dashed #FF6B6B',
                                            borderRadius: 3,
                                            pointerEvents: 'none',
                                            opacity: 0.7,
                                            animation: 'pulse 2s infinite',
                                            '@keyframes pulse': {
                                                '0%': { borderColor: '#FF6B6B', opacity: 0.7 },
                                                '50%': { borderColor: '#FFA8A8', opacity: 1 },
                                                '100%': { borderColor: '#FF6B6B', opacity: 0.7 },
                                            },
                                        }}
                                    />
                                </Box>
                            </motion.div>
                        )}
                    </Paper>

                    {/* Message Section */}
                    {message && (
                        <Paper
                            elevation={6}
                            sx={{
                                p: 2,
                                borderRadius: 4,
                                background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(245, 247, 250, 0.9) 100%)',
                                border: '1px solid rgba(58, 134, 255, 0.15)',
                                backdropFilter: 'blur(8px)',
                            }}
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                            >
                                <Typography
                                    color={
                                        message.includes('deducted') || message.includes('Added')
                                            ? 'success.main'
                                            : 'error.main'
                                    }
                                    textAlign="center"
                                    sx={{ fontWeight: 500, fontFamily: "'Poppins'" }}
                                >
                                    {message}
                                </Typography>
                            </motion.div>
                        </Paper>
                    )}
                </Box>
            </motion.div>

            {/* Add Cuts Dialog */}
            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                PaperProps={{ sx: { borderRadius: 3, p: 2 } }}
            >
                <DialogTitle>
                    <Typography
                        variant="h6"
                        sx={{
                            fontFamily: "'Lora'",
                            fontWeight: 600,
                            color: 'primary.main',
                        }}
                    >
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
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 12,
                                background: 'rgba(255, 255, 255, 0.5)',
                                transition: 'all 0.3s ease',
                                '&:hover': { background: 'rgba(255, 255, 255, 0.7)' },
                                '&.Mui-focused': { background: 'rgba(255, 255, 255, 0.9)' },
                            },
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setOpenDialog(false)}
                        color="inherit"
                        sx={{ fontWeight: 500, fontFamily: "'Poppins'" }}
                    >
                        Cancel
                    </Button>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                            onClick={handleAddCuts}
                            variant="contained"
                            color="primary"
                            sx={{ borderRadius: 12, px: 3 }}
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