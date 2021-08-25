// https://medium.com/trainingcenter/mascara-de-cpf-com-react-javascript-a07719345c93
export const mask = cpf => {
  if (!cpf) return ''

  return cpf
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1')
}

export const sanitize = cpf => {
  if (!cpf) return ''

  return cpf.match(/\d/g).join('')
}

export const format = cpf =>
  cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')

export const validate = cpf => {
  if (!cpf || cpf.length !== 11 || cpf === '00000000000000') {
    return false
  }
  let sum = 0
  let leftOvers
  for (let i = 1; i <= 9; i++) {
    sum = sum + parseInt(cpf.substring(i - 1, i), 10) * (11 - i)
  }
  leftOvers = (sum * 10) % 11
  if (leftOvers === 10 || leftOvers === 11) {
    leftOvers = 0
  }
  if (leftOvers !== parseInt(cpf.substring(9, 10), 10)) {
    return false
  }
  sum = 0
  for (let i = 1; i <= 10; i++) {
    sum = sum + parseInt(cpf.substring(i - 1, i), 10) * (12 - i)
  }
  leftOvers = (sum * 10) % 11
  if (leftOvers === 10 || leftOvers === 11) {
    leftOvers = 0
  }
  if (leftOvers !== parseInt(cpf.substring(10, 11), 10)) {
    return false
  }
  return true
}
