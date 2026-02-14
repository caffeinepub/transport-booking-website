import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useSaveCallerUserProfile } from '../hooks/useUserProfile';
import { useIsCallerAdmin, useGetAllBookingsForAdmin, useUpdateBookingStatus, useDeleteBooking } from '../hooks/useAdminBookings';
import AccessDeniedScreen from '../components/AccessDeniedScreen';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Badge } from '../components/ui/badge';
import { Loader2, Trash2, Shield, User } from 'lucide-react';
import { BookingStatus } from '../backend';

export default function AdminPage() {
  const { identity, loginStatus } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched: profileFetched } = useGetCallerUserProfile();
  const { data: isAdmin, isLoading: adminCheckLoading } = useIsCallerAdmin();
  const { data: bookings, isLoading: bookingsLoading } = useGetAllBookingsForAdmin();
  const updateStatus = useUpdateBookingStatus();
  const deleteBooking = useDeleteBooking();
  const saveProfile = useSaveCallerUserProfile();

  const [profileName, setProfileName] = useState('');
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<bigint | null>(null);

  const isAuthenticated = !!identity;
  const isInitializing = loginStatus === 'initializing';

  // Show profile setup dialog when needed
  const showProfileSetup = isAuthenticated && !profileLoading && profileFetched && userProfile === null;

  if (showProfileSetup && !showProfileDialog) {
    setShowProfileDialog(true);
  }

  const handleSaveProfile = async () => {
    if (profileName.trim()) {
      await saveProfile.mutateAsync({ name: profileName.trim() });
      setShowProfileDialog(false);
    }
  };

  const handleStatusChange = (bookingId: bigint, newStatus: string) => {
    updateStatus.mutate({ bookingId, newStatus: newStatus as BookingStatus });
  };

  const handleDelete = (bookingId: bigint) => {
    setDeleteConfirmId(bookingId);
  };

  const confirmDelete = () => {
    if (deleteConfirmId !== null) {
      deleteBooking.mutate(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };

  const getStatusBadgeVariant = (status: BookingStatus): 'default' | 'secondary' | 'outline' | 'destructive' => {
    switch (status) {
      case BookingStatus.pending:
        return 'secondary';
      case BookingStatus.confirmed:
        return 'default';
      case BookingStatus.completed:
        return 'outline';
      case BookingStatus.cancelled:
        return 'destructive';
      default:
        return 'default';
    }
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleString();
  };

  // Loading state
  if (isInitializing || profileLoading || adminCheckLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-yellow-400 animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <Card className="max-w-md w-full bg-slate-900/50 backdrop-blur-sm border-slate-700/50">
          <CardHeader className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-400/10 mx-auto mb-4">
              <Shield className="w-8 h-8 text-yellow-400" />
            </div>
            <CardTitle className="text-2xl text-white">Admin Access Required</CardTitle>
            <CardDescription className="text-slate-400">
              Please login to access the admin dashboard
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Not admin
  if (isAdmin === false) {
    return <AccessDeniedScreen />;
  }

  return (
    <div className="py-12 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-yellow-400/10 flex items-center justify-center">
              <Shield className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-slate-400">Manage all bookings and requests</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Bookings', value: bookings?.length || 0, color: 'blue' },
            {
              label: 'Pending',
              value: bookings?.filter((b) => b.status === BookingStatus.pending).length || 0,
              color: 'yellow',
            },
            {
              label: 'Confirmed',
              value: bookings?.filter((b) => b.status === BookingStatus.confirmed).length || 0,
              color: 'green',
            },
            {
              label: 'Completed',
              value: bookings?.filter((b) => b.status === BookingStatus.completed).length || 0,
              color: 'purple',
            },
          ].map((stat, index) => (
            <Card key={index} className="bg-slate-900/50 backdrop-blur-sm border-slate-700/50">
              <CardContent className="p-6">
                <p className="text-slate-400 text-sm mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bookings Table */}
        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-2xl text-white">All Bookings</CardTitle>
            <CardDescription className="text-slate-400">
              View and manage all booking requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            {bookingsLoading ? (
              <div className="text-center py-12">
                <Loader2 className="w-8 h-8 text-yellow-400 animate-spin mx-auto mb-4" />
                <p className="text-slate-400">Loading bookings...</p>
              </div>
            ) : !bookings || bookings.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-400 text-lg">No bookings found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700 hover:bg-slate-800/50">
                      <TableHead className="text-slate-300">ID</TableHead>
                      <TableHead className="text-slate-300">Customer</TableHead>
                      <TableHead className="text-slate-300">Phone</TableHead>
                      <TableHead className="text-slate-300">Route</TableHead>
                      <TableHead className="text-slate-300">Date & Time</TableHead>
                      <TableHead className="text-slate-300">Vehicle</TableHead>
                      <TableHead className="text-slate-300">Status</TableHead>
                      <TableHead className="text-slate-300">Created</TableHead>
                      <TableHead className="text-slate-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.map((booking) => (
                      <TableRow key={booking.id.toString()} className="border-slate-700 hover:bg-slate-800/50">
                        <TableCell className="text-white font-mono">#{booking.id.toString()}</TableCell>
                        <TableCell className="text-white">{booking.details.name}</TableCell>
                        <TableCell className="text-slate-300">{booking.details.phone}</TableCell>
                        <TableCell className="text-slate-300 max-w-xs truncate">
                          {booking.details.pickup} → {booking.details.dropoff}
                        </TableCell>
                        <TableCell className="text-slate-300">
                          {booking.details.date} {booking.details.time}
                        </TableCell>
                        <TableCell className="text-slate-300">{booking.details.vehicle}</TableCell>
                        <TableCell>
                          <Select
                            value={booking.status}
                            onValueChange={(value) => handleStatusChange(booking.id, value)}
                            disabled={updateStatus.isPending}
                          >
                            <SelectTrigger className="w-32 bg-slate-800 border-slate-700 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-slate-700">
                              <SelectItem value={BookingStatus.pending} className="text-white">
                                Pending
                              </SelectItem>
                              <SelectItem value={BookingStatus.confirmed} className="text-white">
                                Confirmed
                              </SelectItem>
                              <SelectItem value={BookingStatus.completed} className="text-white">
                                Completed
                              </SelectItem>
                              <SelectItem value={BookingStatus.cancelled} className="text-white">
                                Cancelled
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-slate-400 text-sm">{formatDate(booking.createdAt)}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(booking.id)}
                            disabled={deleteBooking.isPending}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Profile Setup Dialog */}
      <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
        <DialogContent className="bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center">
              <User className="w-5 h-5 mr-2 text-yellow-400" />
              Complete Your Profile
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Please enter your name to continue
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="profile-name" className="text-slate-300">
                Your Name
              </Label>
              <Input
                id="profile-name"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                placeholder="Enter your full name"
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleSaveProfile}
              disabled={!profileName.trim() || saveProfile.isPending}
              className="bg-yellow-400 text-slate-900 hover:bg-yellow-500"
            >
              {saveProfile.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Profile'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmId !== null} onOpenChange={() => setDeleteConfirmId(null)}>
        <DialogContent className="bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">Confirm Deletion</DialogTitle>
            <DialogDescription className="text-slate-400">
              Are you sure you want to delete booking #{deleteConfirmId?.toString()}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmId(null)}
              className="border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDelete}
              disabled={deleteBooking.isPending}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              {deleteBooking.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
