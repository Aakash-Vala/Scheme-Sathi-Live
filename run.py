"""
Scheme Sathi - Entry point launcher.
Run: python run.py
"""

import sys
import os

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

import uvicorn

if __name__ == "__main__":
    host = os.environ.get("HOST", "0.0.0.0")
    port = int(os.environ.get("PORT", 8000))
    env = os.environ.get("ENVIRONMENT", "development")
    reload_flag = env != "production"

    print("=" * 70)
    print("Scheme Sathi • AI Concessional Scheme Matching Platform (SIH PS 26092)")
    print("Ministry of Social Justice and Empowerment (MoSJE) & NSFDC")
    print(f"Environment: {env.upper()} | Binding: http://{host}:{port}")
    print("=" * 70)
    uvicorn.run("app:app", host=host, port=port, reload=reload_flag)

