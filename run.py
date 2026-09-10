"""
Scheme Sathi - Entry point launcher.
Run: python run.py
"""

import sys
import os

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

import uvicorn

if __name__ == "__main__":
    print("=" * 70)
    print("Scheme Sathi - AI-Driven Scheme Matching Platform (SIH PS 26092)")
    print("Ministry of Social Justice and Empowerment (MoSJE) & NSFDC")
    print("Starting Web Server at: http://127.0.0.1:8000")
    print("=" * 70)
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)
