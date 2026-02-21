import { defineArrayMember, defineType } from 'sanity'

export const portableText = defineType({
  name: 'portableText',
  title: '본문',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [{ title: '본문', value: 'normal' }],
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
