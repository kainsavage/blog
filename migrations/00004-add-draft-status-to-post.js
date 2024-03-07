exports.up = async client => {
  await client`
    ALTER TABLE posts
      ADD COLUMN is_draft BOOLEAN NOT NULL DEFAULT TRUE,
      ADD COLUMN published_at TIMESTAMP DEFAULT NULL
  `;
};

exports.down = async client => {
  await client`
    ALTER TABLE posts
      DROP COLUMN is_draft,
      DROP COLUMN published_at
  `;
};
