import type { PortableTextBlock } from 'next-sanity'

// ─── 공통 타입 ───────────────────────────────────────────────

export interface SanityImage {
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
  }
  hotspot?: {
    x: number
    y: number
    width: number
    height: number
  }
  alt?: string
}

export interface SanityFile {
  _type: 'file'
  asset: {
    _ref: string
    _type: 'reference'
  }
}

export interface SanitySlug {
  _type: 'slug'
  current: string
}

// ─── 문서 타입 ───────────────────────────────────────────────

export interface Staff {
  _id: string
  _type: 'staff'
  name: string
  position: string
  photo?: SanityImage
  bio?: string
  order?: number
}

export interface Sermon {
  _id: string
  _type: 'sermon'
  title: string
  slug: SanitySlug
  date: string
  category: 'sunday' | 'wednesday' | 'friday' | 'special'
  preacher?: string
  bibleText?: string
  youtubeUrl: string
  thumbnail?: SanityImage
  description?: string
}

export interface Notice {
  _id: string
  _type: 'notice'
  title: string
  slug: SanitySlug
  body: PortableTextBlock[]
  publishedAt: string
  isPinned?: boolean
}

export interface Bulletin {
  _id: string
  _type: 'bulletin'
  title: string
  date: string
  file: SanityFile
  coverImage?: SanityImage
}

export interface Album {
  _id: string
  _type: 'album'
  title: string
  slug: SanitySlug
  date: string
  description?: string
  images: SanityImage[]
}

export interface PrayerLetter {
  _id: string
  _type: 'prayerLetter'
  title: string
  slug: SanitySlug
  body: PortableTextBlock[]
  publishedAt: string
}

// ─── 블록 타입 ───────────────────────────────────────────────

export interface HeroBlock {
  _type: 'heroBlock'
  _key: string
  backgroundImage: SanityImage
  title: string
  subtitle?: string
  buttonText?: string
  buttonLink?: string
}

export interface WorshipService {
  _key: string
  name: string
  time: string
  location?: string
  icon?: string
}

export interface WorshipInfoBlock {
  _type: 'worshipInfoBlock'
  _key: string
  heading?: string
  services?: WorshipService[]
}

export interface LatestSermonBlock {
  _type: 'latestSermonBlock'
  _key: string
  heading?: string
  count?: number
}

export interface NoticeListBlock {
  _type: 'noticeListBlock'
  _key: string
  heading?: string
  count?: number
}

export interface MapCoordinates {
  lat: number
  lng: number
}

export interface DirectionsBlock {
  _type: 'directionsBlock'
  _key: string
  heading?: string
  address: string
  phone?: string
  transitInfo?: string
  mapCoordinates?: MapCoordinates
}

export interface YoutubeBlock {
  _type: 'youtubeBlock'
  _key: string
  url: string
  caption?: string
}

export interface TextBlock {
  _type: 'textBlock'
  _key: string
  heading?: string
  body: PortableTextBlock[]
}

export interface ImageGalleryBlock {
  _type: 'imageGalleryBlock'
  _key: string
  heading?: string
  images: SanityImage[]
}

export interface StaffBlock {
  _type: 'staffBlock'
  _key: string
  heading?: string
  members?: Staff[]
}

export interface TimelineItem {
  _key: string
  year: string
  content: string
}

export interface TimelineBlock {
  _type: 'timelineBlock'
  _key: string
  heading?: string
  items?: TimelineItem[]
}

// ─── 유니온 & 페이지 ────────────────────────────────────────

export type PageBlock =
  | HeroBlock
  | WorshipInfoBlock
  | LatestSermonBlock
  | NoticeListBlock
  | DirectionsBlock
  | YoutubeBlock
  | TextBlock
  | ImageGalleryBlock
  | StaffBlock
  | TimelineBlock

export interface Page {
  _id: string
  _type: 'page'
  title: string
  slug: SanitySlug
  seoDescription?: string
  blocks?: PageBlock[]
}
