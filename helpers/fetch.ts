/**
 * Takes the given relative URI and returns fully qualified URL.
 * Must be called as a TaggedTemplate literal.
 * Ex:
 * ```ts
 * const url = fq`/api/v1/users`;
 * ```
 */
function fq(endpoint: TemplateStringsArray) {
  return `${process.env.NEXT_PUBLIC_API_URL}${endpoint[0]}`;
}

export { fq };
