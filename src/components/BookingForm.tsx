import { useState } from 'react';
import { Mail, User, Phone, MessageSquare } from 'lucide-react';

interface BookingFormProps {
  onSubmit: (data: any) => void;
  isLoading: boolean;
}

export const BookingForm = ({ onSubmit, isLoading }: BookingFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card p-8 w-full max-w-md animate-fade-in space-y-6">
      <h3 className="text-2xl font-bold mb-6">Your Information</h3>
      
      <div className="space-y-4">
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Full Name"
            className="w-full pl-10"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="email"
            placeholder="Email Address"
            className="w-full pl-10"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="tel"
            placeholder="Phone Number"
            className="w-full pl-10"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>

        <div className="relative">
          <MessageSquare className="absolute left-3 top-4 text-gray-400" size={18} />
          <textarea
            placeholder="Additional Notes (Optional)"
            className="w-full pl-10 pt-3 min-h-[100px] bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-blue-500 transition-all"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="btn-primary w-full justify-center py-4 text-lg"
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Processing...
          </div>
        ) : (
          'Confirm Booking'
        )}
      </button>
    </form>
  );
};
