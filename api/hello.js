// Updated hello.js for Vercel API routes
export default function handler(req, res) {
  res.status(200).json({
    message: "Hello from Vercel Functions!",
    timestamp: new Date().toISOString()
  });
}
