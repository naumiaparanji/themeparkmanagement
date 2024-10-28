CREATE VIEW MAINTENANCE_COUNT AS
SELECT
	Ride_ID,
    Ride_Name,
    COUNT(IF(Status = "In Progress", 1, NULL)) AS Active_Maintenance_Tickets,
    COUNT(IF(Status = "Completed", 1, NULL)) AS Completed_Maintenance_Tickets
FROM
	MAINTENANCE_SUMMARY
GROUP BY
	Ride_ID
ORDER BY
	Active_Maintenance_Tickets DESC,
    Ride_ID ASC;