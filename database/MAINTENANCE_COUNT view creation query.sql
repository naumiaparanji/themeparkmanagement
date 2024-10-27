CREATE VIEW MAINTENANCE_COUNT AS
SELECT
	R.RideID AS Ride_ID,
    R.RideName AS Ride_Name,
    COUNT(M.MaintenanceID) AS Num_Maintenance_Tickets
FROM
	RIDES AS R LEFT OUTER JOIN MAINTENANCE AS M
ON
	R.RideID = M.RideID
GROUP BY
	R.RideID
ORDER BY
	Num_Maintenance_Tickets DESC,
    R.RideID ASC;