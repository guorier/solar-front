export const setCookie = (name: string, value: string, days = 30) => {
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; Expires=${expires}; Path=/; SameSite=Lax`;
};

export const getCookie = (name: string) => {
  const cookies = document.cookie.split('; ').map((v) => v.split('='));
  const found = cookies.find(([k]) => k === name);
  return found ? decodeURIComponent(found[1] ?? '') : undefined;
};

export const deleteCookie = (name: string) => {
  document.cookie = `${name}=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/; SameSite=Lax`;
};
