exports.up = async client => {
  await client`
    ALTER TABLE posts
      ALTER COLUMN title
        SET DEFAULT '',
      ALTER COLUMN body
        SET DEFAULT ''
  `;
  await client`
    ALTER TABLE posts
      ADD COLUMN draft_title TEXT NOT NULL DEFAULT '',
      ADD COLUMN draft_body TEXT NOT NULL DEFAULT '',
      ADD COLUMN draft_synopsis TEXT NOT NULL DEFAULT '',
      ADD COLUMN draft_tags TEXT NOT NULL DEFAULT '',
      ADD COLUMN draft_hero_url TEXT NOT NULL DEFAULT '',
      ADD COLUMN draft_blurred_hero_data_url TEXT NOT NULL DEFAULT ''
  `;
  // These new columns need to have the correct data in them. By default, they should have the data
  // from their published counterparts so that we can edit them correctly.
  await client`
    UPDATE posts
      SET draft_title = title,
          draft_body = body,
          draft_synopsis = synopsis,
          draft_tags = tags,
          draft_hero_url = hero_url,
          draft_blurred_hero_data_url = blurred_hero_data_url
  `;
};

exports.down = async client => {
  await client`
    ALTER TABLE posts
      ALTER COLUMN title
        DROP DEFAULT,
      ALTER COLUMN body
        DROP DEFAULT
  `;
  await client`
    ALTER TABLE posts
      DROP COLUMN draft_title,
      DROP COLUMN draft_body,
      DROP COLUMN draft_synopsis,
      DROP COLUMN draft_tags,
      DROP COLUMN draft_hero_url,
      DROP COLUMN draft_blurred_hero_data_url
  `;
};
