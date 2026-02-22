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
      description: '예: 담임목사, 부목사, 전도사',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'photo',
      title: '프로필 사진',
      type: 'image',
      options: { hotspot: true },
      description: '정사각형에 가까운 사진이 가장 잘 보입니다.',
    }),
    defineField({
      name: 'bio',
      title: '소개글',
      type: 'text',
      rows: 3,
      description: '약력이나 인사말을 작성해주세요. (선택사항)',
    }),
    defineField({
      name: 'order',
      title: '표시 순서',
      type: 'number',
      description: '숫자가 작을수록 먼저 표시됩니다. (예: 담임목사=1, 부목사=2)',
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
