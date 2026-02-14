import { Card, CardContent } from './ui/card';
import { VEHICLES } from '../constants/vehicles';
import { User } from 'lucide-react';

export default function VehiclesSection() {
  const getVehicleImage = (vehicle: typeof VEHICLES[0]) => {
    // Use uploaded image for all Pickup Trucks
    if (vehicle.name === 'Pickup Truck') {
      return '/assets/IMG_6733-1.jpeg';
    }
    return vehicle.image;
  };

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Our Fleet</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Choose from our range of well-maintained vehicles with experienced drivers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {VEHICLES.map((vehicle) => (
            <Card
              key={vehicle.id}
              className="bg-slate-900/50 backdrop-blur-sm border-slate-700/50 overflow-hidden hover:border-yellow-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-yellow-400/10 group"
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={getVehicleImage(vehicle)}
                  alt={vehicle.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">{vehicle.name}</h3>
                <div className="flex items-center text-slate-400">
                  <User className="w-4 h-4 mr-2" />
                  <span>Driver: {vehicle.driver}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
