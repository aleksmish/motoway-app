export function pluralize(
  count: number,
  forms: [string, string, string],
): string {
  const absCount = Math.abs(count);
  const mod100 = absCount % 100;
  const mod10 = absCount % 10;

  if (mod100 >= 11 && mod100 <= 19) {
    return forms[2];
  }
  if (mod10 === 1) {
    return forms[0];
  }
  if (mod10 >= 2 && mod10 <= 4) {
    return forms[1];
  }
  return forms[2];
}
