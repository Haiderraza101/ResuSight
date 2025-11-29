"""
Simple script to run Flask API
Make sure you're in the backend/flask_api directory when running this
"""
import os
import sys

# Add current directory to path
sys.path.insert(0, os.path.dirname(__file__))

from app import app

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    print(f"Starting Flask API on port {port}...")
    print(f"Models directory: {os.path.join(os.path.dirname(__file__), '../../models')}")
    app.run(host='0.0.0.0', port=port, debug=True)

