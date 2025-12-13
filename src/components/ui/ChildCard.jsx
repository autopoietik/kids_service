import { User, Calendar, Heart } from 'lucide-react';

const formatAge = (age) => {
    if (age < 1) {
        const months = Math.round(age * 12);
        return `${months} meses`;
    }
    return `${age} años`;
};

export default function ChildCard({ child, onSelect }) {
    const isSelected = child.selectedBy !== null;

    return (
        <div className={`
      relative overflow-hidden rounded-2xl border-2 transition-all duration-300 shadow-sm
      ${isSelected
                ? 'bg-gray-100 border-gray-200 opacity-90'
                : 'bg-white border-transparent hover:border-brand-blue hover:shadow-xl transform hover:-translate-y-1'
            }
    `}>
            <div className="p-6 flex flex-col h-full justify-between min-h-[320px]">
                {/* Header Data */}
                <div className="flex justify-between items-start mb-4">
                    <div className="bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2">
                        <User size={16} />
                        #{child.id}
                    </div>
                    {isSelected && (
                        <div className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2">
                            <Heart size={16} className="fill-current" />
                            Apadrinado
                        </div>
                    )}
                </div>

                {/* Main Content */}
                <div className="text-center space-y-2 mb-6">
                    <div className="inline-block p-4 bg-brand-bg rounded-full mb-2">
                        <User size={48} className="text-gray-400" />
                    </div>

                    <h3 className="text-2xl font-bold text-brand-dark leading-tight line-clamp-2 min-h-[3.5rem] flex items-center justify-center">
                        {child.name}
                    </h3>

                    <div className="flex justify-center items-center gap-2 text-gray-500 font-medium text-lg">
                        <Calendar size={20} />
                        {formatAge(child.age)}
                    </div>

                    <div className="text-sm text-gray-400 mt-2">
                        Ministerio: {child.ministry}
                    </div>
                </div>

                {/* Action Button */}
                <div>
                    {isSelected ? (
                        <button
                            disabled
                            className="w-full bg-gray-200 text-gray-500 font-bold py-4 rounded-xl cursor-not-allowed border-2 border-gray-300"
                        >
                            Elegido por:
                            <br />
                            {child.selectedBy}
                        </button>
                    ) : (
                        <button
                            onClick={() => onSelect(child)}
                            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold text-xl py-4 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
                        >
                            ELEGIR NIÑO
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
