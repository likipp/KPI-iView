export function contains (arr, obj) {
  let i = arr.length;
  while (i--) {
    if (arr[i].id === obj) {
      return true
    }
  }
  return false
}
