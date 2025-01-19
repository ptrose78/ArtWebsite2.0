'use client';

import { useEffect, useState } from 'react';
import { useActionState } from 'react';

export default function PasswordManagerIndicator() {
  const [indicatorHTML, setIndicatorHTML] = useState<string | null>(null); 

  useEffect(() => {
    // This code runs only on the client-side
    const indicator = document.querySelector('[data-lastpass-icon-root]'); // Select the injected element
    if (indicator) {
      setIndicatorHTML(indicator.outerHTML); // Get the HTML string
    }
  }, []);

  if (!indicatorHTML) {
    return null; // Or a placeholder while loading
  }

  return <div dangerouslySetInnerHTML={{ __html: indicatorHTML }} />;
}
