exports.up = async client => {
  await client`
    ALTER TABLE posts
      ADD COLUMN synopsis TEXT NOT NULL DEFAULT '',
      ADD COLUMN tags TEXT NOT NULL DEFAULT ''
  `;
};

exports.down = async client => {
  await client`
    ALTER TABLE posts
      DROP COLUMN synopsis,
      DROP COLUMN tags
  `;
};
