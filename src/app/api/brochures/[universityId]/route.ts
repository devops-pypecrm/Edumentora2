import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

const PDF_DATA_URL_PREFIX = 'data:application/pdf;base64,';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ universityId: string }> },
) {
  const { universityId } = await params;
  if (!/^[0-9a-f]{24}$/i.test(universityId)) {
    return NextResponse.json({ error: 'Brochure not found.' }, { status: 404 });
  }

  try {
    const brochure = await prisma.brochure.findUnique({ where: { universityId } });
    if (!brochure || !brochure.fileUrl.startsWith(PDF_DATA_URL_PREFIX)) {
      return NextResponse.json({ error: 'Brochure not found.' }, { status: 404 });
    }

    const file = Buffer.from(brochure.fileUrl.slice(PDF_DATA_URL_PREFIX.length), 'base64');
    return new NextResponse(file, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Length': String(file.length),
      },
    });
  } catch (error) {
    console.error('Brochure fetch failed:', error);
    return NextResponse.json({ error: 'Failed to fetch brochure.' }, { status: 500 });
  }
}
