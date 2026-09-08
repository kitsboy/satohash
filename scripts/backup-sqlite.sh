#!/bin/bash
BACKUP_DIR="/root/satohash/backups"
VOLUME_PATH=$(docker volume inspect satohash_satohash_data 2>/dev/null | python3 -c "import sys,json; d=json.load(sys.stdin); print(d[0].get('Mountpoint',''))" 2>/dev/null)
if [ -z "$VOLUME_PATH" ]; then echo "ERROR: volume not found"; exit 1; fi
mkdir -p "$BACKUP_DIR"
# Checkpoint live WAL before tar so the .db in the archive is consistent.
# Missing sqlite3 is a warning; a failed checkpoint fails the backup.
if docker exec satohash-satohash-api-1 sqlite3 /app/data/satohash.db "PRAGMA wal_checkpoint(TRUNCATE);" 2>/dev/null; then
  echo "OK: wal_checkpoint (sqlite3)"
else
  echo "WARN: sqlite3 not in container — trying node/better-sqlite3"
  if docker exec satohash-satohash-api-1 node --input-type=module -e "
    import Database from 'better-sqlite3';
    const db = new Database('/app/data/satohash.db');
    db.pragma('wal_checkpoint(TRUNCATE)');
    db.close();
  "; then
    echo "OK: wal_checkpoint (node)"
  else
    echo "ERROR: wal_checkpoint failed"
    exit 1
  fi
fi
TS=$(date +%Y%m%d-%H%M)
tar czf "${BACKUP_DIR}/satohash-data-${TS}.tar.gz" -C "$(dirname $VOLUME_PATH)" "$(basename $VOLUME_PATH)" 2>/dev/null
ls -t "$BACKUP_DIR"/satohash-data-*.tar.gz 2>/dev/null | tail -n +8 | xargs -r rm
echo "OK: satohash-data-${TS}.tar.gz"
