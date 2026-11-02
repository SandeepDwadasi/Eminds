// Cucumber configuration. Profiles can be selected with `cucumber-js -p <name>`.
const common = {
  paths: ['features/**/*.feature'],
  requireModule: ['tsx/cjs'],
  require: ['src/support/**/*.ts', 'src/steps/**/*.ts'],
  format: [
    'progress-bar',
    'html:reports/cucumber-report.html',
    'json:reports/cucumber-report.json',
    'rerun:reports/rerun.txt',
    'allure-cucumberjs/reporter',
  ],
  formatOptions: {
    snippetInterface: 'async-await',
    resultsDir: 'allure-results',
  },
  parallel: Number(process.env.PARALLEL ?? 1),
  retry: Number(process.env.RETRY ?? 0),
};

module.exports = {
  default: common,
  ci: { ...common, parallel: 2, retry: 1 },
};
