FROM mysql:8.0

# All apt operations
RUN apt-get update || apt-get update \
    && apt-get clean

# Give structure to the initialised db
#   MAYBE: this works when data volume is empty
COPY ./backups/hm.sql /docker-entrypoint-initdb.d/hm.sql
