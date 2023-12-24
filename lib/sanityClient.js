import sanityClient from '@sanity/client'


export const client = sanityClient({
  projectId: '7w5kh9gi',
  dataset: 'production',
  apiVersion: '2021-03-25',
  token:
    'skCdOCZVcA1lv4sPNwpKhSYMIepS1pL2CwEITsRQ6McOdliUw4pjmBEaCdKMQSwG1l6hhv8KAdDQmsjPwNE2Cb6yWzlq46toCuU1ChiLjAJG4t8He8DK4dHyrQeOYsBd1LpHaLDm8UWdLMXXH0Tg5EIxJikv6TsIDJnVtJ0KdazG3mgNeMBb',
  useCdn: false,
})  