import { prisma } from '@/lib/prisma';
import { dataUrlImageResponse, isObjectId } from '@/lib/dataUrlImage';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isObjectId(id)) return dataUrlImageResponse(null);

  try {
    const slide = await prisma.heroSlide.findUnique({ where: { id }, select: { imageUrl: true } });
    return dataUrlImageResponse(slide?.imageUrl);
  } catch (error) {
    console.error('Hero slide image fetch failed:', error);
    return Response.json({ error: 'Failed to fetch image.' }, { status: 500 });
  }
}
