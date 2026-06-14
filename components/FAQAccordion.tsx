import type { FaqItem } from '@/types';

// Native <details> disclosure — zero client JS, so it costs nothing on INP and
// never shifts layout. The matching FAQPage JSON-LD is emitted separately.
export function FAQAccordion({
  faqs,
  acronym,
}: {
  faqs: FaqItem[];
  acronym: string;
}) {
  if (faqs.length === 0) return null;
  return (
    <section aria-labelledby="faq-heading">
      <h2 className="section-title" id="faq-heading">
        {acronym} — frequently asked questions
      </h2>
      <div className="faq">
        {faqs.map((faq, i) => (
          <details className="faq-item" key={i} name="faq">
            <summary>{faq.question}</summary>
            <div className="faq-answer">{faq.answer}</div>
          </details>
        ))}
      </div>
    </section>
  );
}
