import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { BookingDetails, BookingId } from '../backend';

export function useSubmitBooking() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<BookingId, Error, BookingDetails>({
    mutationFn: async (details: BookingDetails) => {
      if (!actor) throw new Error('Actor not available');
      const bookingId = await actor.submitBooking(details);
      if (bookingId === BigInt(0)) {
        throw new Error('Failed to create booking - validation failed');
      }
      return bookingId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}
