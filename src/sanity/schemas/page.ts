import { defineField, defineType } from 'sanity'

export const page = defineType({
  name: 'page',
  title: '페이지',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: '페이지 제목',
      type: 'string',
      description: '홈페이지에 표시될 페이지 이름입니다.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: '페이지 주소',
      type: 'slug',
      description: '홈페이지 URL 경로입니다. 제목 입력 후 "Generate" 버튼을 눌러 자동 생성하세요. 홈페이지는 반드시 "home"으로 설정해야 합니다.',
      options: { source: 'title', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'seoDescription',
      title: '검색엔진 설명',
      type: 'text',
      rows: 2,
      description: '네이버/구글 검색 결과에 표시되는 페이지 설명입니다. 160자 이내 권장.',
      validation: (rule) => rule.max(200),
    }),
    defineField({
      name: 'blocks',
      title: '페이지 블록',
      type: 'array',
      description: '페이지를 구성하는 블록들입니다. 아래 "Add item" 버튼으로 원하는 블록을 추가하세요.',
      of: [
        { type: 'heroBlock' },
        { type: 'worshipInfoBlock' },
        { type: 'latestSermonBlock' },
        { type: 'noticeListBlock' },
        { type: 'directionsBlock' },
        { type: 'youtubeBlock' },
        { type: 'textBlock' },
        { type: 'imageGalleryBlock' },
        { type: 'staffBlock' },
        { type: 'timelineBlock' },
        { type: 'quickLinkBlock' },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'slug.current',
    },
  },
})
