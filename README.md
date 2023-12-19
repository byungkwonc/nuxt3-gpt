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

touch .eslintrc.js

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
    '@nuxtjs/tailwindcss', // 추가해준다
  ],
  css: [ // 추가해준다
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
# assets\css\app.css
@import './preflight.css';
@import './custom.css';

# assets\css\preflight.css
@tailwind base;
@tailwind components;
@tailwind utilities;

# assets\css\custom.css
@layer components {
}

```

## directory

### Nuxt Directory Structure
- 프로젝트의 구조는 아래를 참고 한다
```bash
https://nuxt.com/docs/guide/directory-structure/app
```

### app.vue

### pages/index.vue

### server/api/hello.ts

## openai

### package

```bash
yarn add openai

# types/openai.ts
interface chatlist {
    role: 'user'|'assistant'|'system',
    content: string
}

export {
    chatlist
}
```

### server/lib/openai.ts



### server/api/client.post.ts

```bash
import { chat } from '@/server/lib/openai'
import { type chatlist } from '@/types/openai'

const conversation: Array<chatlist> = [] // 나눈 대화를 저장해서 기억하도록 함

export default defineEventHandler(async (event) => {
  // GPT에게 물어보기
  const body = await readBody(event)
  if (body.prompt) {
    // result값이 들어갔을때 배열에 저장
    console.log('[/server/api/client.post] 질문내용 : ' + body.prompt)
    conversation.push({role: 'user', content: body.prompt})

    // 질문던지기
    const quest = await chat(conversation)
    if (quest) {
      // 답변이 정상적으로 왔다면 리턴
      conversation.push({role: 'assistant', content: JSON.stringify(quest)})
      return {
        result: quest,
      }
    }
  } else {
    // 질문이 없는경우
    throw createError({
      statusCode: 400,
      statusMessage: '질문이 입력되지 않았습니다.',
    })
  }
})
```

### pages/index.vue

```bash
<script setup lang="ts">
import { type chatlist } from '@/types/openai'
const conversation = ref<Array<chatlist>>([]) // 대화를 담을 배열
const prompt = ref('') // 서버에 넘겨줄 질문

async function quest () {
  console.log('[/pages/index] 질문버튼눌림')
  const string = prompt.value
  conversation.value.push({role: 'user', content: string})
  console.log('[/pages/index] 입력된질문:' + conversation)
  prompt.value = ''
  const data = await $fetch('/api/client', {
    method: 'POST',
    body: { prompt: string }
  }).catch((err) => {
    alert('실패!')
    console.log(err)
  })

  if (data?.result) {
    conversation.value.push(data.result)
    console.log('[/pages/index] 리번받은답변:' + conversation)
  }
}
</script>

<template>
  <ul class="p-5">
    <li v-for="(list, index) in conversation" :key="index"> {{ list }} </li>
  </ul>

  <fieldset>
    <textarea v-model="prompt" class="border">prompt</textarea>
    <button type="button" @click="quest()"> 질문 </button>
  </fieldset>
</template>
```



