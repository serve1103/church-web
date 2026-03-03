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
    defineField({
      name: 'email',
      title: '이메일',
      type: 'string',
    }),
    defineField({
      name: 'socialLinks',
      title: 'SNS 링크',
      description: '교회 SNS 계정 링크를 입력하면 홈페이지 하단에 아이콘 버튼이 표시됩니다.',
      type: 'object',
      fields: [
        defineField({
          name: 'youtube',
          title: 'YouTube',
          type: 'url',
          description: 'YouTube 채널 URL (예: https://www.youtube.com/@남문교회)',
        }),
        defineField({
          name: 'instagram',
          title: 'Instagram',
          type: 'url',
          description: 'Instagram 프로필 URL',
        }),
        defineField({
          name: 'facebook',
          title: 'Facebook',
          type: 'url',
          description: 'Facebook 페이지 URL',
        }),
        defineField({
          name: 'blog',
          title: '블로그',
          type: 'url',
          description: '네이버 블로그 등 블로그 URL',
        }),
        defineField({
          name: 'kakao',
          title: '카카오톡 채널',
          type: 'url',
          description: '카카오톡 채널 URL (예: https://pf.kakao.com/...)',
        }),
      ],
    }),
    defineField({
      name: 'newFamilyDisplayMonths',
      title: '새가족 표시 기간 (개월)',
      type: 'number',
      description: '등록일 기준으로 몇 개월간 새가족을 표시할지 설정합니다. 예: 3 → 최근 3개월. 비워두면 전체 표시.',
      validation: (Rule) => Rule.min(1).max(24),
    }),
  ],
  preview: {
    prepare() {
      return { title: '사이트 설정' }
    },
  },
})
