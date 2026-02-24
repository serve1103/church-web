import { defineField, defineType } from 'sanity'

export const sermon = defineType({
  name: 'sermon',
  title: '설교',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: '설교 제목',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: '페이지 주소',
      type: 'slug',
      description: '제목 입력 후 "Generate" 버튼을 눌러 자동 생성하세요.',
      options: { source: 'title', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'date',
      title: '설교 날짜',
      type: 'date',
      description: '설교가 진행된 날짜를 선택하세요.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      title: '예배 분류',
      type: 'string',
      description: '해당 설교가 어떤 예배에서 진행되었는지 선택하세요.',
      options: {
        list: [
          { title: '주일오전설교', value: 'sunday' },
          { title: '주일오후세미나', value: 'seminar' },
          { title: '수요예배설교', value: 'wednesday' },
          { title: '새벽예배설교', value: 'dawn' },
          { title: '특별예배설교', value: 'special' },
          { title: '3분 메시지', value: 'message' },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'preacher',
      title: '설교자',
      type: 'string',
      description: '설교자 이름을 입력하세요. (예: 김목사)',
    }),
    defineField({
      name: 'bibleText',
      title: '성경본문',
      type: 'string',
      description: '예: 요한복음 3:16-18',
    }),
    defineField({
      name: 'youtubeUrl',
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
      name: 'thumbnail',
      title: '썸네일 이미지',
      type: 'image',
      options: { hotspot: true },
      description: '직접 지정하지 않으면 유튜브 썸네일이 자동으로 사용됩니다.',
    }),
    defineField({
      name: 'description',
      title: '설교 요약',
      type: 'text',
      rows: 3,
      description: '설교 내용을 간단히 요약해주세요. (선택사항)',
    }),
  ],
  orderings: [
    {
      title: '날짜 (최신순)',
      name: 'dateDesc',
      by: [{ field: 'date', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      date: 'date',
      category: 'category',
      preacher: 'preacher',
      media: 'thumbnail',
    },
    prepare({ title, date, category, preacher, media }) {
      const categoryLabels: Record<string, string> = {
        sunday: '주일오전',
        seminar: '주일오후',
        wednesday: '수요',
        dawn: '새벽',
        special: '특별',
        message: '3분',
      }
      const label = category ? categoryLabels[category] || category : ''
      const parts = [label, preacher, date].filter(Boolean)
      return {
        title,
        subtitle: parts.join(' · '),
        media,
      }
    },
  },
})
