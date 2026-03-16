import { defineArrayMember, defineType } from 'sanity'

/** Sanity Studio에서 사용할 텍스트 색상 프리셋 */
const TEXT_COLORS = [
  { title: '기본', value: 'default' },
  { title: '남색(Primary)', value: 'primary' },
  { title: '파랑', value: 'blue' },
  { title: '금색(Accent)', value: 'accent' },
  { title: '빨강', value: 'red' },
  { title: '회색', value: 'gray' },
]

const HIGHLIGHT_COLORS = [
  { title: '노랑', value: 'yellow' },
  { title: '연파랑', value: 'blue' },
  { title: '연초록', value: 'green' },
  { title: '연빨강', value: 'pink' },
]

const FONT_SIZES = [
  { title: '작게 (14px)', value: 'small' },
  { title: '보통 (16px)', value: 'normal' },
  { title: '크게 (20px)', value: 'large' },
  { title: '아주 크게 (24px)', value: 'xlarge' },
]

export const portableText = defineType({
  name: 'portableText',
  title: '본문',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        { title: '본문', value: 'normal' },
        { title: '제목 2', value: 'h2' },
        { title: '제목 3', value: 'h3' },
        { title: '제목 4', value: 'h4' },
        { title: '인용구', value: 'blockquote' },
      ],
      marks: {
        decorators: [
          { title: '굵게', value: 'strong' },
          { title: '기울임', value: 'em' },
          { title: '밑줄', value: 'underline' },
        ],
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: '링크',
            fields: [
              {
                name: 'href',
                type: 'url',
                title: 'URL',
                validation: (rule) =>
                  rule.uri({ allowRelative: true, scheme: ['http', 'https', 'mailto', 'tel'] }),
              },
            ],
          },
          {
            name: 'textColor',
            type: 'object',
            title: '글자 색상',
            icon: () => '🎨',
            fields: [
              {
                name: 'value',
                type: 'string',
                title: '색상',
                options: {
                  list: TEXT_COLORS,
                  layout: 'radio',
                },
                initialValue: 'primary',
              },
            ],
          },
          {
            name: 'highlight',
            type: 'object',
            title: '형광펜',
            icon: () => '✏️',
            fields: [
              {
                name: 'value',
                type: 'string',
                title: '색상',
                options: {
                  list: HIGHLIGHT_COLORS,
                  layout: 'radio',
                },
                initialValue: 'yellow',
              },
            ],
          },
          {
            name: 'fontSize',
            type: 'object',
            title: '글자 크기',
            icon: () => '🔤',
            fields: [
              {
                name: 'value',
                type: 'string',
                title: '크기',
                options: {
                  list: FONT_SIZES,
                  layout: 'radio',
                },
                initialValue: 'large',
              },
            ],
          },
        ],
      },
    }),
    defineArrayMember({
      type: 'image',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: '대체 텍스트',
          validation: (rule) => rule.required(),
        },
      ],
    }),
  ],
})
