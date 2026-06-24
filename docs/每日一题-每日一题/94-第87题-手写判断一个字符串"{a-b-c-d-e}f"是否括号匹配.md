# 第87题 手写判断一个字符串"{a(b[c]d)e}f"是否括号匹配
```js
    /**
     * 判断是否括号匹配
     * @param str str
     */
    function matchBracket(str) {
        const length = str.length
        if (length === 0) return true
    
        const stack = []
    
        const leftSymbols = '{[('
        const rightSymbols = '}])'
    
        for (let i = 0; i < length; i++) {
            const s = str[i]
    
            if (leftSymbols.includes(s)) {
                // 左括号，压栈
                stack.push(s)
            } else if (rightSymbols.includes(s)) {
                // 右括号，判断栈顶（是否出栈）
                const top = stack[stack.length - 1]
                if (isMatch(top, s)) {
                    stack.pop()
                } else {
                    return false
                }
            }
        }
    
        return stack.length === 0
    }
    
    /**
     * 判断左右括号是否匹配
     * @param left 左括号
     * @param right 右括号
     */
    function isMatch(left, right) {
      if (left === '{' && right === '}') return true
      if (left === '[' && right === ']') return true
      if (left === '(' && right === ')') return true
      return false
    }
    
    // 功能测试
    // const str = '{a(b[c]d)e}f'
    // console.log(matchBracket(str))
```

> 利用栈先进后出的思想实现括号匹配，时间复杂度`O(n)`，空间复杂度`O(n)`
