import { defineArrayMember, defineType } from 'sanity'
import type { ReactNode } from 'react'

/* ── Studio 도구모음 아이콘 ── */
const StyleIcon = () => (
  <span style={{ fontWeight: 700, fontSize: '1em' }}>Aa</span>
)

/* ── 프리셋 ── */
const TEXT_COLORS = [
  { title: '기본 (변경 없음)', value: '' },
  { title: '남색', value: 'primary' },
  { title: '파랑', value: 'blue' },
  { title: '금색', value: 'accent' },
  { title: '빨강', value: 'red' },
  { title: '회색', value: 'gray' },
]

const HIGHLIGHT_COLORS = [
  { title: '없음', value: '' },
  { title: '노랑', value: 'yellow' },
  { title: '연파랑', value: 'blue' },
  { title: '연초록', value: 'green' },
  { title: '연빨강', value: 'pink' },
]

const FONT_SIZES = [
  { title: '기본', value: '' },
  { title: '작게', value: 'small' },
  { title: '크게', value: 'large' },
  { title: '아주 크게', value: 'xlarge' },
]

/* ── Studio 에디터 미리보기 ── */
const COLOR_HEX: Record<string, string> = {
  primary: '#1e3a5f',
  blue: '#4a90d9',
  accent: '#c8a951',
  red: '#dc2626',
  gray: '#6b7280',
}

const HIGHLIGHT_HEX: Record<string, string> = {
  yellow: '#fef08a',
  blue: '#bfdbfe',
  green: '#bbf7d0',
  pink: '#fecaca',
}

const FONT_SIZE_PX: Record<string, string> = {
  small: '0.875em',
  large: '1.25em',
  xlarge: '1.5em',
}

interface StyleValue {
  color?: string
  bg?: string
  size?: string
}

const TextStylePreview = (props: { children: ReactNode; value?: StyleValue }) => {
  const style: Record<string, string> = {}
  if (props.value?.color && COLOR_HEX[props.value.color])
    style.color = COLOR_HEX[props.value.color]
  if (props.value?.bg && HIGHLIGHT_HEX[props.value.bg]) {
    style.backgroundColor = HIGHLIGHT_HEX[props.value.bg]
    style.borderRadius = '2px'
    style.padding = '0 2px'
  }
  if (props.value?.size && FONT_SIZE_PX[props.value.size])
    style.fontSize = FONT_SIZE_PX[props.value.size]

  return <span style={style}>{props.children}</span>
}

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
            name: 'textStyle',
            type: 'object',
            title: '텍스트 스타일',
            icon: StyleIcon,
            components: {
              annotation: TextStylePreview,
            },
            fields: [
              {
                name: 'color',
                type: 'string',
                title: '글자 색상',
                options: { list: TEXT_COLORS },
              },
              {
                name: 'bg',
                type: 'string',
                title: '형광펜',
                options: { list: HIGHLIGHT_COLORS },
              },
              {
                name: 'size',
                type: 'string',
                title: '글자 크기',
                options: { list: FONT_SIZES },
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
