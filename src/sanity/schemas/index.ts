import { type SchemaTypeDefinition } from 'sanity'

// Objects
import { portableText } from './objects/portableText'

// Blocks
import { heroBlock } from './blocks/heroBlock'
import { worshipInfoBlock } from './blocks/worshipInfoBlock'
import { latestSermonBlock } from './blocks/latestSermonBlock'
import { noticeListBlock } from './blocks/noticeListBlock'
import { directionsBlock } from './blocks/directionsBlock'
import { youtubeBlock } from './blocks/youtubeBlock'
import { textBlock } from './blocks/textBlock'
import { imageGalleryBlock } from './blocks/imageGalleryBlock'
import { staffBlock } from './blocks/staffBlock'
import { timelineBlock } from './blocks/timelineBlock'

// Documents
import { staff } from './staff'
import { sermon } from './sermon'
import { notice } from './notice'
import { bulletin } from './bulletin'
import { album } from './album'
import { prayerLetter } from './prayerLetter'
import { page } from './page'

export const schemaTypes: SchemaTypeDefinition[] = [
  // Objects
  portableText,

  // Blocks
  heroBlock,
  worshipInfoBlock,
  latestSermonBlock,
  noticeListBlock,
  directionsBlock,
  youtubeBlock,
  textBlock,
  imageGalleryBlock,
  staffBlock,
  timelineBlock,

  // Documents
  staff,
  sermon,
  notice,
  bulletin,
  album,
  prayerLetter,
  page,
]
