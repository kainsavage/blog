function unslugify(input: string) {
  return decodeURIComponent(input).toLowerCase().replace(/-/g, ' ');
}

function slugify(input: string) {
  return encodeURIComponent(input.toLowerCase().replace(/ /g, '-'));
}

export default { unslugify, slugify };
