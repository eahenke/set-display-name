const { Parser } = require('acorn')
const estraverse = require('estraverse')
const escodegen = require('escodegen')

const { FUNC_DEC } = require('./constants/types')

module.exports = function(source) {
  const parsedFile = Parser.parse(source, {sourceType: 'module'})  

  estraverse.traverse(parsedFile, {
    enter: (node, parent) => {
      const body = []

      if(!node.body) return
      let parsedBody = node.body
      if(!Array.isArray(parsedBody)) parsedBody = [node.body]

      parsedBody.forEach((n) => {
        body.push(n)
        if(n.type === FUNC_DEC) {
          const name = n.id.name  
          if(name) body.push(Parser.parse(`${name}.displayName = '${name}'`))
      })
      if(body.length) node.body = body
    }
  })

  return escodegen.generate(parsedFile)
}