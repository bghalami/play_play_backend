// Update with your config settings.

module.exports = {

  development: {
  client: 'pg',
  connection: 'postgres://localhost/play_play',
  migrations: {
      directory: './db/migrations'
    },
  seeds: {
    directory: './db/seeds/dev'
  },
  useNullAsDefault: true
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'play_play_stage',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'pg',
    connection: {
      database: 'play_play_production'
    },
    migrations: {
        directory: './db/migrations'
      },
    seeds: {
      directory: './db/seeds/dev'
    },
    pool: {
      min: 2,
      max: 10
    },
    ssl: true
  }

};
