const userRoutes = require('./routes/userroute');
const transactionRoutes = require('./routes/transictionroute');
    const qrCodeRoutes = require('./routes/qrcoderoute');

// Routes
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/qrcode', qrCodeRoutes); 