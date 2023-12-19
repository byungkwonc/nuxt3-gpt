<script setup lang="ts">
import { type chatlist } from '@/types/openai'
import User from '@/components/svg/user.vue'
import Assistant from '@/components/svg/assistant.vue'
import Letter from '@/components/svg/letter.vue'

const conversation = ref<Array<chatlist>>([]) // 대화를 담을 배열
const prompt = ref('') // 서버에 넘겨줄 질문

const contentList = ref<HTMLUListElement | null>(null) // ul element
const loading = ref<boolean>(false) // 로딩 상태
const height = computed(() => {
  // 프롬프트에 개행이 포함된경우 textarea 높이값을 자동으로 보정하자
  if (prompt.value) {
    const row = prompt.value.match(/\n/g)
    if (row) {
      return `${3 + (row.length * 1.5)}rem`
    }
  }
  return '3rem'
})

async function quest() {
  console.log('[/pages/index] 질문버튼눌림')
  const string = prompt.value
  conversation.value.push({role: 'user', content: string})
  console.log('[/pages/index] 입력된질문:' + conversation)
  loading.value = true
  prompt.value = ''
  setTimeout(() => {
    if (contentList) {
      // 질문 후 스크롤을 최하단으로 이동시키기
      contentList.value?.scrollTo(0, contentList.value.scrollHeight)
    }
  }, 500) // 추가되는 시점을 보정하기위해 0.5초 지연

  const data = await $fetch('/api/client', {
    method: 'POST',
    body: { prompt: string }
  }).catch((err) => {
    alert('실패!')
    console.log(err)
  })

  loading.value = false // 로딩종료
  if (data?.result) {
    conversation.value.push(data.result)
    console.log('[/pages/index] 리번받은답변:' + conversation)
  }

  if (contentList) {
    // 답변 추가후 스크롤 최하단 이동
    contentList.value?.scrollTo(0, contentList.value.scrollHeight)
  }
}

function enterSubmit (e: KeyboardEvent) {
  // 엔터로 전송하기
  if (!e.shiftKey) {
    // 시프트키 없이 입력된경우만
    e.preventDefault()
    if (prompt.value) {
      // 질문이 있는경우에만 전송
      quest()
    }
  }
}
</script>

<template>
  <div class="grid w-full h-full align-top">
    <ul
      ref="contentList"
      class="w-full max-h-screen overflow-auto"
    >
      <li
        v-for="(list, index) in conversation"
        :key="index"
        class="px-5 py-8"
        :class="{
          'bg-gray-100': list.role == 'assistant',
          'border-t': list.role == 'assistant',
          'border-b': list.role == 'assistant',
        }"
      >
        <div class="flex gap-5 max-w-screen-lg mx-auto align-baseline">
          <div class="w-8">
            <User
              v-show="list.role == 'user'"
              class="w-8 h-8 fill-blue-500"
            />
            <Assistant
              v-show="list.role == 'assistant'"
              class="w-8 h-8 bg-green-500"
            />
          </div>
          <p class="flex-auto pt-0 whitespace-pre-wrap">
            {{ list.content }}
          </p>
        </div>
      </li>
      <li
        v-show="loading"
        class="px-5 py-8 bg-gray-100 border-t border-b"
      >
        <div class="flex gap-5 max-w-screen-lg mx-auto align-baseline">
          <div class="w-8">
            <Assistant class="w-8 h-8 bg-green-500" />
          </div>
          <i class="mt-3 loader">loading</i>
        </div>
      </li>
    </ul>
    <div class="flex w-full mt-auto justify-center">
      <div class="w-full max-w-screen-lg mb-3 resize-none relative">
        <textarea
          v-model="prompt"
          class="w-full p-3 resize-none border border-gray-200 rounded shadow focus:shadow-xl outline-none overflow-hidden"
          :style="{height: height}"
          placeholder="무엇이든 질문하세요!"
          @keydown.enter="enterSubmit($event)"
        >prompt</textarea>
        <button
          class="px-3 py-2 hover:bg-gray-100 rounded absolute top-1/2 transform -translate-y-1/2 right-3"
          type="button"
          @click="quest"
        >
          <Letter class="w-4 h-4 fill-gray-500" />
        </button>
      </div>
    </div>
  </div>
</template>

<!--
<template>
  <ul class="p-5">
    <li v-for="(list, index) in conversation" :key="index"> {{ list }} </li>
  </ul>

  <fieldset>
    <textarea v-model="prompt" class="border">prompt</textarea>
    <button type="button" @click="quest()"> 질문 </button>
  </fieldset>
</template>
-->
<!--
<script setup lang="ts">
const count = ref(0)

async function countUp () {
  count.value++

  // server/api/hello.ts 생성후 추가
  const result = await $fetch("/api/hello")
  console.log(result)
}
</script>

<template>
  <div class="mt-20 text-center">
    <p>{{ count }}</p>
    <button type="button" @click="countUp()">UP!</button>
  </div>
</template>
-->
