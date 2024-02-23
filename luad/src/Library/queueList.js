export const addToQueue = (object, list, listMethod) => {
  if (!object) {
    console.error("Object is empty: ", object);
  }
  listMethod([...list, object]);
};
