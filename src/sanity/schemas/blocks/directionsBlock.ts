import { defineField, defineType } from 'sanity'

export const directionsBlock = defineType({
  name: 'directionsBlock',
  title: '오시는 길',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: '제목',
      type: 'string',
      initialValue: '오시는 길',
    }),
    defineField({
      name: 'address',
      title: '주소',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'phone',
      title: '전화번호',
      type: 'string',
    }),
    defineField({
      name: 'transitInfo',
      title: '대중교통 안내',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'mapCoordinates',
      title: '지도 좌표',
      type: 'object',
      fields: [
        defineField({
          name: 'lat',
          title: '위도',
          type: 'number',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'lng',
          title: '경도',
          type: 'number',
          validation: (rule) => rule.required(),
        }),
      ],
    }),
  ],
  preview: {
    select: { title: 'heading', subtitle: 'address' },
    prepare: ({ title, subtitle }) => ({
      title: title || '오시는 길',
      subtitle,
    }),
  },
})
