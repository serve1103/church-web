import { defineType, defineField } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: '사이트 설정',
  type: 'document',
  fields: [
    defineField({
      name: 'churchName',
      title: '교회 이름',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'logo',
      title: '교회 로고',
      type: 'image',
      description: '헤더에 표시될 교회 로고 이미지입니다. 투명 배경(PNG) 권장.',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'address',
      title: '주소',
      type: 'string',
    }),
    defineField({
      name: 'phone',
      title: '전화번호',
      type: 'string',
    }),
  ],
  preview: {
    prepare() {
      return { title: '사이트 설정' }
    },
  },
})
