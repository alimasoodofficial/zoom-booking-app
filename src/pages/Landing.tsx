import { Video, Calendar, Zap, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Landing = () => {
  return (
    <div className="animate-fade-in">
      {/* Header */}
      <header className="py-6 border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="section-container flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <Video className="text-white" size={24} />
            </div>
            <span className="text-2xl font-bold tracking-tight">Zoom<span className="text-zoom-blue">Booking</span></span>
          </div>
          <nav className="hidden md:flex gap-8 font-medium text-gray-600">
            <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
            <a href="#solutions" className="hover:text-blue-600 transition-colors">Solutions</a>
            <a href="#pricing" className="hover:text-blue-600 transition-colors">Pricing</a>
          </nav>
          <Link to="/admin" className="text-sm font-semibold text-gray-500 hover:text-blue-600">Admin Login</Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-blue-50/50 to-white">
        <div className="section-container grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight text-zoom-dark">
              Consultations Made <span className="text-zoom-blue">Simple.</span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed">
              Schedule Zoom meetings instantly. Our platform handles availability, 
              meeting generation, and email notifications so you can focus on what matters.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/book" className="btn-zoom py-4 px-8 text-lg">
                Book a Consultation <ArrowRight size={20} />
              </Link>
              <button className="btn-secondary py-4 px-8 text-lg">View Demo</button>
            </div>
          </div>
          <div className="relative">
            <div className="bg-blue-600/5 rounded-3xl p-4 transform rotate-2">
              <img 
                src="https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?auto=format&fit=crop&q=80&w=1000" 
                alt="Zoom Meeting" 
                className="rounded-2xl shadow-2xl transform -rotate-2"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-white">
        <div className="section-container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Everything you need to grow</h2>
            <p className="text-gray-500 text-lg">Powering millions of meetings across the globe.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                icon: <Calendar className="text-blue-600" />, 
                title: 'Smart Scheduling', 
                desc: 'Real-time availability syncing with custom time slots.' 
              },
              { 
                icon: <Video className="text-blue-600" />, 
                title: 'Zoom Integration', 
                desc: 'Automatic meeting link generation for every booking.' 
              },
              { 
                icon: <Zap className="text-blue-600" />, 
                title: 'Instant Emails', 
                desc: 'Confirmations and calendar invites sent automatically.' 
              }
            ].map((feature, i) => (
              <div key={i} className="p-8 border border-gray-100 rounded-2xl hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-50 border-t border-gray-200">
        <div className="section-container text-center">
          <p className="text-gray-500">© 2026 ZoomBooking App. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
