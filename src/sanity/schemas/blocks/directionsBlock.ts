import { defineField, defineType } from 'sanity'

export const directionsBlock = defineType({
  name: 'directionsBlock',
  title: '오시는 길',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: '섹션 제목',
      type: 'string',
      description: '홈페이지에 표시되는 이 섹션의 제목입니다.',
      initialValue: '오시는 길',
    }),
    defineField({
      name: 'address',
      title: '교회 주소',
      type: 'string',
      description: '예: 경남 진주시 남문동 123-4',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'phone',
      title: '전화번호',
      type: 'string',
      description: '예: 055-123-4567',
    }),
    defineField({
      name: 'transitInfo',
      title: '대중교통 안내',
      type: 'text',
      rows: 4,
      description: '버스 노선, 지하철 등 대중교통 이용 방법을 작성하세요. (선택사항)',
    }),
    defineField({
      name: 'mapCoordinates',
      title: '지도 좌표',
      type: 'object',
      description: '카카오맵 연동을 위한 좌표입니다. 네이버/카카오 지도에서 좌표를 확인할 수 있습니다.',
      fields: [
        defineField({
          name: 'lat',
          title: '위도',
          type: 'number',
          description: '예: 35.1798',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'lng',
          title: '경도',
          type: 'number',
          description: '예: 128.0842',
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
