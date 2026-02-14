import { useState } from 'react';
import { useSubmitBooking } from '../hooks/useBookings';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { VEHICLES } from '../constants/vehicles';
import type { BookingDetails } from '../backend';

export default function BookingFormCard() {
  const [formData, setFormData] = useState<BookingDetails>({
    name: '',
    phone: '',
    pickup: '',
    dropoff: '',
    date: '',
    time: '',
    vehicle: '',
    notes: '',
  });

  const [validationError, setValidationError] = useState('');
  const submitBooking = useSubmitBooking();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    // Validate required fields
    if (!formData.name.trim()) {
      setValidationError('Name is required');
      return;
    }
    if (!formData.phone.trim()) {
      setValidationError('Phone number is required');
      return;
    }
    if (!formData.pickup.trim()) {
      setValidationError('Pickup location is required');
      return;
    }
    if (!formData.dropoff.trim()) {
      setValidationError('Drop-off location is required');
      return;
    }
    if (!formData.date) {
      setValidationError('Date is required');
      return;
    }
    if (!formData.time) {
      setValidationError('Time is required');
      return;
    }
    if (!formData.vehicle) {
      setValidationError('Vehicle selection is required');
      return;
    }

    submitBooking.mutate(formData);
  };

  const handleReset = () => {
    setFormData({
      name: '',
      phone: '',
      pickup: '',
      dropoff: '',
      date: '',
      time: '',
      vehicle: '',
      notes: '',
    });
    setValidationError('');
    submitBooking.reset();
  };

  if (submitBooking.isSuccess && submitBooking.data) {
    return (
      <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700/50 shadow-2xl">
        <CardContent className="pt-12 pb-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 mb-6">
            <CheckCircle2 className="w-8 h-8 text-green-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Booking Request Submitted</h3>
          <p className="text-slate-400 mb-2">Your booking ID is:</p>
          <p className="text-3xl font-bold text-yellow-400 mb-6">#{submitBooking.data.toString()}</p>
          <p className="text-slate-400 mb-8">
            Please save this ID to check your booking status later.
          </p>
          <Button
            onClick={handleReset}
            className="bg-yellow-400 text-slate-900 hover:bg-yellow-500 font-semibold"
          >
            Make Another Booking
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700/50 shadow-2xl">
      <CardHeader>
        <CardTitle className="text-2xl text-white">Book Your Ride</CardTitle>
        <CardDescription className="text-slate-400">
          Fill in the details below to request a booking
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-300">
                Name *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Your full name"
                className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-yellow-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-slate-300">
                Phone Number *
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Your contact number"
                className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-yellow-400"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pickup" className="text-slate-300">
              Pickup Location *
            </Label>
            <Input
              id="pickup"
              value={formData.pickup}
              onChange={(e) => setFormData({ ...formData, pickup: e.target.value })}
              placeholder="Where should we pick you up?"
              className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-yellow-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dropoff" className="text-slate-300">
              Drop-off Location *
            </Label>
            <Input
              id="dropoff"
              value={formData.dropoff}
              onChange={(e) => setFormData({ ...formData, dropoff: e.target.value })}
              placeholder="Where do you want to go?"
              className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-yellow-400"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="text-slate-300">
                Date *
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-yellow-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time" className="text-slate-300">
                Time *
              </Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-yellow-400"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="vehicle" className="text-slate-300">
              Select Vehicle *
            </Label>
            <Select value={formData.vehicle} onValueChange={(value) => setFormData({ ...formData, vehicle: value })}>
              <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white focus:border-yellow-400">
                <SelectValue placeholder="Choose a vehicle" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {VEHICLES.map((vehicle) => (
                  <SelectItem key={vehicle.id} value={vehicle.name} className="text-white focus:bg-slate-700">
                    {vehicle.name} - {vehicle.driver}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-slate-300">
              Additional Notes
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Any special requirements or instructions?"
              rows={3}
              className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-yellow-400 resize-none"
            />
          </div>

          {validationError && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {validationError}
            </div>
          )}

          {submitBooking.isError && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              Failed to submit booking. Please try again.
            </div>
          )}

          <Button
            type="submit"
            disabled={submitBooking.isPending}
            className="w-full bg-yellow-400 text-slate-900 hover:bg-yellow-500 font-semibold text-lg py-6"
          >
            {submitBooking.isPending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Booking Request'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
