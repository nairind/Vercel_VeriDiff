// Updated compare.js for Vercel API routes with proper file upload handling
import formidable from 'formidable';
import { promises as fs } from 'fs';

// Configure for Vercel serverless functions
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse form with formidable
    const form = new formidable.IncomingForm();
    form.keepExtensions = true;
    
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    // Check if both files were uploaded
    if (!files.file1 || !files.file2) {
      return res.status(400).json({ error: 'Please upload both files' });
    }

    // Read file contents
    const file1Content = await fs.readFile(files.file1.filepath, 'utf8');
    const file2Content = await fs.readFile(files.file2.filepath, 'utf8');

    // Simple comparison (can be enhanced for different file types)
    const file1Lines = file1Content.split('\n');
    const file2Lines = file2Content.split('\n');
    
    // Compare line by line
    const comparison = {
      file1Name: files.file1.originalFilename,
      file2Name: files.file2.originalFilename,
      file1Lines: file1Lines.length,
      file2Lines: file2Lines.length,
      differences: []
    };

    const maxLines = Math.max(file1Lines.length, file2Lines.length);
    
    for (let i = 0; i < maxLines; i++) {
      const line1 = i < file1Lines.length ? file1Lines[i] : null;
      const line2 = i < file2Lines.length ? file2Lines[i] : null;
      
      if (line1 !== line2) {
        comparison.differences.push({
          lineNumber: i + 1,
          file1: line1,
          file2: line2
        });
      }
    }

    // Return comparison results
    return res.status(200).json({
      success: true,
      comparison
    });
    
  } catch (error) {
    console.error('Error comparing files:', error);
    return res.status(500).json({ error: 'Failed to compare files', details: error.message });
  }
}
