export function fetchCountries(name) {
  const BASE_URL = 'https://restcountries.com/v3.1';
  const END_POINT = `/name/${name}`;
  const PARAMS = '?fields=name,capital,population,flags,languages';
  return fetch(BASE_URL + END_POINT + PARAMS).then(res => {
    if (!res.ok) {
      throw new Error('Not found!');
    }
    return res.json();
  });
}
