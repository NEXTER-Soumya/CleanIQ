import { useEffect } from 'react';

export default function DocumentTitle({ title }) {
  useEffect(() => {
    document.title = `${title} | CleanIQ`;
  }, [title]);

  return null;
}
