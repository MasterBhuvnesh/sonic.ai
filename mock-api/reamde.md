| Step | Command |
| --- | --- |
| Create a Python environment | `python -m venv venv` |
| Activate virtual environment (PowerShell) | `.\venv\Scripts\Activate.ps1` |
| Activate virtual environment (CMD) | `.\venv\Scripts\activate.bat` |
| Install dependencies | `pip install -r requirements.txt` |
| Run the server | `uvicorn api:app --host 0.0.0.0 --port 8000 --reload` |
| Server running on  | `http://localhost:8000/` |