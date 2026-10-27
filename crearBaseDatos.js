import { db } from "./src/firebaseConfig.js";
import { doc, writeBatch } from "firebase/firestore";

const TOTAL_TICKETS = 10000;
const BATCH_SIZE = 500;

async function crearBaseDatos() {
  console.log("Iniciando la creación/regeneración de 10,000 tickets en Firestore...");
  const startTime = Date.now();

  try {
    let currentBatch = writeBatch(db);
    let countInBatch = 0;
    let batchNumber = 1;
    const totalBatches = Math.ceil(TOTAL_TICKETS / BATCH_SIZE);

    for (let i = 0; i < TOTAL_TICKETS; i++) {
      const ticketId = String(i).padStart(4, "0");
      const ticketRef = doc(db, "tickets", ticketId);

      currentBatch.set(ticketRef, {
        number: ticketId,
        status: "available",
      });

      countInBatch++;

      // Al llegar al límite del lote (500) o al último documento
      if (countInBatch === BATCH_SIZE || i === TOTAL_TICKETS - 1) {
        const startTicket = String(i - countInBatch + 1).padStart(4, "0");
        const endTicket = ticketId;

        console.log(
          `Subiendo lote ${batchNumber}/${totalBatches} (tickets ${startTicket} a ${endTicket})...`
        );
        await currentBatch.commit();
        console.log(`Lote ${batchNumber}/${totalBatches} guardado con éxito.`);

        // Reiniciar para el siguiente lote si quedan pendientes
        if (i < TOTAL_TICKETS - 1) {
          currentBatch = writeBatch(db);
          countInBatch = 0;
          batchNumber++;
        }
      }
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(
      `\n¡Proceso completado exitosamente en ${duration} segundos!`
    );
    console.log(
      `Se crearon 10,000 documentos ('0000' a '9999') en la colección 'tickets'.`
    );
    process.exit(0);
  } catch (error) {
    console.error("\nError al regenerar los tickets:", error);
    process.exit(1);
  }
}

crearBaseDatos();
