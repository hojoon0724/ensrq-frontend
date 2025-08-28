export function randomize(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // random index 0..i
    [array[i], array[j]] = [array[j], array[i]];   // swap
  }
  return array;
}

// const arr = [1, 2, 3, 4, 5];
// console.log(shuffle(arr));
