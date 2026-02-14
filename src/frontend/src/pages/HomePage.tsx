import BookingFormCard from '../components/BookingFormCard';
import VehiclesSection from '../components/VehiclesSection';
import OwnerSection from '../components/OwnerSection';
import { ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-950/50 to-transparent pointer-events-none" />

        <div className="container mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="text-center lg:text-left space-y-6 animate-in fade-in slide-in-from-left-8 duration-700">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                Book Reliable Transport{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500">
                  Instantly
                </span>
              </h1>
              <p className="text-xl text-slate-400 max-w-xl">
                Professional drivers, well-maintained vehicles, and seamless booking experience for all your
                transportation needs.
              </p>
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <div className="flex items-center space-x-2 text-slate-300">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span>Available 24/7</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-300">
                  <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                  <span>Instant Confirmation</span>
                </div>
              </div>
            </div>

            {/* Booking Form */}
            <div className="animate-in fade-in slide-in-from-right-8 duration-700 delay-150">
              <BookingFormCard />
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-yellow-400/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-slate-950/30">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Easy Booking',
                description: 'Simple and quick booking process with instant confirmation',
                icon: '🚀',
              },
              {
                title: 'Professional Drivers',
                description: 'Experienced and verified drivers for your safety and comfort',
                icon: '👨‍✈️',
              },
              {
                title: 'Track Status',
                description: 'Real-time booking status updates and notifications',
                icon: '📍',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl bg-slate-900/30 backdrop-blur-sm border border-slate-700/50 hover:border-yellow-400/50 transition-all duration-300 group"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vehicles Section */}
      <VehiclesSection />

      {/* Owner Section */}
      <OwnerSection />

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto p-12 rounded-3xl bg-gradient-to-br from-yellow-400/10 to-amber-500/10 border border-yellow-400/20">
            <h2 className="text-4xl font-bold text-white mb-4">Ready to Book Your Ride?</h2>
            <p className="text-slate-400 text-lg mb-8">
              Get started with your booking today and experience hassle-free transportation
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="inline-flex items-center px-8 py-4 bg-yellow-400 text-slate-900 font-semibold rounded-xl hover:bg-yellow-500 transition-all duration-200 shadow-lg shadow-yellow-400/20 hover:shadow-yellow-400/40 hover:scale-105"
            >
              Book Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
