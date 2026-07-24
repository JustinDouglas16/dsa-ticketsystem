export function compareIds(firstId: string, secondId: string): number {
  return firstId.localeCompare(secondId, undefined, {
    numeric: true,
    sensitivity: "base",
  });
}
