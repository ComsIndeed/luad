export const handleInputChange = (property, value, state) => {
  state[1]({
    ...state[0],
    [property]: value,
  });
};

export const createNewObjectFrom = (newProperties, fromObject) => {
  const newKeys = Object.keys(newProperties);
  let objectToReturn = {
    ...fromObject,
  };
  newKeys.forEach((key) => {
    objectToReturn = {
      ...objectToReturn,
      [key]: newProperties[key],
    };
  });

  return objectToReturn;
};
