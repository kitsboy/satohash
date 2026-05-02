module.exports = {
  apps: [
    {
      name: 'satohash-api',
      script: 'server/index.js',
      instances: 'max',
      exec_mode: 'cluster',
      env_production: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      max_memory_restart: '1G',
      error_file: 'logs/err.log',
      out_file: 'logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      kill_timeout: 5000, // Graceful shutdown for zero-downtime
      listen_timeout: 1000
    }
  ]
};
