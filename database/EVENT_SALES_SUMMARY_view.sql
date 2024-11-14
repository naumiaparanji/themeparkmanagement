CREATE VIEW EVENT_SALES_SUMMARY AS
SELECT 
    e.EventID,
    e.EventName,
    CONCAT(
        COUNT(CASE WHEN et.EventTicketID IS NOT NULL AND et.Deleted != 1 THEN 1 END),
        ' of ',
        e.Capacity 
    ) AS TotalTickets,
    COUNT(CASE WHEN et.Scanned IS NOT NULL AND et.Deleted != 1 THEN 1 END) AS ScannedCount
FROM 
    EVENTS e
LEFT JOIN 
    EVENT_TICKET et ON et.EventID = e.EventID
GROUP BY e.EventID
ORDER BY e.EventID;