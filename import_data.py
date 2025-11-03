#!/usr/bin/env python3
"""
Script to import data from JSON files into the database.
Run this after the database tables have been created.

Usage:
    python import_data.py
"""
import sys
from app.import_data import import_data

if __name__ == "__main__":
    try:
        import_data()
        print("\n✅ Import completed successfully!")
        sys.exit(0)
    except Exception as e:
        print(f"\n❌ Import failed: {e}")
        sys.exit(1)

