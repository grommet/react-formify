export function isObject(item) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

export function deepMerge(target, ...sources) {
  if (!sources.length) {
    return target;
  }
  // making sure to not change target (immutable)
  const output = { ...target };
  const source = sources.shift();
  if (isObject(output) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!output[key]) {
          output[key] = { ...source[key] };
        } else {
          output[key] = deepMerge({}, output[key], source[key]);
        }
      } else {
        output[key] = source[key];
      }
    });
  }
  return deepMerge(output, ...sources);
}

export function getValueByKey(resource, key) {
  const group = key.split('.');
  let currentObject = resource;
  let value;
  group.forEach((currentKey) => {
    if (!currentObject[currentKey]) {
      return false;
    }
    if (isObject(currentObject[currentKey])) {
      currentObject = currentObject[currentKey];
    } else {
      value = currentObject[currentKey];
    }
    return true;
  });
  return value;
}

export function setValueByKey(resource, key, value) {
  const group = key.split('.');
  let currentObject = resource;
  group.forEach((currentKey, index) => {
    if (!currentObject[currentKey] && index < group.length - 1) {
      currentObject[currentKey] = {};
      currentObject = currentObject[currentKey];
    } else if (isObject(currentObject[currentKey])) {
      currentObject = currentObject[currentKey];
    } else if (group.length - 1 === index) {
      currentObject[currentKey] = value;
    }
  });
}

export default { isObject, getValueByKey, setValueByKey };
