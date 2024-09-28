// Структура для зберігання співвідношень між одиницями виміру
const unitGraph = {};

/**
 * Додає нові одиниці виміру та їх коефіцієнти до структури даних, яку ви створюєте і оброблюєте самостійно.
 *
 * @param {string} firstUnit
 * @param {string} secondUnit
 * @param {number} coefficient Коефіцієнт, який визначає відношення першої одиниці виміру до другої
 *
 */
export const addNewUnit = (firstUnit, secondUnit, coefficient) => {
  if (!unitGraph[firstUnit]) unitGraph[firstUnit] = {};
  if (!unitGraph[secondUnit]) unitGraph[secondUnit] = {};

  unitGraph[firstUnit][secondUnit] = coefficient;
  unitGraph[secondUnit][firstUnit] = 1 / coefficient;
};

/**
 * Конвертує значення однієї одиниці виміру в іншу
 *
 * @param {string} convertFrom Назва одиниці виміру, з якої треба конвертувати (m, km, yd, ft)
 * @param {number} value Числове значення одиниці виміру з першого параметру
 * @param {string} convertTo Назва одиниці виміру до якої треба конвертувати (m, km, yd, ft)
 *
 * @returns {number}
 */
export const convertDistanceUnits = (convertFrom, value, convertTo) => {
  if (convertFrom === convertTo) return value;

  const queue = [[convertFrom, 1]];
  const visited = new Set();

  while (queue.length > 0) {
    const [currentUnit, currentFactor] = queue.shift();

    if (currentUnit === convertTo) {
      // Округлюємо результат до двох знаків після коми
      return roundDistanceValue(value * currentFactor, 2);
    }

    if (!visited.has(currentUnit)) {
      visited.add(currentUnit);

      for (const [nextUnit, coefficient] of Object.entries(unitGraph[currentUnit] || {})) {
        if (!visited.has(nextUnit)) {
          queue.push([nextUnit, currentFactor * coefficient]);
        }
      }
    }
  }

  throw new Error(`Неможливо конвертувати з ${convertFrom} в ${convertTo}`);
};

/**
 * Округлює передане значення до потрібної кількості знаків після коми
 *
 * @param {number} value Значення, яке треба округлити
 * @param {number} decimalPointsNumber Кількість знаків після коми
 *
 * @returns {number}
 */
export const roundDistanceValue = (value, decimalPointsNumber) => {
  const factor = Math.pow(10, decimalPointsNumber);
  return Math.round(value * factor) / factor;
};