'use client';

export default function myImageLoader({ src, width }) {
  const cloudinaryBaseUrl = 'https://res.cloudinary.com/';
  if (!src.startsWith(cloudinaryBaseUrl)) return src;

  const transformation = `w_${width},h_${width},c_fill`;
  const parts = src.split('/upload/');

  if (parts.length === 2) {
    return `${parts[0]}/upload/${transformation}/${parts[1]}`;
  }
}
