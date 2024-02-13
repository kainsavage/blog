exports.up = async client => {
  await client`
    ALTER TABLE posts
      ADD COLUMN hero_url TEXT NOT NULL DEFAULT ''
  `;
};

exports.down = async client => {
  await client`
    ALTER TABLE posts
      DROP COLUMN hero_url
  `;
};
