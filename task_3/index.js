/**
 * @typedef Point
 * @type {object}
 * @property {number} x
 * @property {number} y
 * @property {number} z
 */

/**
 * @typedef Result
 * @type {object}
 * @property {Point[]} probes
 * @property {Point} location
 */

/**
 * @param {number} min
 * @param {number} max
 *
 * @returns {number}
 */
export const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * @returns {Point}
 */
export const getRandomCoordinates = () => {
  return {
    x: getRandomNumber(0, 100),
    y: getRandomNumber(0, 100),
    z: getRandomNumber(0, 100)
  };
};

/**
 * @returns {Point}
 */
export const createAsteroid = () => {
  return getRandomCoordinates();
};

/**
 * @param {Point} point1
 * @param {Point} point2
 *
 * @returns {number}
 */
export const getDistanceBetweenPoints = (point1, point2) => {
  const dx = point1.x - point2.x;
  const dy = point1.y - point2.y;
  const dz = point1.z - point2.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
};

/**
 * @return {Result}
 */
export const findAsteroidLocation = () => {
  const asteroid = createAsteroid();
  const probes = [];

  // Функція для перевірки, чи знайдено астероїд
  const isAsteroidFound = (probe) => {
    return probe.x === asteroid.x && probe.y === asteroid.y && probe.z === asteroid.z;
  };

  // Функція для генерації нового зонда на основі попередніх даних
  const generateProbe = (prevProbes) => {
    if (prevProbes.length === 0) {
      return getRandomCoordinates();
    }

    const lastProbe = prevProbes[prevProbes.length - 1];
    const distance = getDistanceBetweenPoints(lastProbe, asteroid);

    // Генеруємо нові координати в межах сфери з радіусом distance
    const theta = 2 * Math.PI * Math.random();
    const phi = Math.acos(2 * Math.random() - 1);
    const r = distance;

    return {
      x: Math.min(100, Math.max(0, Math.round(lastProbe.x + r * Math.sin(phi) * Math.cos(theta)))),
      y: Math.min(100, Math.max(0, Math.round(lastProbe.y + r * Math.sin(phi) * Math.sin(theta)))),
      z: Math.min(100, Math.max(0, Math.round(lastProbe.z + r * Math.cos(phi))))
    };
  };

  // Пошук астероїда
  let foundAsteroid = null;
  while (true) {
    const probe = generateProbe(probes);
    probes.push(probe);

    if (isAsteroidFound(probe)) {
      foundAsteroid = probe;
      break;
    }
  }

  return { 
    probes,
    location: foundAsteroid  // Додаємо знайдене розташування астероїда
  };
};