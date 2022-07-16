export function formatPhoneNumber(input: string) {
  const digits = removeNonDigits(input);
  const digitsArray = digits.split('');
  return digitsArray
    .map((v, i) => {
      if (i === 0) return `(${v}`;
      if (i === 2) return `${v}) `;
      if (i === 5) return `${v}-`;
      return v;
    })
    .join('');
}

export function formatToTitleCase(value: string) {
  return `${value[0].toUpperCase()}${value.slice(1)}`;
}

export function getUrlParam(param: string | string[] | undefined) {
  if (!param) return '';
  return Array.isArray(param) ? param[0] : param;
}

export function removeNonDigits(input: string) {
  return input.replace(/\D/g, '');
}
