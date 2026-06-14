import type { FaqItem } from '@/types';

// Native <details> disclosure — zero client JS, so it costs nothing on INP and
// never shifts layout. The matching FAQPage JSON-LD is emitted separately.
export function FAQAccordion({
  faqs,
  acronym,
  title,
}: {
  faqs: FaqItem[];
  acronym?: string;
  title?: string;
}) {
  if (faqs.length === 0) return null;
  const heading = title ?? `${acronym} — frequently asked questions`;
  return (
    <section aria-labelledby="faq-heading">
      <h2 className="section-title" id="faq-heading">
        {heading}
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
