import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Refund Policy',
  description: 'Review Edumentora refund and cancellation terms for products and services purchased through the Platform.',
  path: '/refund-policy',
});

const refundPolicyPoints = [
  'Cancellations will only be considered if the request is made within 10 days of placing the order. However, cancellation requests may not be entertained if the orders have been communicated to such sellers / merchant(s) listed on the Platform and they have initiated the process of shipping them, or the product is out for delivery. In such an event, you may choose to reject the product at the doorstep.',
  'EDUMENTORA does not accept cancellation requests for perishable items like flowers, eatables, etc. However, the refund / replacement can be made if the user establishes that the quality of the product delivered is not good.',
  'In case of receipt of damaged or defective items, please report to our customer service team. The request would be entertained once the seller/ merchant listed on the Platform, has checked and determined the same at its own end. This should be reported within 10 days of receipt of products. In case you feel that the product received is not as shown on the site or as per your expectations, you must bring it to the notice of our customer service within 10 days of receiving the product. The customer service team after looking into your complaint will take an appropriate decision.',
  'In case of complaints regarding the products that come with a warranty from the manufacturers, please refer the issue to them.',
  'In case of any refunds approved by EDUMENTORA, it will take 15 days for the refund to be processed to you.',
];

export default function RefundPolicyPage() {
  return (
    <main className="min-h-screen bg-white font-[Poppins] text-[#173763]">
      <Header />

      <section className="mx-auto max-w-7xl px-4 pb-24 pt-24 md:px-8 md:pb-32 md:pt-32">
        <h1 className="text-3xl font-bold leading-tight md:text-4xl">Refund and Cancellation Policy</h1>

        <div className="mt-10 text-base leading-relaxed md:text-lg">
          <p>
            This refund and cancellation policy outlines how you can cancel or seek a refund for a product / service that you have purchased through the Platform. Under this policy:
          </p>

          <ul className="mt-7 list-disc space-y-6 pl-6">
            {refundPolicyPoints.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </div>
      </section>

      <Footer />
    </main>
  );
}