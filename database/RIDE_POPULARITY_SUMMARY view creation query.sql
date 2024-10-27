CREATE VIEW RIDE_POPULARITY_SUMMARY AS
SELECT
	R.RideID AS Ride_ID,
    R.RideName AS Ride_Name,
    COUNT(RU.RunID) AS Number_Of_Runs,
    SUM(RU.NumofRiders) AS Total_Riders,
    AVG(RU.NumofRiders) AS AVG_Riders_Per_Run,
    R.Capacity AS Ride_Capacity,
    ROUND(R.Capacity / AVG(RU.NumofRiders), 2) AS AVG_Percent_Capacity_Filled,
    MIN(RU.NumofRiders) AS Fewest_Riders_On_Run,
    MAX(RU.NumofRiders) AS Most_Riders_On_Run
FROM
	RIDES AS R LEFT OUTER JOIN RUNS AS RU
ON
	R.RideID = RU.RideID
GROUP BY
	R.RideID
ORDER BY
	Total_Riders,
    R.RideID;