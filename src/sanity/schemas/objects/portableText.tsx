import { defineArrayMember, defineType } from 'sanity'
import type { ReactNode } from 'react'

/* ── Sanity Studio 도구모음 아이콘 ── */
const ColorIcon = () => (
  <span style={{ fontWeight: 700, color: '#1e3a5f' }}>A</span>
)
const HighlightIcon = () => (
  <span style={{ fontWeight: 700, background: '#fef08a', borderRadius: 2, padding: '0 3px' }}>H</span>
)
const FontSizeIcon = () => (
  <span style={{ fontWeight: 700, fontSize: '1.1em' }}>T</span>
)

/* ── 색상 프리셋 ── */
const TEXT_COLORS = [
  { title: '남색 (Primary)', value: 'primary' },
  { title: '파랑', value: 'blue' },
  { title: '금색 (Accent)', value: 'accent' },
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
  { title: '크게 (20px)', value: 'large' },
  { title: '아주 크게 (24px)', value: 'xlarge' },
]

/* ── Studio 에디터 미리보기 컴포넌트 ── */
const COLOR_MAP: Record<string, string> = {
  primary: '#1e3a5f',
  blue: '#4a90d9',
  accent: '#c8a951',
  red: '#dc2626',
  gray: '#6b7280',
}

const HIGHLIGHT_COLOR_MAP: Record<string, string> = {
  yellow: '#fef08a',
  blue: '#bfdbfe',
  green: '#bbf7d0',
  pink: '#fecaca',
}

const FONT_SIZE_STYLE: Record<string, string> = {
  small: '0.875em',
  large: '1.25em',
  xlarge: '1.5em',
}

const TextColorPreview = (props: { children: ReactNode; value?: { color?: string } }) => {
  const hex = COLOR_MAP[props.value?.color ?? ''] ?? 'inherit'
  return <span style={{ color: hex }}>{props.children}</span>
}

const HighlightPreview = (props: { children: ReactNode; value?: { color?: string } }) => {
  const hex = HIGHLIGHT_COLOR_MAP[props.value?.color ?? ''] ?? '#fef08a'
  return <span style={{ backgroundColor: hex, borderRadius: 2, padding: '0 2px' }}>{props.children}</span>
}

const FontSizePreview = (props: { children: ReactNode; value?: { size?: string } }) => {
  const fs = FONT_SIZE_STYLE[props.value?.size ?? ''] ?? 'inherit'
  return <span style={{ fontSize: fs }}>{props.children}</span>
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
            name: 'textColor',
            type: 'object',
            title: '글자 색상',
            icon: ColorIcon,
            components: {
              annotation: TextColorPreview,
            },
            fields: [
              {
                name: 'color',
                type: 'string',
                title: '색상 선택',
                options: {
                  list: TEXT_COLORS,
                  layout: 'radio',
                },
                initialValue: 'primary',
                validation: (rule) => rule.required(),
              },
            ],
          },
          {
            name: 'highlight',
            type: 'object',
            title: '형광펜',
            icon: HighlightIcon,
            components: {
              annotation: HighlightPreview,
            },
            fields: [
              {
                name: 'color',
                type: 'string',
                title: '색상 선택',
                options: {
                  list: HIGHLIGHT_COLORS,
                  layout: 'radio',
                },
                initialValue: 'yellow',
                validation: (rule) => rule.required(),
              },
            ],
          },
          {
            name: 'fontSize',
            type: 'object',
            title: '글자 크기',
            icon: FontSizeIcon,
            components: {
              annotation: FontSizePreview,
            },
            fields: [
              {
                name: 'size',
                type: 'string',
                title: '크기 선택',
                options: {
                  list: FONT_SIZES,
                  layout: 'radio',
                },
                initialValue: 'large',
                validation: (rule) => rule.required(),
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
