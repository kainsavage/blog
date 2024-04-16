exports.up = async client => {
  await client`
    ALTER TABLE posts
      ADD COLUMN blurred_hero_data_url TEXT NOT NULL DEFAULT ''
  `;
};

exports.down = async client => {
  await client`
    ALTER TABLE posts
      DROP COLUMN blurred_hero_data_url
  `;
};
