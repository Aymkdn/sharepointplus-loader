/*const RuleSet = require('webpack/lib/RuleSet');

class SharepointPlusLoaderPlugin {
  constructor (options) {
    this.options = options || {}
  }

  apply (compiler) {
    // use webpack's RuleSet utility to normalize user rules
    const rawRules = compiler.options.module.rules;
    const { rules } = new RuleSet(rawRules);
    //rules.forEach(rule => {
    //  console.log(JSON.stringify(rule))
    //});

    const jsRuleIndex = rules.findIndex(rule => rule.test && rule.use.find(u => u.ident === 'vue-loader-options'))
    rules.unshift({
      test:/.*js/i,
      use:[
        {
          loader: require.resolve('./loader')
        }
      ]
    })

    compiler.options.module.rules = rules;
  }
}
*/

const RuleSet = require('webpack/lib/RuleSet')
let sharepointPlusLoaderPath
try {
  sharepointPlusLoaderPath = require.resolve('vue-loader')
} catch (err) {}

class SharepointPlusLoaderPlugin {
  constructor (options) {
    this.options = options || {}
  }

  apply (compiler) {
    // use webpack's RuleSet utility to normalize user rules
    const rawRules = compiler.options.module.rules
    const { rules } = new RuleSet(rawRules)

    // find the rule that applies to vue files
    /*
    const myRuleIndex = rules.findIndex(rule => rule.test && regexp.test(rule.test));
    console.log("myRuleIndex ===>>>> ",myRuleIndex);
    const myRule = rules[myRuleIndex];

    if (!myRule) {
      throw new Error(
        `[SharepointPlusLoaderPlugin Error] No matching rule for sharepointplus-loader found.\n` +
        `Make sure there is at least one root-level rule that uses sharepointplus-loader.`
      )
    }

    myRule.use.unshift({
      loader: require.resolve('./loader'),
      options: {}
    })*/
    const regexp = new RegExp("\.vue$|\.jsx?$|\.ts$");
    const myRuleIndex = rules.findIndex(rule => rule.test && regexp.test(rule.test));
    compiler.options.module.rules.unshift({
      test:regexp,
      loader:require.resolve('./loader')
    })
  }
}

module.exports = SharepointPlusLoaderPlugin
