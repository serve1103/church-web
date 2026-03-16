import { defineArrayMember, defineType } from 'sanity'

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
          {
            title: '빨강',
            value: 'color-red',
            icon: () => <span style={{ color: '#dc2626', fontWeight: 700 }}>A</span>,
          },
          {
            title: '파랑',
            value: 'color-blue',
            icon: () => <span style={{ color: '#4a90d9', fontWeight: 700 }}>A</span>,
          },
          {
            title: '금색',
            value: 'color-accent',
            icon: () => <span style={{ color: '#c8a951', fontWeight: 700 }}>A</span>,
          },
          {
            title: '형광펜',
            value: 'highlight',
            icon: () => <span style={{ background: '#fef08a', fontWeight: 700, borderRadius: 2, padding: '0 3px' }}>H</span>,
          },
          {
            title: '크게',
            value: 'text-large',
            icon: () => <span style={{ fontWeight: 700 }}>T+</span>,
          },
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
