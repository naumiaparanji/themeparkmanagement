CREATE VIEW MAINTENANCE_SUMMARY AS
SELECT
	R.RideID AS Ride_ID,
    R.RideName AS Ride_Name,
    IF(M.MaintenanceID IS NULL, "No Ongoing Maintenance", M.MaintenanceID) AS Maintenance_ID,
    IF(M.Date IS NULL, "N/A", M.Date) AS Start_Date,
    IF(M.Description IS NULL, "N/A", M.Description) AS Description
FROM
	RIDES AS R LEFT OUTER JOIN MAINTENANCE AS M
ON
	M.RideID = R.RideID
ORDER BY
	R.RideID;