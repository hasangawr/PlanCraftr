const mapObject = <T, U>(source: T, mapping: (source: T) => U): U => {
  return mapping(source);
};

export default mapObject;
