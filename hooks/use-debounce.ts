import * as React from 'react';

export default function useDebounce<T>(value: T, delay = 400) {
  const [debounced, setDebounced] = React.useState<T>(value);

  React.useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);

  return debounced;
}
