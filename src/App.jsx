import { useState, useEffect } from 'react';
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  setDoc,
  writeBatch,
  getDocs,
  query,
  orderBy,
  getDoc
} from 'firebase/firestore';
import { db } from './firebase';
import Identification from './components/views/Identification';
import Selection from './components/views/Selection';
import { MUTUAL_TUTORS_DATA } from './data/tutors';
import { CHILDREN_DATA } from './data/children';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [childrenList, setChildrenList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Real-time synchronization
  useEffect(() => {
    const q = query(collection(db, "children"), orderBy("id"));

    // Listening to changes
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const children = snapshot.docs.map(doc => ({
        ...doc.data(),
        // Ensure id is number if needed by other components, or keep as is from DB
        id: doc.id
      })).sort((a, b) => Number(a.id) - Number(b.id)); // Sort numerically

      setChildrenList(children);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching children:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = (user) => {
    setCurrentUser(user);
  };

  const handleSelectChild = async (childId) => {
    if (!currentUser) return;

    try {
      const childRef = doc(db, "children", String(childId));

      // Update the document
      await updateDoc(childRef, {
        selectedBy: currentUser.name
      });

      // Note: No need to setChildrenList manually, onSnapshot will handle it.
    } catch (error) {
      console.error("Error booking child:", error);
      alert("Hubo un error al intentar seleccionar. Revisa tu conexión.");
    }
  };

  // Seed / Reset Database
  const handleSeedDatabase = async () => {
    if (!window.confirm("¿Seguro que deseas inicializar/restaurar la base de datos de niños? Esto podría sobrescribir datos.")) return;

    try {
      setLoading(true);
      const batch = writeBatch(db);

      CHILDREN_DATA.forEach(child => {
        const docRef = doc(db, "children", String(child.id));
        // Reset selectedBy to null on seed, or keep child structure
        batch.set(docRef, {
          ...child,
          selectedBy: null
        });
      });

      await batch.commit();
      setLoading(false);
      alert("Base de datos inicializada correctamente.");
    } catch (error) {
      console.error("Error seeding DB:", error);
      setLoading(false);
      alert("Error al inicializar DB.");
    }
  };

  const handleSyncNewChildren = async () => {
    if (!window.confirm("¿Deseas sincronizar los nuevos niños a la base de datos? Esto NO borrará asignaciones existentes.")) return;

    try {
      setLoading(true);
      let addedCount = 0;

      for (const child of CHILDREN_DATA) {
        const docRef = doc(db, "children", String(child.id));
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          await setDoc(docRef, {
            ...child,
            selectedBy: null
          });
          addedCount++;
        }
      }

      setLoading(false);
      alert(`Proceso finalizado. Se agregaron ${addedCount} niños nuevos.`);
    } catch (error) {
      console.error("Error syncing children:", error);
      setLoading(false);
      alert("Hubo un error al sincronizar los nuevos registros.");
    }
  };

  const handleCorrectAges = async () => {
    if (!window.confirm("¿Deseas corregir las edades en la base de datos (IDs 12 y 50)?")) return;

    try {
      setLoading(true);
      const batch = writeBatch(db);

      // IDs to correct: 12 (Hannah), 50 (Jana), and 18 (Isabella Paredes)
      const updates = [
        { id: 12, age: 0.8 },
        { id: 50, age: 0.8 },
        { id: 18, age: 0.7 }
      ];

      for (const item of updates) {
        const docRef = doc(db, "children", String(item.id));
        // We only update the age field
        batch.update(docRef, { age: item.age });
      }

      await batch.commit();
      setLoading(false);
      alert("Edades corregidas exitosamente en Firestore.");
    } catch (error) {
      console.error("Error correcting ages:", error);
      setLoading(false);
      alert("Error al corregir edades.");
    }
  };

  const handleDeselectChild = async (child) => {
    // Confirmation dialog
    if (!window.confirm(`¿Estás seguro de que quieres LIBERAR el cupo de ${child.name}?`)) return;

    try {
      setLoading(true);
      const childRef = doc(db, "children", String(child.id));

      await updateDoc(childRef, {
        selectedBy: null
      });

      setLoading(false);
      // Toast or simple alert
      alert("Cupo liberado correctamente.");
    } catch (error) {
      console.error("Error deselecting child:", error);
      setLoading(false);
      alert("Error al liberar el cupo.");
    }
  };

  const handleResetCycle = async () => {
    const input = window.prompt("PELIGRO: Esto borrará todas las asignaciones.\n\nPara confirmar, escriba la palabra: AMOR");

    if (input && input.toUpperCase() === "AMOR") {
      try {
        setLoading(true);
        // Getting all docs to update them
        const querySnapshot = await getDocs(collection(db, "children"));
        const batch = writeBatch(db);

        querySnapshot.forEach((document) => {
          batch.update(document.ref, { selectedBy: null });
        });

        await batch.commit();
        setLoading(false);
        setCurrentUser(null);
        alert("¡Ciclo reiniciado correctamente! Todos las asignaciones han sido liberadas.");
      } catch (error) {
        console.error("Error resetting cycle:", error);
        setLoading(false);
        alert("Error al reiniciar el ciclo.");
      }
    } else if (input !== null) {
      alert("Código incorrecto. No se realizaron cambios.");
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg">
      <header className="bg-brand-dark text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">
            Servicio Kids - MCI
          </h1>
          <div className="flex gap-4 items-center">
            {/* Seed Button - Hidden/Visible as needed, maybe strictly for dev or empty list */}
            {childrenList.length === 0 && (
              <button
                onClick={handleSeedDatabase}
                className="text-xs bg-yellow-600 px-2 py-1 rounded hover:bg-yellow-500"
              >
                Inicializar DB
              </button>
            )}

            {currentUser && (
              <button
                onClick={() => setCurrentUser(null)}
                className="text-sm underline hover:text-gray-300"
              >
                Cerrar Sesión
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {!currentUser ? (
          <Identification
            tutorsData={MUTUAL_TUTORS_DATA}
            onLogin={handleLogin}
          />
        ) : (
          <Selection
            currentUser={currentUser}
            childrenList={childrenList}
            onSelectChild={handleSelectChild}
            onDeselectChild={handleDeselectChild}
            onResetCycle={handleResetCycle}
            onSync={handleSyncNewChildren}
            onCorrectAges={handleCorrectAges}
          />
        )}
      </main>
    </div>
  );
}

export default App;
