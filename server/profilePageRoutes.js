const db = require('./db'); // Import the database connection and queries

module.exports = (app) => {
    // Middleware to check session
    app.get('/api/customer/info', async (req, res) => {
        try {
            if (!req.session.customerUser) {
                return res.status(401).json({ success: false, error: 'NotAuthorized' });
            }

            const customer = await db.getUser(req.session.customerUser);
            if (customer) {
                return res.status(200).json({ success: true, user: customer });
            } else {
                return res.status(404).json({ success: false, error: 'CustomerNotFound' });
            }
        } catch (err) {
            console.error('Error fetching customer info:', err);
            return res.status(500).json({ success: false, error: 'ServerError' });
        }
    });

    // Route to get event tickets for a logged-in customer
    app.get('/api/customer/tickets', async (req, res) => {
        try {
            if (!req.session.customerUser) {
                return res.status(401).json({ success: false, error: 'NotAuthorized' });
            }

            const tickets = await db.themeparkDB('EVENT_TICKET')
                .where('CustomerID', req.session.customerUser.CustomerID)
                .where('Deleted', 0);

            if (tickets.length > 0) {
                return res.status(200).json({ success: true, tickets });
            } else {
                return res.status(404).json({ success: false, error: 'NoTicketsFound' });
            }
        } catch (err) {
            console.error('Error fetching tickets:', err);
            return res.status(500).json({ success: false, error: 'ServerError' });
        }
    });
};
