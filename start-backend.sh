#!/bin/bash

echo "Starting ResuSight Backend Services..."
echo ""

# Start Flask API in background
echo "Starting Flask API..."
cd backend/flask_api
python app.py &
FLASK_PID=$!
cd ../..

# Wait a bit for Flask to start
sleep 3

# Start Express.js server
echo "Starting Express.js Server..."
cd backend
npm run dev &
EXPRESS_PID=$!
cd ..

echo ""
echo "Both services are starting..."
echo "Flask API: http://localhost:5001"
echo "Express Server: http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for user interrupt
trap "kill $FLASK_PID $EXPRESS_PID; exit" INT
wait

