function flattenObject(obj, prefix = "") {
  let flattened = {};
  for (let key in obj) {
    if (typeof obj[key] === "object" && obj[key] !== null) {
      Object.assign(flattened, flattenObject(obj[key], `${prefix}${key}_`));
    } else {
      flattened[`${prefix}${key}`] = obj[key];
    }
  }
  return flattened;
}

export function sortByMatch(documentList, query) {
  let sortedList = [];

  const flattenedObjectList = documentList.forEach((document) => {
    return flattenObject(document);
  });

  return sortedList;
}
