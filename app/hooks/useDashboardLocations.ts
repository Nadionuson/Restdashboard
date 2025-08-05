import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useDashboardLocations() {
  const [cities, setCities] = useState<string[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<string[]>([]);
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
      } catch (error) {
        console.error('Failed to fetch locations', error);
        router.push('/error');
      }
    };
    fetchLocations();
  }, [router]);

  return { cities, neighborhoods, setCities, setNeighborhoods };
}
