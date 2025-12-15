import { useState, useMemo } from 'react';
import ChildCard from '../ui/ChildCard';
import ConfirmationModal from '../ui/ConfirmationModal';
import { Filter, FileText } from 'lucide-react';
import jsPDF from 'jspdf';

export default function Selection({ currentUser, childrenList, onSelectChild, onDeselectChild, onResetCycle, onSync, onCorrectAges }) {
    const [activeFilter, setActiveFilter] = useState('todos'); // todos, bebes, ninos, grandes
    const [selectedChildForModal, setSelectedChildForModal] = useState(null);

    const filteredChildren = useMemo(() => {
        return childrenList.filter(child => {
            // Sort logic: Available first, then by ID
            if (activeFilter === 'todos') return true;
            if (activeFilter === 'bebes') return child.age <= 3;
            if (activeFilter === 'ninos') return child.age >= 4 && child.age <= 8;
            if (activeFilter === 'grandes') return child.age >= 9;
            return true;
        }).sort((a, b) => {
            // Sort: Unselected first, then by ID
            if (a.selectedBy === null && b.selectedBy !== null) return -1;
            if (a.selectedBy !== null && b.selectedBy === null) return 1;
            return a.id - b.id;
        });
    }, [childrenList, activeFilter]);

    const handleSelectClick = (child) => {
        onSelectChild(child.id);
        setSelectedChildForModal(child);
    };

    const closeModal = () => {
        setSelectedChildForModal(null);
    };

    const generateWeeklyReport = () => {
        const doc = new jsPDF();
        const timestamp = new Date().toLocaleString();
        const totalAssigned = childrenList.filter(c => c.selectedBy !== null).length;

        // Header
        doc.setFontSize(22);
        doc.text("Reporte Ministerio Niños", 105, 20, { align: "center" });

        doc.setFontSize(12);
        doc.text(`Fecha de reporte: ${timestamp}`, 20, 35);
        doc.text(`Total asignados: ${totalAssigned} / ${childrenList.length}`, 20, 42);

        // Table Header
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text("Resumen de Asignaciones:", 20, 55);

        // List
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');

        let yPos = 65;
        const lineHeight = 7;
        const pageHeight = doc.internal.pageSize.height;

        const assignedChildren = childrenList.filter(c => c.selectedBy !== null);

        if (assignedChildren.length === 0) {
            doc.text("Aún no hay niños asignados.", 20, yPos);
        } else {
            assignedChildren.forEach((child, index) => {
                // Check for new page
                if (yPos > pageHeight - 20) {
                    doc.addPage();
                    yPos = 20;
                }

                const line = `${index + 1}. [${child.name.padEnd(30, ' ')}] -- Apadrinado por: ${child.selectedBy}`;
                doc.text(line, 20, yPos);
                yPos += lineHeight;
            });
        }

        // Save
        const safeTime = new Date().toISOString().replace(/[:.]/g, '-');
        doc.save(`reporte_domingo_${safeTime}.pdf`);
    };

    // Filter Button Component
    const FilterBtn = ({ id, label, count }) => (
        <button
            onClick={() => setActiveFilter(id)}
            className={`
        px-6 py-4 rounded-xl font-bold text-lg md:text-xl transition-all border-2
        ${activeFilter === id
                    ? 'bg-brand-dark text-white border-brand-dark shadow-lg scale-105'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
                }
      `}
        >
            {label}
            <span className="ml-2 text-sm opacity-60">({count})</span>
        </button>
    );

    // Counts for filters
    const counts = {
        todos: childrenList.length,
        bebes: childrenList.filter(c => c.age <= 3).length,
        ninos: childrenList.filter(c => c.age >= 4 && c.age <= 8).length,
        grandes: childrenList.filter(c => c.age >= 9).length,
    };

    return (
        <div className="animate-in fade-in duration-500 pb-20">
            {/* Welcome Header */}
            <div className="mb-10 text-center">
                <h2 className="text-2xl md:text-4xl text-gray-700 mb-2">
                    Hola, <span className="font-bold text-brand-blue">{currentUser.name}</span>
                </h2>
                <p className="text-xl text-gray-500">
                    Por favor, selecciona a quién deseas apadrinar hoy:
                </p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap justify-center gap-4 mb-10">
                <FilterBtn id="todos" label="Todos" count={counts.todos} />
                <FilterBtn id="bebes" label="Bebés (0-3)" count={counts.bebes} />
                <FilterBtn id="ninos" label="Niños (4-8)" count={counts.ninos} />
                <FilterBtn id="grandes" label="Grandes (9+)" count={counts.grandes} />
            </div>

            {/* Grid */}
            {filteredChildren.length === 0 ? (
                <div className="text-center py-20 text-gray-400 text-xl">
                    No se encontraron niños en esta categoría.
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredChildren.map(child => (
                        <ChildCard
                            key={child.id}
                            child={child}
                            onSelect={handleSelectClick}
                            onDeselect={onDeselectChild}
                        />
                    ))}
                </div>
            )}

            {/* Footer Actions */}
            <div className="mt-20 flex flex-col items-center justify-center gap-8 border-t-2 border-dashed border-gray-200 pt-12">
                <button
                    onClick={generateWeeklyReport}
                    className="flex items-center gap-3 bg-brand-blue hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-xl shadow-xl text-xl transition-transform active:scale-95"
                >
                    <FileText size={24} />
                    📄 Descargar PDF
                </button>

                <button
                    onClick={onSync}
                    className="flex items-center gap-3 bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-10 rounded-xl shadow-xl text-xl transition-transform active:scale-95"
                >
                    ☁️ Sincronizar Nuevos
                </button>

                <button
                    onClick={onCorrectAges}
                    className="flex items-center gap-3 bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 px-10 rounded-xl shadow-xl text-xl transition-transform active:scale-95"
                >
                    🛠️ Corregir Edades
                </button>

                <button
                    onClick={onResetCycle}
                    className="text-sm text-gray-300 hover:text-red-400 hover:underline transition-colors font-mono cursor-pointer"
                >
                    [Administración: Reiniciar Ciclo]
                </button>
            </div>

            {/* Modal */}
            {selectedChildForModal && (
                <ConfirmationModal
                    childName={selectedChildForModal.name}
                    tutorName={currentUser.name}
                    onClose={closeModal}
                />
            )}
        </div>
    );
}
