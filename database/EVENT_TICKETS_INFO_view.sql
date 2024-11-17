CREATE VIEW EVENT_TICKETS_INFO AS
SELECT et.EventTicketID,
       e.EventID,
       e.EventName,
       IF(c.FirstName IS NULL, "DELETED",
          CONCAT(c.FirstName, ' ', c.LastName))  AS CustomerName,
       et.Bought,
       et.ExpirationDate,
       IF(et.Scanned IS NULL, "N/A", et.Scanned) AS ScannedDate
FROM EVENT_TICKET et
         INNER JOIN
     EVENTS e ON e.EventID = et.EventID
         LEFT JOIN
     CUSTOMER c ON c.CustomerID = et.CustomerID
WHERE et.Deleted = 0
ORDER BY et.EventTicketID;