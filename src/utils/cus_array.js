export default class CusArray extends Array {
  get first() {
    return this[0];
  }

  get last() {
    return this[this.length - 1];
  }

  get min() {
    const arr = this.filter((n) => n).toSorted();
    return arr[0];
  }

  get max() {
    const arr = this.filter((n) => n).toSorted();
    return arr[arr.length - 1];
  }
}
