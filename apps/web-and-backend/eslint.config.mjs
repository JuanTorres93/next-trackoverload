import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
  {
    files: ["src/**/*.{ts,tsx,js,jsx}"],
    rules: {
      "no-restricted-syntax": [
        "warn",
        {
          selector:
            "BinaryExpression[operator=/^(===|==|!==|!=)$/][left.object.object.name='process'][left.object.property.name='env'][left.property.name='NODE_ENV'][right.value='test']",
          message:
            "Avoid direct NODE_ENV test checks. Use isTestRuntime() from application-layer/utils/isTestRuntime instead.",
        },
      ],
    },
  },
  {
    files: ["src/application-layer/utils/isTestRuntime.ts"],
    rules: {
      "no-restricted-syntax": "off",
    },
  },
];

export default eslintConfig;
