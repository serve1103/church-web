import { defineField, defineType } from 'sanity'

export const youtubeBlock = defineType({
  name: 'youtubeBlock',
  title: 'YouTube 영상',
  type: 'object',
  fields: [
    defineField({
      name: 'url',
      title: 'YouTube URL',
      type: 'url',
      validation: (rule) =>
        rule
          .required()
          .uri({ scheme: ['https', 'http'] })
          .custom((url) => {
            if (!url) return 'YouTube URL을 입력해주세요.'
            const pattern = /^https?:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)/
            return pattern.test(url) || '유효한 YouTube URL을 입력해주세요.'
          }),
    }),
    defineField({
      name: 'caption',
      title: '캡션',
      type: 'string',
    }),
  ],
  preview: {
    select: { title: 'caption', subtitle: 'url' },
    prepare: ({ title, subtitle }) => ({
      title: title || 'YouTube 영상',
      subtitle,
    }),
  },
})
