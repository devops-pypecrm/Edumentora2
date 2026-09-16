import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { sendLeadNotification } from '@/lib/mail';
import { sendLeadToCrm, toCrmLead } from '@/lib/crm';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const lead = toCrmLead(body);

    if (!lead.firstName || !lead.email || !lead.phone || !lead.message) {
      return NextResponse.json({ success: false, error: 'All fields are required.' }, { status: 400 });
    }

    const isEligibility = /eligibility/i.test(body.source || '');
    const data = {
      firstName: lead.firstName,
      lastName: lead.lastName || null,
      email: lead.email,
      phone: lead.phone,
      company: lead.company || null,
      message: lead.message,
      source: body.source || 'website',
    };

    if (isEligibility) {
      await prisma.eligibilityRequest.create({ data });
    } else {
      await prisma.enquiryList.create({ data });
    }

    const [emailResult, crmResult] = await Promise.allSettled([
      sendLeadNotification({
        type: isEligibility ? 'Eligibility Request' : 'Enquiry',
        fields: {
          'First Name': lead.firstName,
          'Last Name': lead.lastName,
          Email: lead.email,
          Phone: lead.phone,
          Company: lead.company,
          Message: lead.message,
          Source: data.source,
        },
      }),
      sendLeadToCrm({ ...lead, source: data.source }),
    ]);

    [emailResult, crmResult]
      .filter((result) => result.status === 'rejected')
      .forEach((result) => console.error('Lead notification failed:', result.reason));

    const crm = crmResult.status === 'fulfilled'
      ? crmResult.value
      : { sent: false, configured: true, error: 'CRM delivery failed.' };

    return NextResponse.json({ success: true, crm });
  } catch (error) {
    console.error('Lead submission failed:', error);
    return NextResponse.json({ success: false, error: 'Failed to submit lead. Please try again later.' }, { status: 500 });
  }
}