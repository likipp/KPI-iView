export function isvalidMoblie (str) {
  const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
  return reg.test(str)
}

// 不能输入中文
export function isvalidChinaese (str) {
  const reg = /^[a-zA-Z0-9_]+$/g
  return reg.test(str)
}
