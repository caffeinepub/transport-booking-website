import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Phone, Mail, Upload } from 'lucide-react';

export default function OwnerSection() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Use the uploaded owner image as default, or custom preview if selected
  const displayImage = imagePreview || '/assets/IMG-20250504-WA0039_Original-1.jpeg';

  return (
    <section className="py-16 px-4 bg-slate-950/30">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Meet the Owner</h2>
          <p className="text-slate-400 text-lg">Your trusted transport service provider</p>
        </div>

        <div className="max-w-md mx-auto">
          <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700/50 shadow-2xl">
            <CardContent className="p-8 text-center">
              <div className="relative inline-block mb-6">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-yellow-400 shadow-lg shadow-yellow-400/20">
                  <img src={displayImage} alt="Owner" className="w-full h-full object-cover" />
                </div>
                <label
                  htmlFor="owner-image"
                  className="absolute bottom-0 right-0 w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center cursor-pointer hover:bg-yellow-500 transition-colors shadow-lg"
                >
                  <Upload className="w-5 h-5 text-slate-900" />
                  <input
                    id="owner-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>

              <h3 className="text-2xl font-bold text-white mb-1">Manoj Kumar Das</h3>
              <p className="text-yellow-400 font-semibold mb-6">Owner</p>

              <div className="space-y-3">
                <Button
                  asChild
                  className="w-full bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
                >
                  <a href="tel:8294950710">
                    <Phone className="mr-2 h-4 w-4" />
                    8294950710
                  </a>
                </Button>

                <Button
                  asChild
                  className="w-full bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
                >
                  <a href="mailto:riteshdas58888@gmail.com">
                    <Mail className="mr-2 h-4 w-4" />
                    riteshdas58888@gmail.com
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
