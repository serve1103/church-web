import { projectId, dataset } from "@/sanity/env";

/**
 * Sanity file asset ref → CDN URL 변환
 * @param fileRef - file-<id>-<extension> 형태의 asset ref
 */
export const getFileUrl = (fileRef: string): string => {
  const [, id, ext] = fileRef.split("-");
  return `https://cdn.sanity.io/files/${projectId}/${dataset}/${id}.${ext}`;
};
