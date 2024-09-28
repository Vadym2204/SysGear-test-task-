// Об'єкт для зберігання обробників
const handlers = {
  include: (data, rules) => {
    return data.filter(item => {
      return Object.entries(rules).every(([key, value]) => {
        return item[key] === value;
      });
    });
  },
  exclude: (data, rules) => {
    return data.filter(item => {
      return !Object.entries(rules).every(([key, value]) => {
        return item[key] === value;
      });
    });
  },
  sortBy: (data, key) => {
    return [...data].sort((a, b) => {
      if (a[key] < b[key]) return -1;
      if (a[key] > b[key]) return 1;
      return 0;
    });
  }
};

/**
 * Додає нові обробники до існуючого набору
 *
 * @param {Object} newHandlers Об'єкт з новими обробниками
 */
export const addNewHandlers = (newHandlers) => {
  Object.assign(handlers, newHandlers);
};

/**
 * Додає новий обробник, який буде взаємодіяти з даними
 * @param {string} name Назва обробника
 * @param {(data:unknown[])=>unknown[]} handler Функція, яка буде оброблювати дані
 */
export const addNewHandler = (name, handler) => {
  handlers[name] = handler;
};

/**
 * Запускає всі додані обробники на переданих даних і повертає відповідний результат
 * @param {unknown[]} data Масив об'єктів для обробки
 * @param {Object.<string, unknown[]>} conditions Об'єкт умов для обробки
 *
 * @return {unknown[]}
 */
export const runHandlers = (data, conditions) => {
  let processedData = data;

  // Ітеруємо по умовам (об'єкту conditions), викликаючи обробники
  for (const [handlerName, params] of Object.entries(conditions)) {
    const handler = handlers[handlerName];

    if (!handler) {
      throw new Error(`Невідомий обробник: ${handlerName}`);
    }

    // Викликаємо обробник з відповідними параметрами
    processedData = handler(processedData, ...params);
  }

  return processedData;
};
