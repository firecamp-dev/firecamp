export const setInputType = (type: string) => {
  return type === 'password'
    ? 'password'
    : type === 'timestamp'
    ? 'number'
    : 'text';
};
