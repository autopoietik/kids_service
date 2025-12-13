import { CheckCircle, X } from 'lucide-react';

export default function ConfirmationModal({ childName, tutorName, onClose }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all scale-100 p-8 text-center relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2"
                >
                    <X size={32} />
                </button>

                <div className="flex justify-center mb-6">
                    <CheckCircle className="text-green-500 w-24 h-24" />
                </div>

                <h2 className="text-3xl font-bold text-brand-dark mb-4">
                    ¡Gracias, {tutorName}!
                </h2>

                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                    Has elegido apadrinar a:
                    <br />
                    <span className="text-green-600 font-extrabold text-2xl mt-2 block">
                        {childName}
                    </span>
                </p>

                <button
                    onClick={onClose}
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-bold text-xl py-4 px-8 rounded-xl transition-transform active:scale-95 shadow-lg"
                >
                    Excelente
                </button>
            </div>
        </div>
    );
}
