const db = require('./db'); // Import the database connection and queries

module.exports = (app) => {
    app.get('/customer/info', async (req, res) => {
        try {
            if (!req.session.customerUser) {
                return res.status(401).json({ success: false, error: 'NotAuthorized' });
            }

            const customer = await db.getUser(req.session.customerUser);
            if (customer) {
                res.status(200).json({ success: true, user: customer });
            } else {
                res.status(404).json({ success: false, error: 'CustomerNotFound' });
            }
        } catch (err) {
            console.error('Error fetching customer info:', err);
            res.status(500).json({ success: false, error: 'ServerError' });
        }
    });

    app.get('/customer/tickets', async (req, res) => {
        try {
            if (!req.session.customerUser) {
                return res.status(401).json({ success: false, error: 'NotAuthorized' });
            }

            const tickets = await db.themeparkDB('EVENT_TICKET')
                .where('CustomerID', req.session.customerUser.CustomerID)
                .where('Deleted', 0);

            if (tickets.length > 0) {
                res.status(200).json({ success: true, tickets });
            } else {
                res.status(404).json({ success: false, error: 'NoTicketsFound' });
            }
        } catch (err) {
            console.error('Error fetching tickets:', err);
            res.status(500).json({ success: false, error: 'ServerError' });
        }
    });
};
