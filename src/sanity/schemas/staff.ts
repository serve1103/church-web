import { defineField, defineType } from 'sanity'

export const staff = defineType({
  name: 'staff',
  title: '사역자',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: '이름',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'position',
      title: '직분',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'photo',
      title: '사진',
      type: 'image',
      options: { hotspot: true },
      description: '사역자 프로필 사진을 등록해주세요.',
    }),
    defineField({
      name: 'bio',
      title: '소개',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'order',
      title: '정렬 순서',
      type: 'number',
      description: '숫자가 작을수록 먼저 표시됩니다.',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'position',
      media: 'photo',
    },
  },
})
