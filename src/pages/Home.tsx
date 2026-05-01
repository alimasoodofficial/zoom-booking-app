import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar } from '../components/Calendar';
import { TimeSlotPicker } from '../components/TimeSlotPicker';
import { BookingForm } from '../components/BookingForm';
import { supabase } from '../lib/supabaseClient';
import { Video, Calendar as CalendarIcon, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export const Home = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [availableSlots, setAvailableSlots] = useState<{id: string, time: string}[]>([]);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [meetingInfo, setMeetingInfo] = useState<any>(null);

  useEffect(() => {
    fetchAvailableSlots();
  }, [selectedDate]);

  const fetchAvailableSlots = async () => {
    const formattedDate = format(selectedDate, 'yyyy-MM-dd');
    const { data, error } = await supabase
      .from('slots')
      .select('*')
      .eq('date', formattedDate)
      .eq('is_booked', false);

    if (error) {
      console.error('Error fetching slots:', error);
      return;
    }

    if (data) {
      const formattedSlots = data.map(slot => ({
        id: slot.id,
        time: slot.start_time.substring(0, 5) // Format to HH:mm
      }));
      setAvailableSlots(formattedSlots);
    }
    setSelectedSlot(null);
  };

  const handleBookingSubmit = async (userData: any) => {
    setIsLoading(true);
    try {
      const startTime = new Date(selectedDate);
      const [hours, minutes] = selectedSlot!.split(':');
      startTime.setHours(parseInt(hours), parseInt(minutes), 0);

      const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';
      const response = await axios.post(`${serverUrl}/api/create-meeting`, {
        name: userData.name,
        email: userData.email,
        startTime: startTime.toISOString(),
        topic: 'Business Consultation'
      });

      if (response.data.success) {
        // Save to Supabase
        const { error: bookingError } = await supabase.from('bookings').insert([{
          slot_id: selectedSlotId,
          client_name: userData.name,
          client_email: userData.email,
          client_phone: userData.phone,
          booking_date: selectedDate.toISOString(),
          booking_time: selectedSlot,
          zoom_link: response.data.meetingLink,
          notes: userData.notes
        }]);

        if (bookingError) throw bookingError;

        // Mark slot as booked
        await supabase
          .from('slots')
          .update({ is_booked: true })
          .eq('id', selectedSlotId);
        
        setMeetingInfo(response.data);
        setIsSuccess(true);
      }
    } catch (error) {
      console.error('Booking failed:', error);
      alert('Failed to book. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 animate-fade-in">
        <div className="card p-12 text-center max-w-lg shadow-xl">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="text-green-500" size={40} />
          </div>
          <h2 className="text-3xl font-bold mb-4">Confirmed!</h2>
          <p className="text-gray-500 mb-8">
            Your Zoom consultation is set. A confirmation email has been sent to your inbox.
          </p>
          <div className="bg-blue-50/50 p-6 rounded-2xl mb-8 text-left border border-blue-100">
            <p className="text-sm text-blue-600 font-bold uppercase mb-2">Meeting Details</p>
            <p className="text-lg font-bold mb-1 text-gray-900">Business Consultation</p>
            <p className="text-gray-600 mb-4">{new Date(meetingInfo.data.start_time).toLocaleString()}</p>
            <a 
              href={meetingInfo.meetingLink} 
              target="_blank" 
              rel="noreferrer"
              className="btn-zoom justify-center w-full"
            >
              <Video size={18} /> Join Zoom Meeting
            </a>
          </div>
          <Link to="/" className="text-blue-600 font-semibold hover:underline">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 mb-10 font-medium transition-colors">
          <ArrowLeft size={18} /> Back to overview
        </Link>

        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold mb-4 text-[#000333]">
            Select a <span className="text-blue-600">Time Slot</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Choose from the available slots highlighted below to schedule your consultation.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 justify-center items-start">
          <div className="flex flex-col gap-8 w-full max-w-md">
            <div className={`transition-all duration-300 ${step > 1 ? 'opacity-40' : ''}`}>
              <div className="flex items-center gap-2 mb-4 text-gray-900 font-bold">
                <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm">1</span>
                Pick a Date
              </div>
              <Calendar selectedDate={selectedDate} onDateSelect={(date) => { setSelectedDate(date); setStep(1); }} />
            </div>

            <div className={`transition-all duration-300 ${step === 1 ? 'opacity-100' : 'opacity-40'}`}>
              <div className="flex items-center gap-2 mb-4 text-gray-900 font-bold">
                <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm">2</span>
                Available Slots
              </div>
              <TimeSlotPicker 
                slots={availableSlots.map(s => s.time)} 
                selectedSlot={selectedSlot} 
                onSlotSelect={(slot) => { 
                  setSelectedSlot(slot); 
                  setSelectedSlotId(availableSlots.find(s => s.time === slot)?.id || null);
                  setStep(2); 
                }} 
              />
            </div>
          </div>

          <div className={`w-full max-w-md transition-all duration-300 ${step < 2 ? 'opacity-20 blur-[2px] pointer-events-none' : 'opacity-100'}`}>
            <div className="flex items-center gap-2 mb-4 text-gray-900 font-bold">
              <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm">3</span>
              Personal Information
            </div>
            <BookingForm onSubmit={handleBookingSubmit} isLoading={isLoading} />
            
            {selectedSlot && (
              <div className="mt-6 p-5 bg-white border border-blue-200 rounded-2xl flex items-center gap-4 shadow-sm">
                <div className="bg-blue-50 p-3 rounded-xl">
                  <CalendarIcon className="text-blue-600" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Selected Session</p>
                  <p className="font-bold text-gray-900">{format(selectedDate, 'EEEE, MMMM d')} at {selectedSlot}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
