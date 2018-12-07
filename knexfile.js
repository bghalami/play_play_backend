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
    connection: "postgres://pbabetphqyeynf:019c09549745eb2173b981258f9386164fc00353cd0cf89d0231701682be8f63@ec2-54-225-100-12.compute-1.amazonaws.com:5432/dac2faig0bp5lo",
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
