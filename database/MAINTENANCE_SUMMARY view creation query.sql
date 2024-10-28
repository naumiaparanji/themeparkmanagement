DROP VIEW MAINTENANCE_SUMMARY;

CREATE VIEW MAINTENANCE_SUMMARY AS
SELECT
	R.RideID AS Ride_ID,
    R.RideName AS Ride_Name,
    IF(M.MaintenanceID IS NULL, "No Ongoing Maintenance", M.MaintenanceID) AS Maintenance_ID,
    IF(M.MaintenanceID IS NULL, "N/A",
		IF((RS.RideID, MAX(RS.Created)) IN (
			select
				rs.RideID,
				max(rs.Created)
			from
				RIDE_STATUS as rs
			group by
				rs.RideID
		), "In Progress", "Completed")
	) AS Status,
    IF(M.Date IS NULL, "N/A", M.Date) AS Start_Date,
    IF(M.Description IS NULL, "N/A", M.Description) AS Description
FROM
	RIDES AS R
LEFT OUTER JOIN
    RIDE_STATUS AS RS ON R.RideID = RS.RideID
LEFT OUTER JOIN
    MAINTENANCE AS M ON M.RideID = R.RideID
LEFT OUTER JOIN
    M_STATUS AS MS ON (MS.RideStatusID = RS.RideStatusID AND MS.MaintenanceID = M.MaintenanceID)
GROUP BY
	M.MaintenanceID, R.RideID
ORDER BY
	R.RideID ASC,
    Status DESC,
    Start_Date ASC;