import { prisma } from '@/lib/prisma';
import { dataUrlImageResponse, isObjectId } from '@/lib/dataUrlImage';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isObjectId(id)) return dataUrlImageResponse(null);

  try {
    const university = await prisma.university.findUnique({ where: { id }, select: { logo: true } });
    return dataUrlImageResponse(university?.logo);
  } catch (error) {
    console.error('University logo fetch failed:', error);
    return Response.json({ error: 'Failed to fetch image.' }, { status: 500 });
  }
}
