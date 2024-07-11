export const encrypt = (text: string) => {
  const base64 = btoa(unescape(encodeURIComponent(text)));
  return base64;
}
