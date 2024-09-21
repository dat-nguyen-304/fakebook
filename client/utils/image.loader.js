'use client';

export default function myImageLoader({ src, width }) {
  if (!src.startsWith('v')) return src;

  return `${process.env.NEXT_PUBLIC_IMAGE_HOST}/w_${width},h_${width},c_fill/${src}`;
}
