import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'
import nextTypeScript from 'eslint-config-next/typescript'

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypeScript,
  {
    ignores: [
      '.next/**',
      'out/**',
      'build/**',
      'tmp/**',
      'public/**',
      'next-env.d.ts',
      'next-sitemap.config.js',
    ],
  },
]

export default eslintConfig
