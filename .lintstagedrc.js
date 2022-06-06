module.exports = {
  "*.ts": [
    "prettier --write",
    () => 'tsc -p tsconfig.json --noEmit',
    "eslint --fix"
  ],
  "*.tf": [
    () => 'terraform fmt terraform'
  ],
  "*.{md, json}": [
    "prettier --write"
  ],
  "CHANGELOG.md": [
    "kacl lint"
  ],
  ".circleci/config.yml": [
    "circleci config validate"
  ]
};
