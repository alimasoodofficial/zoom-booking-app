import { Clock } from 'lucide-react';

interface TimeSlotPickerProps {
  slots: string[];
  selectedSlot: string | null;
  onSlotSelect: (slot: string) => void;
}

export const TimeSlotPicker = ({ slots, selectedSlot, onSlotSelect }: TimeSlotPickerProps) => {
  return (
    <div className="glass-card p-6 w-full animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-blue-50 p-2 rounded-lg">
          <Clock className="text-zoom-blue" size={20} />
        </div>
        <h3 className="text-xl font-bold text-zoom-dark">Select Time</h3>
      </div>

      {slots.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-400 italic">No available slots for this date.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {slots.map((slot) => (
            <button
              key={slot}
              onClick={() => onSlotSelect(slot)}
              className={`
                py-3 px-4 rounded-xl border-2 text-sm font-bold transition-all
                ${selectedSlot === slot 
                  ? 'bg-[#0B5CFF] border-[#0B5CFF] text-white shadow-md' 
                  : 'bg-white border-gray-100 hover:border-blue-200 text-gray-700 hover:text-[#0B5CFF]'}
              `}
            >
              {slot}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
