// yarn add dotenv
import dotenv from "dotenv"
import OpenAI from "openai"
import { type chatlist } from '@/types/openai'

dotenv.config()

export async function chat(messages: Array<chatlist>) {

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_SECRET_KEY,
  })
  console.log('[/server/lib/openai] 질문시작')
  
  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: messages,
  }).catch((err) => {
    console.log(err)
  })

  if (completion) {
    console.log('[/server/lib/openai] 답변종료 : ' + JSON.stringify(completion.choices[0].message))
    return Promise.resolve(completion.choices[0].message)
  }
}