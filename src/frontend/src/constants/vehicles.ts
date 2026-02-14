export interface Vehicle {
  id: string;
  name: string;
  driver: string;
  image: string;
}

export const VEHICLES: Vehicle[] = [
  {
    id: 'pickup-1',
    name: 'Pickup Truck',
    driver: 'Mukesh',
    image: '/assets/generated/vehicle-pickup-truck-1.dim_1200x800.png',
  },
  {
    id: 'pickup-2',
    name: 'Pickup Truck',
    driver: 'Jainul',
    image: '/assets/generated/vehicle-pickup-truck-2.dim_1200x800.png',
  },
  {
    id: 'pickup-3',
    name: 'Pickup Truck',
    driver: 'Hazrat',
    image: '/assets/generated/vehicle-pickup-truck-3.dim_1200x800.png',
  },
  {
    id: 'innova',
    name: 'Innova Crysta',
    driver: 'Sukumar Ruj',
    image: '/assets/generated/vehicle-innova-crysta.dim_1200x800.png',
  },
  {
    id: 'tractor',
    name: 'Mahindra Tractor',
    driver: 'Manjhalo',
    image: '/assets/generated/vehicle-mahindra-tractor.dim_1200x800.png',
  },
];
