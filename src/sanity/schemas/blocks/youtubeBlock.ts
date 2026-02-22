import { defineField, defineType } from 'sanity'

export const youtubeBlock = defineType({
  name: 'youtubeBlock',
  title: '유튜브 영상',
  type: 'object',
  fields: [
    defineField({
      name: 'url',
      title: '유튜브 링크',
      type: 'url',
      description: '유튜브에서 영상 링크를 복사하여 붙여넣으세요. (공유 링크, 라이브 링크 모두 가능)',
      validation: (rule) =>
        rule
          .required()
          .uri({ scheme: ['https', 'http'] })
          .custom((url) => {
            if (!url) return '유튜브 링크를 입력해주세요.'
            const pattern = /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\//
            return pattern.test(url) || '유효한 유튜브 링크를 입력해주세요.'
          }),
    }),
    defineField({
      name: 'caption',
      title: '영상 설명',
      type: 'string',
      description: '영상 아래에 표시되는 짧은 설명입니다. (선택사항)',
    }),
  ],
  preview: {
    select: { title: 'caption', subtitle: 'url' },
    prepare: ({ title, subtitle }) => ({
      title: title || '유튜브 영상',
      subtitle,
    }),
  },
})
