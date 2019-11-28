export function isvalidMoblie (str) {
  const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
  return reg.test(str)
}

// 不能输入中文
export function isvalidChinaese (str) {
  const reg = /^[a-zA-Z0-9_]+$/g;
  return reg.test(str)
}

export function checkInclude (Array1, Array2) {
  let Array3 = []
  for (let i = 0; i < Array1.length; i++) {
    if (Array2.includes(Array1[i])) {
      Array3.push(Array1[i])
    }
  }
  return Array3.length === Array2.length;
}
