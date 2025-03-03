export function blobToDataURL(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export function lengthToDuration(length: number | null): string {
  if (length) {
    let totalSeconds = Math.floor(length / 1000);
    let minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    let seconds = String(totalSeconds % 60).padStart(2, '0');

    return `${minutes}:${seconds}`;
  } else {
    return '';
  }
}

export function removeIfPresent(list: any[], item: any, keyFn: (a: any) => string) {
  const index = list.map(keyFn).indexOf(keyFn(item));
  if (index > -1) {
    list.splice(index, 1);
  }
}

export function rememberItem(memory: string, item: any, keyFn: (a: any) => string) {
  let items = JSON.parse(localStorage.getItem(memory) || '[]');
  removeIfPresent(items, item, keyFn);
  items.push(item);
  localStorage.setItem(memory, JSON.stringify(items));
}

export function recallItems(memory: string): any[] {
  return JSON.parse(localStorage.getItem(memory) || '[]');
}

export function forgetItem(memory: string, item: any, keyFn: (a: any) => string) {
  let items = JSON.parse(localStorage.getItem(memory) || '[]');
  removeIfPresent(items, item, keyFn);
  localStorage.setItem(memory, JSON.stringify(items));
}
