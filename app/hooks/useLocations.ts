import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useLocations() {
  const [cities, setCities] = useState<string[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await fetch('/api/locations');
        const data = await res.json();
        if (Array.isArray(data.cities) && Array.isArray(data.neighborhoods)) {
          setCities(data.cities);
          setNeighborhoods(data.neighborhoods);
        } else if (Array.isArray(data)) {
          setCities(data);
          setNeighborhoods(data);
        } else {
          throw new Error('Unexpected data format in /api/locations');
        }
      } catch (err) {
        setError('Failed to fetch locations');
        router.push('/error');
      }
    };
    fetchLocations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { cities, setCities, neighborhoods, setNeighborhoods, error };
}
