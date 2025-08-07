import { useRouter } from 'next/navigation';
import { Restaurant } from '@/app/types/restaurant';

export function useRestaurantActions(refetch: () => Promise<void>, setShowModal: (v: boolean) => void, setEditing: (v: Restaurant | null) => void) {
  const router = useRouter();

  const handleSave = async (restaurant: Restaurant) => {
    const isEdit = restaurant.id > 0;
    const endpoint = isEdit ? `/api/restaurants/${restaurant.id}` : '/api/restaurants';
    const method = isEdit ? 'PUT' : 'POST';
    try {
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(restaurant),
      });
      if (!res.ok) throw new Error('Failed to save restaurant');
      await refetch();
      setShowModal(false);
      setEditing(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/restaurants/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete restaurant');
      await refetch();
    } catch (error) {
      console.error('Error deleting restaurant:', error);
      router.push('/error');
    }
  };

  return { handleSave, handleDelete };
}
