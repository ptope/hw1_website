# Setup instructions for automatic updates

# 1. Make the Python script executable
chmod +x update_papers.py

# 2. Create a cron job to run the script daily at midnight
# Add this line to crontab -e:
0 0 * * * /path/to/python3 /path/to/update_papers.py

# 3. Make sure the following Python packages are installed:
pip install arxiv-python requests pytz
