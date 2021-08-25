// [0-9]{6}\-?[A-Ja-j]
export const mask = ra => {
  if (!ra) return ''

  return ra
    .replace(/^(\d{0,5})(\D)\d{0,6}$/g, '$1')
    .replace(/(\d{6})(?![A-Ja-j])./, '$1')
    .replace(/(\d{6})([A-Ja-j])/, '$1-$2')
    .replace(/(-[A-Ja-j]).+?$/, '$1')
    .toUpperCase()
}

export const sanitize = ra => ra.replace(/-/g, '')

export const format = ra => ra.replace(/([0-9]{6})([A-Ja-j])/, '$1-$2')

export const validate = ra => {
  if (!ra || ra.length !== 7 || ra === '012345G') {
    return false
  }

  const base = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']

  let cv = 0
  for (let i = 0; i < 6; ++i) {
    cv += parseInt(ra[i], 10)
  }
  ++cv
  cv %= 10

  if (ra[6].toUpperCase() !== base[cv]) {
    return false
  }

  return true
}
