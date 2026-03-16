import { defineArrayMember, defineType } from 'sanity'
import type { ReactNode } from 'react'

/* Studio 에디터 인라인 미리보기 */
const dec = (style: Record<string, string>) =>
  ({ children }: { children: ReactNode }) =>
    <span style={style}>{children}</span>

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
          // 글자 색상 (3개)
          {
            title: '빨강',
            value: 'color-red',
            icon: () => <span style={{ color: '#dc2626', fontWeight: 700 }}>A</span>,
            component: dec({ color: '#dc2626' }),
          },
          {
            title: '파랑',
            value: 'color-blue',
            icon: () => <span style={{ color: '#4a90d9', fontWeight: 700 }}>A</span>,
            component: dec({ color: '#4a90d9' }),
          },
          {
            title: '금색',
            value: 'color-accent',
            icon: () => <span style={{ color: '#c8a951', fontWeight: 700 }}>A</span>,
            component: dec({ color: '#c8a951' }),
          },
          // 형광펜 (1개)
          {
            title: '형광펜',
            value: 'highlight',
            icon: () => <span style={{ background: '#fef08a', fontWeight: 700, borderRadius: 2, padding: '0 3px' }}>H</span>,
            component: dec({ backgroundColor: '#fef08a', borderRadius: '2px', padding: '0 2px' }),
          },
          // 글자 크기 (1개)
          {
            title: '크게',
            value: 'text-large',
            icon: () => <span style={{ fontWeight: 700 }}>T+</span>,
            component: dec({ fontSize: '1.25em' }),
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
