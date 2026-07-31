"""
export_users.py
----------------
Connects directly to your PostgreSQL database (using the same DATABASE_URL
you already have in backend/.env) and exports every registered user, plus a
couple of useful counts per user, into users_export.json in this same folder.

Run this any time you want a fresh snapshot -- e.g. after your teammate's
/register endpoint has added test users, or after you seed some yourself.

Usage (from inside backend/, with your venv active):
    python scripts/export_users.py
"""

import json
import os
from datetime import datetime

from dotenv import load_dotenv
from sqlalchemy import create_engine, text

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise SystemExit(
        "DATABASE_URL not found. Make sure you're running this from inside "
        "backend/ and that backend/.env has a DATABASE_URL line."
    )

engine = create_engine(DATABASE_URL)

# NOTE: password_hash is intentionally excluded below -- never export it,
# even to a local file, even for testing.
USERS_QUERY = text(
    """
    SELECT
        u.id,
        u.username,
        u.email,
        u.created_at,
        COUNT(DISTINCT i.id) AS total_uploads,
        COUNT(DISTINCT d.id) AS total_downloads
    FROM users u
    LEFT JOIN images i ON i.user_id = u.id
    LEFT JOIN downloads d ON d.user_id = u.id
    GROUP BY u.id, u.username, u.email, u.created_at
    ORDER BY u.created_at DESC
    """
)


def export_users():
    with engine.connect() as conn:
        rows = conn.execute(USERS_QUERY).mappings().all()

    users = []
    for row in rows:
        users.append(
            {
                "id": row["id"],
                "username": row["username"],
                "email": row["email"],
                "created_at": row["created_at"].isoformat() if row["created_at"] else None,
                "total_uploads": row["total_uploads"],
                "total_downloads": row["total_downloads"],
            }
        )

    output = {
        "exported_at": datetime.now().isoformat(),
        "total_users": len(users),
        "users": users,
    }

    out_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "users_export.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2)

    print(f"Exported {len(users)} user(s) to {out_path}")


if __name__ == "__main__":
    export_users()
