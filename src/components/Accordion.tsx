import { ChevronDown } from 'lucide-react';
import { useId, useState } from 'react';

export interface AccordionItem {
  id: string;
  question: string;
  answer: string;
  source?: { label: string; url: string };
}

export default function Accordion({ items, defaultOpen }: { items: AccordionItem[]; defaultOpen?: string }) {
  const [open, setOpen] = useState<string | null>(defaultOpen ?? null);
  const baseId = useId();

  return (
    <div className="accordion">
      {items.map((item) => {
        const isOpen = open === item.id;
        const panelId = `${baseId}-${item.id}-panel`;
        const btnId = `${baseId}-${item.id}-btn`;
        return (
          <div className={`accordion__item ${isOpen ? 'is-open' : ''}`} key={item.id}>
            <h3 style={{ margin: 0 }}>
              <button
                type="button"
                id={btnId}
                className="accordion__trigger"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : item.id)}
              >
                <span>{item.question}</span>
                <ChevronDown size={18} aria-hidden="true" />
              </button>
            </h3>
            <div id={panelId} role="region" aria-labelledby={btnId} className={`accordion__panel ${isOpen ? 'is-open' : ''}`}>
              <div>
                <div className="accordion__content">
                  <p>{item.answer}</p>
                  {item.source ? (
                    <p style={{ marginTop: 10, fontSize: 13 }}>
                      相关链接：
                      <a href={item.source.url} target="_blank" rel="noopener noreferrer">
                        {item.source.label}
                      </a>
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
