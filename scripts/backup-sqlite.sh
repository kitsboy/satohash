#!/bin/bash
BACKUP_DIR="/root/satohash/backups"
VOLUME_PATH=$(docker volume inspect satohash_satohash_data 2>/dev/null | python3 -c "import sys,json; d=json.load(sys.stdin); print(d[0].get('Mountpoint',''))" 2>/dev/null)
if [ -z "$VOLUME_PATH" ]; then echo "ERROR: volume not found"; exit 1; fi
mkdir -p "$BACKUP_DIR"
TS=$(date +%Y%m%d-%H%M)
tar czf "${BACKUP_DIR}/satohash-data-${TS}.tar.gz" -C "$(dirname $VOLUME_PATH)" "$(basename $VOLUME_PATH)" 2>/dev/null
ls -t "$BACKUP_DIR"/satohash-data-*.tar.gz 2>/dev/null | tail -n +8 | xargs -r rm
echo "OK: satohash-data-${TS}.tar.gz"
