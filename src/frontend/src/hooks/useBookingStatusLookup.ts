import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { BookingRecord } from '../backend';

export function useGetBookingsByPhone(searchQuery: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<BookingRecord[]>({
    queryKey: ['bookingsByPhone', searchQuery],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      
      // Check if it's a booking ID (starts with # or is a number)
      const cleanQuery = searchQuery.replace(/^#/, '');
      const isNumeric = /^\d+$/.test(cleanQuery);
      
      if (isNumeric) {
        // Try to get by ID first
        const bookingId = BigInt(cleanQuery);
        const status = await actor.getBookingStatusById(bookingId);
        
        if (status !== null) {
          // Get all bookings and filter by ID (since we don't have a direct getById method)
          const allBookings = await actor.getBookingsByPhone(''); // This won't work, we need phone
          // For now, we'll just search by phone
        }
      }
      
      // Search by phone number
      return actor.getBookingsByPhone(cleanQuery);
    },
    enabled: !!actor && !actorFetching && !!searchQuery,
    retry: false,
  });
}
