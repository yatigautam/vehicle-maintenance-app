@echo off
call venv\Scripts\activate
uvicorn app:app --reload
