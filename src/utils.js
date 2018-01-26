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

export function deepCompare(obj1, obj2) {
  if (obj1 && obj2) {
    let diff = Object.keys(obj1).find((key) => {
      if (obj1.hasOwnProperty(key) !== obj2.hasOwnProperty(key)) {
        return true;
      }
      switch (typeof (obj1[key])) {
      case 'object':
        if (!deepCompare(obj1[key], obj2[key])) {
          return true;
        }
        break;
      case 'function':
        if (typeof (obj2[key]) === 'undefined' || (obj1[key].toString() !== obj2[key].toString())) {
          return true;
        }
        break;
      default:
        if (obj1[key] !== obj2[key]) {
          return true;
        }
      }
      return false;
    });
    if (diff) {
      return false;
    }
    // check if obj2 has any props that do not exist in obj1
    diff = Object.keys(obj2).find(key => (
      typeof (obj1[key]) === 'undefined'
    ));
    if (diff) {
      return false;
    }
  }
  return (obj1 === obj2);
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
