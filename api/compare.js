import formidable from 'formidable';
import fs from 'fs';
import { parse } from 'csv-parse/sync';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).json({ message: 'CORS preflight successful' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const form = formidable({ multiples: true });
    
    // Parse the form data
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    // In a real implementation, we would process the files here
    // For this example, we'll return mock comparison results
    
    // Mock comparison results
    const results = {
      total_records: 5,
      differences_found: 3,
      within_tolerance: 0,
      potential_numeric_columns: ["Amount", "Quantity", "Price", "Total"],
      results: [
        {
          ID: "1",
          COLUMN: "Amount",
          SOURCE_1_VALUE: "1000",
          SOURCE_2_VALUE: "1000",
          STATUS: "match"
        },
        {
          ID: "2",
          COLUMN: "Amount",
          SOURCE_1_VALUE: "2000",
          SOURCE_2_VALUE: "2100",
          STATUS: "difference"
        },
        {
          ID: "3",
          COLUMN: "Price",
          SOURCE_1_VALUE: "50.00",
          SOURCE_2_VALUE: "55.00",
          STATUS: "difference"
        },
        {
          ID: "4",
          COLUMN: "Quantity",
          SOURCE_1_VALUE: "10",
          SOURCE_2_VALUE: "12",
          STATUS: "difference"
        },
        {
          ID: "5",
          COLUMN: "Total",
          SOURCE_1_VALUE: "500",
          SOURCE_2_VALUE: "500",
          STATUS: "match"
        }
      ]
    };

    return res.status(200).json({ results });
  } catch (error) {
    console.error('Error processing files:', error);
    return res.status(500).json({ error: 'Failed to compare files', details: error.message });
  }
}
