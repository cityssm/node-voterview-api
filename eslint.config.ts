import configPackage, {
  defineConfig
} from 'eslint-config-cityssm/eslint.packageConfig.js'

export const config = defineConfig(configPackage, {
  files: ['**/*.ts'],
  languageOptions: {
    parserOptions: {
      projectService: true
    }
  },
  rules: {
    '@typescript-eslint/no-unsafe-type-assertion': 'off',
    'perfectionist/sort-union-types': 'off'
  }
})

export default config
