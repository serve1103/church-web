import { defineArrayMember, defineType } from 'sanity'
import type { ReactNode } from 'react'

/* Studio 에디터 미리보기 컴포넌트 (decorator용) */
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
          // ── 글자 색상 ──
          {
            title: '남색',
            value: 'color-primary',
            icon: () => <span style={{ color: '#1e3a5f', fontWeight: 700 }}>A</span>,
            component: dec({ color: '#1e3a5f' }),
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
          {
            title: '빨강',
            value: 'color-red',
            icon: () => <span style={{ color: '#dc2626', fontWeight: 700 }}>A</span>,
            component: dec({ color: '#dc2626' }),
          },
          {
            title: '회색',
            value: 'color-gray',
            icon: () => <span style={{ color: '#6b7280', fontWeight: 700 }}>A</span>,
            component: dec({ color: '#6b7280' }),
          },
          // ── 형광펜 ──
          {
            title: '형광 노랑',
            value: 'highlight-yellow',
            icon: () => <span style={{ background: '#fef08a', padding: '0 2px' }}>H</span>,
            component: dec({ backgroundColor: '#fef08a', borderRadius: '2px', padding: '0 2px' }),
          },
          {
            title: '형광 파랑',
            value: 'highlight-blue',
            icon: () => <span style={{ background: '#bfdbfe', padding: '0 2px' }}>H</span>,
            component: dec({ backgroundColor: '#bfdbfe', borderRadius: '2px', padding: '0 2px' }),
          },
          {
            title: '형광 초록',
            value: 'highlight-green',
            icon: () => <span style={{ background: '#bbf7d0', padding: '0 2px' }}>H</span>,
            component: dec({ backgroundColor: '#bbf7d0', borderRadius: '2px', padding: '0 2px' }),
          },
          {
            title: '형광 빨강',
            value: 'highlight-pink',
            icon: () => <span style={{ background: '#fecaca', padding: '0 2px' }}>H</span>,
            component: dec({ backgroundColor: '#fecaca', borderRadius: '2px', padding: '0 2px' }),
          },
          // ── 글자 크기 ──
          {
            title: '크게',
            value: 'text-large',
            icon: () => <span style={{ fontSize: '1.1em', fontWeight: 700 }}>T+</span>,
            component: dec({ fontSize: '1.25em' }),
          },
          {
            title: '아주 크게',
            value: 'text-xlarge',
            icon: () => <span style={{ fontSize: '1.3em', fontWeight: 700 }}>T++</span>,
            component: dec({ fontSize: '1.5em' }),
          },
          {
            title: '작게',
            value: 'text-small',
            icon: () => <span style={{ fontSize: '0.85em' }}>T-</span>,
            component: dec({ fontSize: '0.875em' }),
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
