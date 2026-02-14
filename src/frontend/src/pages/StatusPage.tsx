import { useState } from 'react';
import { useGetBookingsByPhone } from '../hooks/useBookingStatusLookup';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Search, Loader2, Package, Calendar, Clock, MapPin, Car, FileText } from 'lucide-react';
import { BookingStatus } from '../backend';

export default function StatusPage() {
  const [searchValue, setSearchValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const { data: bookings, isLoading, isError } = useGetBookingsByPhone(searchQuery);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      setSearchQuery(searchValue.trim());
    }
  };

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.pending:
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case BookingStatus.confirmed:
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case BookingStatus.completed:
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case BookingStatus.cancelled:
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const getStatusLabel = (status: BookingStatus) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleString();
  };

  return (
    <div className="py-12 px-4 min-h-[80vh]">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-400/10 mb-4">
            <Search className="w-8 h-8 text-yellow-400" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Check Booking Status</h1>
          <p className="text-slate-400 text-lg">
            Enter your booking ID or phone number to track your booking
          </p>
        </div>

        {/* Search Form */}
        <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700/50 shadow-2xl mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-white">Search Booking</CardTitle>
            <CardDescription className="text-slate-400">
              Enter your booking ID (e.g., #123) or phone number
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="search" className="text-slate-300">
                  Booking ID or Phone Number
                </Label>
                <Input
                  id="search"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Enter booking ID or phone number"
                  className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-yellow-400"
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading || !searchValue.trim()}
                className="w-full bg-yellow-400 text-slate-900 hover:bg-yellow-500 font-semibold"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-5 w-5" />
                    Search Booking
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        {searchQuery && (
          <div className="space-y-6">
            {isLoading ? (
              <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700/50">
                <CardContent className="py-12 text-center">
                  <Loader2 className="w-12 h-12 text-yellow-400 animate-spin mx-auto mb-4" />
                  <p className="text-slate-400">Searching for bookings...</p>
                </CardContent>
              </Card>
            ) : isError ? (
              <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700/50">
                <CardContent className="py-12 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 mb-4">
                    <Package className="w-8 h-8 text-red-400" />
                  </div>
                  <p className="text-red-400 text-lg font-semibold mb-2">Error</p>
                  <p className="text-slate-400">Failed to search bookings. Please try again.</p>
                </CardContent>
              </Card>
            ) : !bookings || bookings.length === 0 ? (
              <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700/50">
                <CardContent className="py-12 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-700/50 mb-4">
                    <Package className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-slate-300 text-lg font-semibold mb-2">No Bookings Found</p>
                  <p className="text-slate-400">
                    We couldn't find any bookings matching "{searchQuery}". Please check your input and try again.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="text-slate-300 mb-4">
                  Found {bookings.length} booking{bookings.length !== 1 ? 's' : ''}
                </div>
                {bookings.map((booking) => (
                  <Card
                    key={booking.id.toString()}
                    className="bg-slate-900/50 backdrop-blur-sm border-slate-700/50 hover:border-yellow-400/50 transition-all duration-300"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-2xl text-white mb-2">
                            Booking #{booking.id.toString()}
                          </CardTitle>
                          <CardDescription className="text-slate-400">
                            Created on {formatDate(booking.createdAt)}
                          </CardDescription>
                        </div>
                        <Badge className={`${getStatusColor(booking.status)} border px-4 py-2 text-sm font-semibold`}>
                          {getStatusLabel(booking.status)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="flex items-start space-x-3">
                            <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
                              <MapPin className="w-5 h-5 text-yellow-400" />
                            </div>
                            <div>
                              <p className="text-slate-400 text-sm mb-1">Route</p>
                              <p className="text-white font-medium">{booking.details.pickup}</p>
                              <p className="text-slate-500 text-sm">↓</p>
                              <p className="text-white font-medium">{booking.details.dropoff}</p>
                            </div>
                          </div>

                          <div className="flex items-start space-x-3">
                            <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
                              <Calendar className="w-5 h-5 text-yellow-400" />
                            </div>
                            <div>
                              <p className="text-slate-400 text-sm mb-1">Date</p>
                              <p className="text-white font-medium">{booking.details.date}</p>
                            </div>
                          </div>

                          <div className="flex items-start space-x-3">
                            <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
                              <Clock className="w-5 h-5 text-yellow-400" />
                            </div>
                            <div>
                              <p className="text-slate-400 text-sm mb-1">Time</p>
                              <p className="text-white font-medium">{booking.details.time}</p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-start space-x-3">
                            <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
                              <Car className="w-5 h-5 text-yellow-400" />
                            </div>
                            <div>
                              <p className="text-slate-400 text-sm mb-1">Vehicle</p>
                              <p className="text-white font-medium">{booking.details.vehicle}</p>
                            </div>
                          </div>

                          {booking.details.notes && (
                            <div className="flex items-start space-x-3">
                              <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
                                <FileText className="w-5 h-5 text-yellow-400" />
                              </div>
                              <div>
                                <p className="text-slate-400 text-sm mb-1">Notes</p>
                                <p className="text-white">{booking.details.notes}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
