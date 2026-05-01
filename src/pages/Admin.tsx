import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Calendar as CalendarIcon, Users, Clock, Plus, Trash2, LayoutDashboard, LogOut, Video } from 'lucide-react';
import { format, addMinutes, parse } from 'date-fns';

export const Admin = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'slots' | 'bookings'>('overview');
  const [bookings, setBookings] = useState<any[]>([]);
  const [slots, setSlots] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Slot creation state
  const [newSlotDate, setNewSlotDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [newSlotTime, setNewSlotTime] = useState('09:00');
  const [duration, setDuration] = useState(30);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    const { data: bookingData } = await supabase.from('bookings').select('*').order('created_at', { ascending: false });
    const { data: slotData } = await supabase.from('slots').select('*').order('date', { ascending: true }).order('start_time', { ascending: true });
    
    if (bookingData) setBookings(bookingData);
    if (slotData) setSlots(slotData);
    setIsLoading(false);
  };

  const handleAddSlot = async () => {
    try {
      const endTime = format(addMinutes(parse(newSlotTime, 'HH:mm', new Date()), duration), 'HH:mm');
      
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/slots`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: newSlotDate,
          start_time: newSlotTime,
          end_time: endTime,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create slot');
      }
      
      fetchData();
    } catch (error) {
      alert('Error creating slot: ' + error.message);
    }
  };

  const handleDeleteSlot = async (id: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/slots/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete slot');
      fetchData();
    } catch (error) {
      alert('Error deleting slot: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F5F7FA] animate-fade-in">
      {/* Sidebar */}
      <div className="w-72 bg-zoom-dark p-8 flex flex-col gap-10 text-white">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-xl">
            <Video size={24} className="text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">Admin<span className="text-blue-500">Center</span></span>
        </div>

        <nav className="flex flex-col gap-3">
          {[
            { id: 'overview', label: 'Overview', icon: LayoutDashboard },
            { id: 'slots', label: 'Manage Slots', icon: Clock },
            { id: 'bookings', label: 'Recent Bookings', icon: Users },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`
                flex items-center gap-3 px-5 py-4 rounded-xl transition-all font-medium
                ${activeTab === item.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-gray-400 hover:text-white hover:bg-white/5'}
              `}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto">
          <button className="flex items-center gap-3 px-5 py-4 text-red-400 hover:bg-red-500/10 w-full rounded-xl transition-all font-medium">
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-12 overflow-y-auto">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-extrabold text-[#000333] mb-2 capitalize">{activeTab}</h1>
            <p className="text-gray-500 text-lg">Your consultation command center.</p>
          </div>
          <div className="bg-white p-3 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-3 font-semibold">
            <CalendarIcon className="text-blue-600" size={20} />
            {format(new Date(), 'EEE, MMM d')}
          </div>
        </header>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-3 gap-8 animate-fade-in">
            <div className="card p-8 border-t-4 border-blue-600">
              <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-4">Confirmed Bookings</p>
              <h3 className="text-5xl font-black text-zoom-dark">{bookings.length}</h3>
            </div>
            <div className="card p-8 border-t-4 border-purple-600">
              <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-4">Total Capacity</p>
              <h3 className="text-5xl font-black text-[#000333]">{slots.length}</h3>
            </div>
            <div className="card p-8 border-t-4 border-green-500">
              <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-4">Available Slots</p>
              <h3 className="text-5xl font-black text-[#000333]">{slots.filter(s => !s.is_booked).length}</h3>
            </div>
          </div>
        )}

        {activeTab === 'slots' && (
          <div className="space-y-8 animate-fade-in">
            <div className="card p-8">
              <h3 className="text-xl font-bold mb-6">Create New Availability</h3>
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <label className="block text-sm font-bold text-gray-500 mb-2 uppercase tracking-wide">Date</label>
                  <input type="date" value={newSlotDate} onChange={e => setNewSlotDate(e.target.value)} className="w-full" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-bold text-gray-500 mb-2 uppercase tracking-wide">Start Time</label>
                  <input type="time" value={newSlotTime} onChange={e => setNewSlotTime(e.target.value)} className="w-full" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-bold text-gray-500 mb-2 uppercase tracking-wide">Duration</label>
                  <select 
                    value={duration} 
                    onChange={e => setDuration(Number(e.target.value))}
                    className="w-full h-[48px] bg-white border border-gray-200 rounded-xl px-4 font-semibold"
                  >
                    <option value={15}>15 Minutes</option>
                    <option value={30}>30 Minutes</option>
                    <option value={45}>45 Minutes</option>
                    <option value={60}>60 Minutes</option>
                  </select>
                </div>
                <button onClick={handleAddSlot} className="btn-zoom h-[48px] px-8">
                  <Plus size={20} /> Add Slot
                </button>
              </div>
            </div>

            <div className="card overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-8 py-5 font-bold text-gray-600 uppercase text-xs tracking-widest">Date</th>
                    <th className="px-8 py-5 font-bold text-gray-600 uppercase text-xs tracking-widest">Time Range</th>
                    <th className="px-8 py-5 font-bold text-gray-600 uppercase text-xs tracking-widest">Status</th>
                    <th className="px-8 py-5 font-bold text-gray-600 uppercase text-xs tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {slots.map((slot) => (
                    <tr key={slot.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-8 py-5 font-semibold">{format(new Date(slot.date), 'MMM d, yyyy')}</td>
                      <td className="px-8 py-5">
                        <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-sm font-bold">
                          {slot.start_time.substring(0, 5)} - {slot.end_time.substring(0, 5)}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        {slot.is_booked ? (
                          <span className="text-red-500 font-bold text-sm">Booked</span>
                        ) : (
                          <span className="text-green-500 font-bold text-sm">Available</span>
                        )}
                      </td>
                      <td className="px-8 py-5 text-right">
                        {!slot.is_booked && (
                          <button onClick={() => handleDeleteSlot(slot.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                            <Trash2 size={20} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="card overflow-hidden animate-fade-in">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-8 py-5 font-bold text-gray-600 uppercase text-xs tracking-widest">Client Name</th>
                  <th className="px-8 py-5 font-bold text-gray-600 uppercase text-xs tracking-widest">Schedule</th>
                  <th className="px-8 py-5 font-bold text-gray-600 uppercase text-xs tracking-widest">Zoom Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-5">
                      <div className="font-bold text-[#000333]">{booking.client_name}</div>
                      <div className="text-sm text-gray-500">{booking.client_email}</div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="font-semibold">{format(new Date(booking.booking_date), 'MMM d')}</div>
                      <div className="text-sm text-blue-600 font-bold">{booking.booking_time}</div>
                    </td>
                    <td className="px-8 py-5">
                      <a href={booking.zoom_link} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline font-medium">
                        Join Meeting
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
