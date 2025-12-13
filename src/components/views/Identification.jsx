import { useState } from 'react';
import { UserCircle } from 'lucide-react';

export default function Identification({ tutorsData, onLogin }) {
    const [selectedGender, setSelectedGender] = useState(null); // 'male' | 'female' | null

    if (!selectedGender) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[80vh] w-full max-w-4xl mx-auto animate-in fade-in zoom-in duration-300">
                <h2 className="text-3xl md:text-5xl font-bold mb-12 text-center text-brand-dark">
                    ¿Quién eres?
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full px-4">
                    <button
                        onClick={() => setSelectedGender('female')}
                        className="flex flex-col items-center p-12 bg-pink-50 border-4 border-pink-200 rounded-3xl hover:bg-pink-100 hover:border-brand-pink transition-all group"
                    >
                        <div className="p-6 bg-white rounded-full text-brand-pink shadow-md mb-6 group-hover:scale-110 transition-transform">
                            <UserCircle size={80} />
                        </div>
                        <span className="text-3xl font-bold text-brand-pink">Soy Tutora</span>
                        <span className="text-lg text-gray-500 mt-2">Mujer</span>
                    </button>

                    <button
                        onClick={() => setSelectedGender('male')}
                        className="flex flex-col items-center p-12 bg-blue-50 border-4 border-blue-200 rounded-3xl hover:bg-blue-100 hover:border-brand-blue transition-all group"
                    >
                        <div className="p-6 bg-white rounded-full text-brand-blue shadow-md mb-6 group-hover:scale-110 transition-transform">
                            <UserCircle size={80} />
                        </div>
                        <span className="text-3xl font-bold text-brand-blue">Soy Tutor</span>
                        <span className="text-lg text-gray-500 mt-2">Hombre</span>
                    </button>
                </div>
            </div>
        );
    }

    const list = tutorsData[selectedGender];
    const accentColor = selectedGender === 'female' ? 'text-brand-pink' : 'text-brand-blue';
    const buttonStyle = selectedGender === 'female'
        ? 'bg-white text-brand-pink border-brand-pink hover:bg-pink-50'
        : 'bg-white text-brand-blue border-brand-blue hover:bg-blue-50';

    return (
        <div className="max-w-4xl mx-auto animate-in slide-in-from-right duration-300">
            <button
                onClick={() => setSelectedGender(null)}
                className="mb-8 text-gray-500 hover:text-brand-dark flex items-center text-lg font-medium"
            >
                ← Volver atrás
            </button>

            <h2 className={`text-3xl md:text-4xl font-bold mb-8 text-center ${accentColor}`}>
                Busca tu nombre en la lista:
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {list.map((user) => (
                    <button
                        key={user.id}
                        onClick={() => onLogin(user)}
                        className={`
              ${buttonStyle} 
              p-6 text-xl font-bold rounded-xl border-2 shadow-sm transition-all hover:shadow-lg
              min-h-[80px] flex items-center justify-center text-center
            `}
                    >
                        {user.name}
                    </button>
                ))}
            </div>
        </div>
    );
}
