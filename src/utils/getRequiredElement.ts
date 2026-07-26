export function getRequiredElement<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector);

  if (!element) {
    throw new Error(`Het vereiste element "${selector}" bestaat niet.`);
  }

  return element;
}
