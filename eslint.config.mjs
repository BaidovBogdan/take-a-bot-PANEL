import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
	baseDirectory: __dirname,
});

const eslintConfig = [
	...compat.config({
		extends: ['next'],
		rules: {
			'react/no-unescaped-entities': 'off',
			'@next/next/no-page-custom-font': 'off',
			'react/display-name': 'off', // Disable the 'display-name' rule
			'react-hooks/exhaustive-deps': 'off', // Disable 'exhaustive-deps' rule
			'react-hooks/rules-of-hooks': 'off', // Disable 'rules-of-hooks' warning
			'react/prop-types': 'off',
		},
	}),
];

export default eslintConfig;
