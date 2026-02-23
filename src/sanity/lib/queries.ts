import { groq } from 'next-sanity'

// 모든 GROQ 쿼리를 이 파일에서 중앙 관리합니다.
// 컴포넌트에 쿼리를 분산하지 마세요.

// ─── 페이지 ──────────────────────────────────────────────────

export const pageBySlugQuery = groq`
  *[_type == "page" && slug.current == $slug][0]{
    ...,
    blocks[]{
      ...,
      _type == "staffBlock" => {
        ...,
        members[]->
      }
    }
  }
`

export const homePageQuery = groq`
  *[_type == "page" && slug.current == "home"][0]{
    ...,
    blocks[]{
      ...,
      _type == "staffBlock" => {
        ...,
        members[]->
      }
    }
  }
`

// ─── 설교 ────────────────────────────────────────────────────

export const sermonsQuery = groq`
  *[_type == "sermon"] | order(date desc) [$start...$end]{
    _id, title, slug, date, category, preacher, bibleText, youtubeUrl, thumbnail, description
  }
`

export const sermonsByCategoryQuery = groq`
  *[_type == "sermon" && category == $category] | order(date desc) [$start...$end]{
    _id, title, slug, date, category, preacher, bibleText, youtubeUrl, thumbnail, description
  }
`

export const sermonBySlugQuery = groq`
  *[_type == "sermon" && slug.current == $slug][0]
`

export const latestSermonsQuery = groq`
  *[_type == "sermon"] | order(date desc) [0...12]{
    _id, title, slug, date, category, preacher, bibleText, youtubeUrl, thumbnail
  }
`

export const sermonsCountQuery = groq`
  count(*[_type == "sermon"])
`

export const sermonsCountByCategoryQuery = groq`
  count(*[_type == "sermon" && category == $category])
`

// ─── 공지사항 ────────────────────────────────────────────────

export const noticesQuery = groq`
  *[_type == "notice"] | order(isPinned desc, publishedAt desc) [$start...$end]{
    _id, title, slug, category, publishedAt, isPinned
  }
`

export const noticeBySlugQuery = groq`
  *[_type == "notice" && slug.current == $slug][0]{
    ...,
    attachments[]{
      ...,
      "url": asset->url,
      "originalFilename": asset->originalFilename,
      "size": asset->size
    }
  }
`

export const latestNoticesQuery = groq`
  *[_type == "notice"] | order(isPinned desc, publishedAt desc) [0...20]{
    _id, title, slug, category, publishedAt, isPinned
  }
`

export const noticesCountQuery = groq`
  count(*[_type == "notice"])
`

// ─── 주보 ────────────────────────────────────────────────────

export const bulletinsQuery = groq`
  *[_type == "bulletin"] | order(date desc) [$start...$end]{
    _id, title, date, file, coverImage
  }
`

export const latestBulletinQuery = groq`
  *[_type == "bulletin"] | order(date desc) [0]
`

export const bulletinsCountQuery = groq`
  count(*[_type == "bulletin"])
`

// ─── 사진앨범 ────────────────────────────────────────────────

export const albumsQuery = groq`
  *[_type == "album"] | order(date desc) [$start...$end]{
    _id, title, slug, date, description,
    "coverImage": images[0],
    "imageCount": count(images)
  }
`

export const albumBySlugQuery = groq`
  *[_type == "album" && slug.current == $slug][0]
`

export const albumsCountQuery = groq`
  count(*[_type == "album"])
`

// ─── 기도편지 ────────────────────────────────────────────────

export const prayerLettersQuery = groq`
  *[_type == "prayerLetter"] | order(publishedAt desc) [$start...$end]{
    _id, title, slug, publishedAt
  }
`

export const prayerLetterBySlugQuery = groq`
  *[_type == "prayerLetter" && slug.current == $slug][0]{
    ...,
    images[]{
      ...,
      "url": asset->url
    }
  }
`

export const prayerLettersCountQuery = groq`
  count(*[_type == "prayerLetter"])
`

// ─── 사이트 설정 ──────────────────────────────────────────────

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0]{
    churchName, logo, address, phone
  }
`

// ─── 사역자 ──────────────────────────────────────────────────

export const staffListQuery = groq`
  *[_type == "staff"] | order(order asc){
    _id, name, position, photo, bio, order
  }
`
