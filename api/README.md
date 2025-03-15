# FastAPI Backend Setup

## Setup Instructions

### 1. Clone the Repository
```sh
git clone <repo_url>
cd backend
```

### 2. Create a Virtual Environment 
Note: Python version is Python 3.10
```sh
python -m venv venv
source venv/bin/activate  # On macOS/Linux
venv\Scripts\activate  # On Windows
```

### 3. Install Dependencies
```sh
pip install -r requirements.txt
```

### 4. Create a `.env` File
Add the following environment variables in a `.env` file in the root directory of the backend folder:
```sh
# To be edited
```

### 5. Run the Server
```sh
uvicorn main:app --reload
```

---

## Folder Structure & Purpose
```sh
backend/
 ┣ 📂 api/        # (General API logic)
 ┣ 📂 config/     # (Configuration settings, database, and environment variables)
 ┣ 📂 models/     # (Database models using SQLAlchemy)
 ┣ 📂 routers/    # (API route definitions for different modules)
 ┣ 📂 schemas/    # (Schemas for request & response validation)
 ┣ 📂 util/       # (Helper functions like security, JWT handling)
 ┣ 📜 .gitignore  # (Ignored files for version control)
 ┣ 📜 main.py     # (Entry point of the application)
 ┣ 📜 requirements.txt  # (Dependencies for the project *feel free to edit as needed*)
 ┣ 📜 readme.md   # (Project documentation)
```