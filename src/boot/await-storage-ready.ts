import { boot } from 'quasar/wrappers';
import { useWeekReportStore } from 'src/stores/weekReport';

// const DB_NAME = 'weekReportDB';
// const STORE_NAME = 'weekReports';

// function openDB(): Promise<IDBDatabase> {
//   return new Promise((resolve, reject) => {
//     const request = indexedDB.open(DB_NAME, 1);

//     request.onerror = () => {
//       console.error('Failed to open IndexedDB database');
//       reject();
//     };

//     request.onsuccess = () => {
//       resolve(request.result);
//     };

//     request.onupgradeneeded = (event) => {
//       const db = (event.target as IDBOpenDBRequest)?.result;
//       db.createObjectStore(STORE_NAME, { keyPath: 'id' });
//     };
//   });
// }

// async function saveToDB(store: WeekReport[]) {
//   const db = await openDB();
//   const tx = db.transaction(STORE_NAME, 'readwrite');
//   const objectStore = tx.objectStore(STORE_NAME);

//   objectStore.put({ id: 'weekReports', data: JSON.stringify(store) });

//   tx.oncomplete = () => {
//     console.log('update', store);
//     db.close();
//   };
// }

// async function loadFromDB(): Promise<WeekReport[]> {
//   const db = await openDB();
//   const tx = db.transaction(STORE_NAME, 'readonly');
//   const objectStore = tx.objectStore(STORE_NAME);

//   const request = objectStore.get('weekReports');
//   return new Promise((resolve, reject) => {
//     request.onsuccess = () => {
//       const data: WeekReport[] = request.result ? JSON.parse(request.result.data) : [];
//       data.forEach((report) => (report.startDate = new Date(report.startDate)));
//       resolve(data);
//     };

//     request.onerror = () => {
//       console.error('Failed to load data from IndexedDB');
//       reject();
//     };
//   });
// }

export default boot(async () => {
  const store = useWeekReportStore();
  const p = store.$persistedState.isReady();
  await p;
});
