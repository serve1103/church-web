import { defineField, defineType } from 'sanity'
import ExtraFieldsInput from '../components/ExtraFieldsInput'

export const newFamily = defineType({
  name: 'newFamily',
  title: '새가족',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: '이름',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'photo',
      title: '사진',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'date',
      title: '등록일',
      type: 'date',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'registrationNumber',
      title: '등록번호',
      type: 'string',
      description: '예: 2025-33',
    }),
    defineField({
      name: 'extraFields',
      title: '추가 정보',
      type: 'array',
      description: '"새가족 > 새가족 설정"에서 정의한 항목을 자동으로 표시합니다.',
      components: {
        input: ExtraFieldsInput,
      },
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'label',
              title: '항목명',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'value',
              title: '내용',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: 'label', subtitle: 'value' },
          },
        },
      ],
    }),
  ],
  orderings: [
    {
      title: '등록일 (최신순)',
      name: 'dateDesc',
      by: [{ field: 'date', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'registrationNumber',
      date: 'date',
      media: 'photo',
    },
    prepare({ title, subtitle, date, media }) {
      const displayTitle = subtitle ? `${subtitle} ${title}` : title
      return {
        title: displayTitle,
        subtitle: date,
        media,
      }
    },
  },
})
