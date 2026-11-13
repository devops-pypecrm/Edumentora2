import { createHash } from 'crypto';

// Images uploaded through the admin panel are stored as base64 data URLs.
// Rendering those inline puts every image into the page HTML (and again into
// the RSC payload), so pages point at an image route instead. The content hash
// in `v` changes whenever the image does, which lets browsers cache it forever.
export function toImageRoute(route: string, value: string): string {
  if (!value.startsWith('data:image/')) return value;
  const version = createHash('sha1').update(value).digest('hex').slice(0, 12);
  return `${route}?v=${version}`;
}

export function isObjectId(value: string): boolean {
  return /^[0-9a-f]{24}$/i.test(value);
}

export function dataUrlImageResponse(value: string | null | undefined): Response {
  const comma = value?.indexOf(',') ?? -1;
  const header = value && comma > 0 ? value.slice(0, comma) : '';
  const match = /^data:(image\/[a-z0-9.+-]+);base64$/i.exec(header);
  if (!value || !match) {
    return Response.json({ error: 'Image not found.' }, { status: 404 });
  }

  const image = Buffer.from(value.slice(comma + 1), 'base64');
  return new Response(image, {
    headers: {
      'Content-Type': match[1],
      'Content-Length': String(image.length),
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
