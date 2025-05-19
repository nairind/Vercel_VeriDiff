import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file1 || !file2) {
      setError('Please select two files to compare');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('file1', file1);
    formData.append('file2', file2);
    
    try {
      const response = await fetch('/api/compare', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      setResults(data.results);
    } catch (err) {
      setError(`Failed to compare files: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <Head>
        <title>VeriDiff - File Comparison Tool</title>
        <meta name="description" content="Compare files with precision" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="title">VeriDiff</h1>
        <p className="description">Upload two files to compare their contents</p>

        <form onSubmit={handleSubmit} className="form">
          <div className="file-inputs">
            <div className="file-input">
              <label htmlFor="file1">File 1:</label>
              <input
                type="file"
                id="file1"
                onChange={(e) => setFile1(e.target.files[0])}
              />
            </div>
            
            <div className="file-input">
              <label htmlFor="file2">File 2:</label>
              <input
                type="file"
                id="file2"
                onChange={(e) => setFile2(e.target.files[0])}
              />
            </div>
          </div>
          
          <button type="submit" disabled={loading}>
            {loading ? 'Comparing...' : 'Compare Files'}
          </button>
          
          {error && <p className="error">{error}</p>}
        </form>

        {results && (
          <div className="results">
            <h2>Comparison Results</h2>
            <div className="summary">
              <p>Total Records: {results.total_records}</p>
              <p>Differences Found: {results.differences_found}</p>
              <p>Within Tolerance: {results.within_tolerance}</p>
            </div>
            
            <table className="results-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Column</th>
                  <th>Source 1 Value</th>
                  <th>Source 2 Value</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {results.results.map((row, index) => (
                  <tr key={index} className={row.STATUS === 'difference' ? 'difference' : ''}>
                    <td>{row.ID}</td>
                    <td>{row.COLUMN}</td>
                    <td>{row.SOURCE_1_VALUE}</td>
                    <td>{row.SOURCE_2_VALUE}</td>
                    <td>{row.STATUS}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          max-width: 1200px;
          margin: 0 auto;
        }

        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 100%;
        }

        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 4rem;
          text-align: center;
        }

        .description {
          text-align: center;
          line-height: 1.5;
          font-size: 1.5rem;
          margin: 1rem 0 2rem;
        }

        .form {
          width: 100%;
          max-width: 800px;
          margin-bottom: 2rem;
        }

        .file-inputs {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .file-input {
          flex: 1;
          min-width: 300px;
        }

        .file-input label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: bold;
        }

        button {
          background-color: #0070f3;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        button:hover {
          background-color: #0051a2;
        }

        button:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }

        .error {
          color: red;
          margin-top: 1rem;
        }

        .results {
          width: 100%;
          max-width: 800px;
          margin-top: 2rem;
        }

        .summary {
          display: flex;
          gap: 2rem;
          margin-bottom: 1rem;
        }

        .results-table {
          width: 100%;
          border-collapse: collapse;
        }

        .results-table th,
        .results-table td {
          padding: 0.75rem;
          border: 1px solid #ddd;
          text-align: left;
        }

        .results-table th {
          background-color: #f2f2f2;
        }

        .results-table .difference {
          background-color: #ffebee;
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
            Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}
