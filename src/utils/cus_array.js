export default class CusArray extends Array {
  get first() {
    return this[0];
  }

  get last() {
    return this[this.length - 1];
  }
}
