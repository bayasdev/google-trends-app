// Import the Google Cloud functions framework
const functions = require('@google-cloud/functions-framework');

// Import the Google Cloud BigQuery client library
const { BigQuery } = require('@google-cloud/bigquery');

// Create a client
const bigquery = new BigQuery();

// Define the SQL query with a parameter
const sqlQuery = `-- This query shows a list of the daily top Google Search terms.
SELECT
   refresh_date AS Day,
   term AS Top_Term,
       -- These search terms are in the top 25 in the US each day.
   rank,
FROM \`bigquery-public-data.google_trends.top_terms\`
WHERE
   rank = 1
       -- Choose only the top term each day.
   AND refresh_date >= DATE_SUB(CURRENT_DATE(), INTERVAL @dayInterval DAY)
       -- Filter to the custom time interval.
GROUP BY Day, Top_Term, rank
ORDER BY Day DESC
   -- Show the days in reverse chronological order.`;

// Define the function
functions.http('fetchTopSearches', async (req, res) => {
  try {
    // Get the dayInterval parameter from the request body (default: 7)
    const dayInterval = req.body.dayInterval || 7;

    // Set the query options
    const options = {
      query: sqlQuery,
      params: { dayInterval },
    };

    // Run the query
    const [rows] = await bigquery.query(options);

    // Map the rows to the desired format
    const data = rows.map((row) => ({
      day: row.Day.value,
      topTerm: row.Top_Term,
    }));

    // Set the CORS header to allow any origin
    res.set('Access-Control-Allow-Origin', '*');
    // Set the CORS header to allow the Content-Type, Origin and Accept headers
    res.set('Access-Control-Allow-Headers', 'Content-Type, Origin, Accept');

    // Send the results as JSON
    res.status(200).json(data);
  } catch (err) {
    // Handle errors
    console.error(err);
    res.status(500).send(err.message);
  }
});
