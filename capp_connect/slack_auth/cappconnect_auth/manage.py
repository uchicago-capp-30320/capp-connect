#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""

import os
import sys
from pathlib import Path


# Walk up until we find the folder that contains `capp_connect`
p = Path(__file__).resolve()
while not (p / "capp_connect").exists():
    if p == p.parent:
        raise RuntimeError(
            "Could not find capp_connect/ in any parent directory"
        )
    p = p.parent

sys.path.append(str(p))


def main():
    """Run administrative tasks."""
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "cappconnect_auth.settings")
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == "__main__":
    main()
