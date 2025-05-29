# Database access

This document explains how to access our PostgreSQL database.

To access the database, you will need to create two configuration files in your home directory and set appropriate permissions. You can then access the database.

## Connection service file

This file stores the connection service for PostgreSQL. Create it at:
~/.pg_service.conf

The file should follow this format, replacing placeholders with actual credentials:

```ini
[my_service]
host=placeholder
port=5432
user=capp_connect
dbname=capp_connect
```

## Password storage

This file stores the database password. Create it at:
~/.pgpass.

The file should follow this format, but replaced with the actual values.

```ini
host:port:user:dbname:password
```

## File permissions

Change file permissions so that only you have read and write access by using chmod 600.

```ini
chmod 600 ~/.pg_service.conf

chmod 600 ~/.pgpass
```

## Accessing the database

Once the above steps have been completed, you can access the database in the terminal by running:

```ini
psql service=my_service
```
