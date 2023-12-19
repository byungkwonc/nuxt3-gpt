export default defineEventHandler(() => {
  console.log('server hello?')
  return {
    data: 'client hello!'
  }
})