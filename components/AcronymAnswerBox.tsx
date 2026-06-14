import type { Category } from '@/types';
import { Badge } from '@/components/Badge';
import { catVars } from '@/lib/css';

// The signature record card (DESIGN §4): coloured file tab, the acronym set as
// a mono "record identifier", and the full form as the answer beneath it.
export function AcronymAnswerBox({
  acronym,
  fullForm,
  category,
}: {
  acronym: string;
  fullForm: string;
  category: Category;
}) {
  return (
    <article className="record" style={catVars(category)}>
      <div className="record__body">
        <div className="record__top">
          <span className="record__label">Full form</span>
          <Badge category={category} />
        </div>
        <span className="record__id">{acronym}</span>
        <span className="record__standsfor">stands for</span>
        <p className="record__fullform">{fullForm}</p>
      </div>
    </article>
  );
}
