const RuleSet = require('webpack/lib/RuleSet')

class SharepointPlusLoaderPlugin {
  constructor (options) {
    this.options = options || {}
  }

  apply (compiler) {
    // use webpack's RuleSet utility to normalize user rules
    const rawRules = compiler.options.module.rules
    const { rules } = new RuleSet(rawRules)

    // supported files extension: .js, .jsx, .vue, .ts
    const regexp = new RegExp("\.vue$|\.jsx?$|\.ts$");
    const myRuleIndex = rules.findIndex(rule => rule.test && regexp.test(rule.test));
    compiler.options.module.rules.unshift({
      test:regexp,
      loader:require.resolve('./loader')
    })
  }
}

module.exports = SharepointPlusLoaderPlugin
