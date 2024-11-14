CREATE VIEW RIDE_POPULARITY_SUMMARY AS
SELECT
	R.RideID AS Ride_ID,
    R.RideName AS Ride_Name,
    COUNT(RU.RunID) AS Number_Of_Runs,
    IF(COUNT(RU.RunID) > 0, SUM(RU.NumofRiders), 0) AS Total_Riders,
    IF(COUNT(RU.RunID) > 0, ROUND(AVG(RU.NumofRiders), 1), 0) AS AVG_Riders_Per_Run,
    R.Capacity AS Ride_Capacity,
    CONCAT(ROUND(IF(COUNT(RU.RunID) > 0, 100 * AVG(RU.NumofRiders / R.Capacity), 0), 0), "%") AS AVG_Percent_Capacity_Filled,
    IF(COUNT(RU.RunID) > 0, MIN(RU.NumofRiders), 0) AS Fewest_Riders_On_Run,
    IF(COUNT(RU.RunID) > 0, MAX(RU.NumofRiders), 0) AS Most_Riders_On_Run
FROM
	RIDES AS R LEFT OUTER JOIN RUNS AS RU
ON
	R.RideID = RU.RideID
GROUP BY
	R.RideID
ORDER BY
	Total_Riders DESC,
    R.RideID ASC;