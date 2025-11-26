export function computeTextScore(
  searchText: string,
  keywords: (string | undefined)[],
  maxWeight: number
) {
  if (!searchText || !keywords?.length || maxWeight <= 0) {
    return 0;
  }

  const normalizedSearchText = searchText.toLowerCase();
  const normalizedKeywords = keywords
    .map((keyword) => keyword?.toLowerCase().trim())
    .filter((keyword): keyword is string => Boolean(keyword));

  if (!normalizedKeywords.length) {
    return 0;
  }

  const matches = normalizedKeywords.filter((keyword) =>
    normalizedSearchText.includes(keyword)
  );

  if (!matches.length) {
    return 0;
  }

  const ratio = matches.length / normalizedKeywords.length;
  return Math.min(maxWeight, maxWeight * ratio);
}
