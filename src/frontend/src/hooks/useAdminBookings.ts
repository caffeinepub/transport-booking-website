import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { BookingRecord, BookingId, BookingStatus } from '../backend';

export function useIsCallerAdmin() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

export function useGetAllBookingsForAdmin() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<BookingRecord[]>({
    queryKey: ['adminBookings'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllBookingsForAdmin();
    },
    enabled: !!actor && !actorFetching,
    refetchInterval: 5000, // Refresh every 5 seconds
  });
}

export function useUpdateBookingStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, { bookingId: BookingId; newStatus: BookingStatus }>({
    mutationFn: async ({ bookingId, newStatus }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateBookingStatus(bookingId, newStatus);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminBookings'] });
    },
  });
}

export function useDeleteBooking() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, BookingId>({
    mutationFn: async (bookingId: BookingId) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteBooking(bookingId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminBookings'] });
    },
  });
}
