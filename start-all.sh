#!/bin/bash
# Start ResuSight application (Bash version for Linux/Mac)

echo "=========================================="
echo "Starting ResuSight Application"
echo "=========================================="
echo ""

# Start Flask Backend
echo "Starting Flask Backend (localhost:5000)..."
cd backend/flask_api
python app.py &
FLASK_PID=$!

echo ""
sleep 2

# Start Next.js Frontend
echo "Starting Next.js Frontend (localhost:3000)..."
cd ../../resusight-frontend
npm run dev &
NEXTJS_PID=$!

echo ""
echo "=========================================="
echo "✅ Application Started!"
echo "=========================================="
echo ""
echo "Frontend:  http://localhost:3000"
echo "Backend:   http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Keep script running
wait
