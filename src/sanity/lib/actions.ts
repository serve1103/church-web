'use client'

import { useDocumentOperation } from 'sanity'
import type { DocumentActionComponent } from 'sanity'

function generateSlug(title: string): string {
  return (
    title
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^가-힣ㄱ-ㅎㅏ-ㅣa-z0-9-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') || `post-${Date.now()}`
  )
}

export function createAutoSlugPublishAction(
  originalPublishAction: DocumentActionComponent,
): DocumentActionComponent {
  const AutoSlugPublish: DocumentActionComponent = (props) => {
    const originalResult = originalPublishAction(props)
    const { patch } = useDocumentOperation(props.id, props.type)

    if (!originalResult) return null

    return {
      ...originalResult,
      onHandle: () => {
        const doc = props.draft || props.published
        const slug = doc?.slug as { current?: string } | undefined
        if (doc && !slug?.current && doc.title) {
          patch.execute([
            {
              set: {
                slug: { _type: 'slug', current: generateSlug(doc.title as string) },
              },
            },
          ])
        }
        originalResult.onHandle?.()
      },
    }
  }
  return AutoSlugPublish
}
