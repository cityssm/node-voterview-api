import eslintCspell from '@cspell/eslint-plugin';
import configPackage, { defineConfig } from 'eslint-config-cityssm/eslint.packageConfig.js';
import { cspellWords } from 'eslint-config-cityssm/exports';
export const config = defineConfig(configPackage, {
    files: ['**/*.ts'],
    languageOptions: {
        parserOptions: {
            projectService: true
        }
    },
    plugins: {
        '@cspell': eslintCspell
    },
    rules: {
        '@cspell/spellchecker': [
            'warn',
            {
                cspell: {
                    words: [...cspellWords, 'colour', 'voterview']
                }
            }
        ],
        '@typescript-eslint/no-unsafe-type-assertion': 'off',
        'perfectionist/sort-union-types': 'off'
    }
});
export default config;
