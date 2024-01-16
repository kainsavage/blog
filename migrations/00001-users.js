exports.up = async client => {
  await client`
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NULL
    )
  `;
};

exports.down = async client => {
  await client`
    DROP TABLE IF EXISTS users
  `;
};
