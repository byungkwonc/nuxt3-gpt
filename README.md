# slack GPT chat with Nuxt.js and openai api

## nuxt 서버설정

```bash
npx nuxi@latest init nuxt3-gpt
cd nuxt3-gpt

# yarn
yarn install

# Development Server
# Start the development server on `http://localhost:3000`:
yarn dev

# Production
yarn build

#Locally preview production build:
yarn preview
```

## eslint

### nuxt modules

```bash
npm install -g eslint
eslint --init

# eslint
yarn add -D eslint @nuxtjs/eslint-module
```

### nuxt.config.ts

```bash
export default defineNuxtConfig({
    modules: [
        '@nuxtjs/eslint-module'
    ]
})
```

### plugins

```bash
yarn add -D eslint-plugin-nuxt eslint-plugin-vue
yarn add -D @typescript-eslint/eslint-plugin @typescript-eslint/parser typescript
```

### .eslintrc.js

```bash
module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:nuxt/recommended",
    "plugin:vue/vue3-recommended",
  ],
  parserOptions: {
    ecmaVersion: "latest",
    parser: "@typescript-eslint/parser",
    sourceType: "module",
  },
  rules: {
    'vue/multi-word-component-names': 0,
  },
}
```

## tailwindcss

### nuxt modules

```bash
# tailwindcss
yarn add -D @nuxtjs/tailwindcss
```

### nuxt.config.ts

```bash
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/eslint-module',
    '@nuxtjs/tailwindcss',
  ],
  css: [
    '@/assets/css/app.css',
  ],
})
```

### tailwind.config.ts

```bash
npx tailwindcss init --ts

# tailwind.config.ts
import type { Config } from 'tailwindcss'

export default {
  content: ['app.vue'],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config
```

### css

```bash
# /assets/css/app.css
# /assets/css/preflight.css
# /assets/css/custom.css
```

## directory

### Nuxt Directory Structure
- 프로젝트의 구조는 아래를 참고 한다
- https://nuxt.com/docs/guide/directory-structure/app

### app.vue
- application main
- ```pages/``` directory가 없을 경우, router dependency가 없음

### pages/index.vue
- ```pages/``` directory 가 있으면 ```index.vue```가 application의 ```/```가 된다
- api,gpt용 화면

### server/api/hello.ts
- ```pages/index.vue```에서 api test 해본다

```bash
<script setup lang="ts">
......
  const result = await $fetch("/api/hello")
  console.log(result)
......
</script>
```

## openai

### package

```bash
yarn add openai
```

### server/lib/openai.ts
- gpt 질문/답변


### server/api/client.post.ts
- client의 질문을 gpt에게 물어보고 답변을 client에게 되돌려 줌
- Array로 대화 기억

```bash
# types/openai.ts
interface chatlist {
    role: 'user'|'assistant'|'system',
    content: string
}

export {
    chatlist
}
```


