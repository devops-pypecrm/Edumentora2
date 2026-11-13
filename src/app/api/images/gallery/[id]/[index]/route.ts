import { prisma } from '@/lib/prisma';
import { dataUrlImageResponse, isObjectId } from '@/lib/dataUrlImage';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string; index: string }> }) {
  const { id, index } = await params;
  const position = Number(index);
  if (!isObjectId(id) || !Number.isInteger(position) || position < 0) return dataUrlImageResponse(null);

  try {
    // $slice reads just the one image instead of the whole gallery document.
    const result: any = await prisma.$runCommandRaw({
      find: 'gallery',
      filter: { _id: { $oid: id } },
      projection: { images: { $slice: [position, 1] } },
      limit: 1,
    });
    return dataUrlImageResponse(result?.cursor?.firstBatch?.[0]?.images?.[0]);
  } catch (error) {
    console.error('Gallery image fetch failed:', error);
    return Response.json({ error: 'Failed to fetch image.' }, { status: 500 });
  }
}
