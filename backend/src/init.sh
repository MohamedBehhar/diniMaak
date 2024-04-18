#!/bin/bash

set -e


# Check if PostgreSQL is ready to accept connections

until pg_isready -h postgres -p 5432 -q; do
    echo "Postgres is unavailable - sleeping"
    sleep 1
done

# Execute the SQL script
PGPASSWORD=postgres psql -h postgres -U "$POSTGRES_USER" -d "$POSTGRES_DB" -f ./src/init.sql

echo "Database initialization completed"

# Run other commands or start your application
exec "$@"

# psql -h postgres -U "postgres" -d "postgres"