/**
 * Converts a json-like object into data compatible with "application/x-www-form-urlencoded" content-type
 * @param x
 * @returns string
 */
const toFormData = (x) => {
  return Object.entries(x)
    .map(([key, value]) => `${key}=${encodeURIComponent(value.toString())}`)
    .join('&');
};

/**
 * Generate a random number between two values
 * 
 * @param {Number} min
 * @param {Number} max
 */
const random = (min = 1, max = 10) => {
  const size = max - min
  return Math.floor(Math.random() * size) + min
}

/**
 * Array of numbers
 * 
 * Example: f(3, 6) = [3, 4, 5]
 * 
 * @param {Number} min
 * @param {Number} max
 */
const range = (min = 1, max = 10) => {
  return Array
    .from(Array(max - min))
    .map((i, k) => k + min)
}

const MIN_CHAR = 48
const MAX_CHAR = 122

/**
 * Generates a random string of chars
 * 
 * @param {Number} size 12
 * @returns {String}
 */
const randomString = (size = 12) => {
  return range(0, size)
    .map(() => String.fromCharCode(random(MIN_CHAR, MAX_CHAR)))
    .join('')
}

module.exports = {
  toFormData,
  random,
  range,
  randomString
}