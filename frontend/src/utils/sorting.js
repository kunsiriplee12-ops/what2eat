export default function bubbleSortByName(items, descending = false) {
  const sortedItems = [...items];

  for (let pass = 0; pass < sortedItems.length - 1; pass += 1) {
    for (let index = 0; index < sortedItems.length - 1 - pass; index += 1) {
      const firstName = String(sortedItems[index]?.strMeal ?? "").trim();
      const secondName = String(sortedItems[index + 1]?.strMeal ?? "").trim();
      const comparison = firstName.localeCompare(secondName, undefined, {
        sensitivity: "base",
      });

      if (descending ? comparison < 0 : comparison > 0) {
        [sortedItems[index], sortedItems[index + 1]] = [
          sortedItems[index + 1],
          sortedItems[index],
        ];
      }
    }
  }

  return sortedItems;
}
