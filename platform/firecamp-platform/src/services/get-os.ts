// TODO: Default value need to define
export default (): string | any => {
  if (navigator.appVersion.indexOf('Win') !== -1) return 'Windows';
  if (navigator.appVersion.indexOf('Mac') !== -1) return 'MacOS';
  if (navigator.appVersion.indexOf('X11') !== -1) return 'UNIX';
  if (navigator.appVersion.indexOf('Linux') !== -1) return 'Linux';
  return 'Linux';
};
