import type { Driver, Tempo } from "./types";

export const drivers: Driver[] = [
  { id: "dr1", name: "Rajesh Kumbhar", phone: "9822011111", license: "MH12 20190045121", routeName: "Pune Route", status: "On Duty" },
  { id: "dr2", name: "Suresh Pawar", phone: "9822022222", license: "MH31 20180123456", routeName: "Nagpur Route", status: "On Duty" },
  { id: "dr3", name: "Imran Shaikh", phone: "9822033333", license: "MH01 20200111222", routeName: "Mumbai Route", status: "On Duty" },
  { id: "dr4", name: "Vikram Jadhav", phone: "9822044444", license: "MH13 20170033344", routeName: "Solapur Route", status: "On Leave" },
  { id: "dr5", name: "Anand Patil", phone: "9822055555", license: "KA28 20190055566", routeName: "Vijayapura Route", status: "On Duty" },
  { id: "dr6", name: "Mahesh Desai", phone: "9822066666", license: "KA23 20210077788", routeName: "Belagavi Route", status: "On Duty" },
  { id: "dr7", name: "Ganesh Hegde", phone: "9822077777", license: "KA36 20180099900", routeName: "Hubli Route", status: "Off Duty" },
  { id: "dr8", name: "Deepak Chavan", phone: "9822088888", license: "MH12 20220123477", routeName: "Unassigned", status: "Off Duty" },
];

export const tempos: Tempo[] = [
  { id: "t1", number: "MH12 AB 1234", driver: "Rajesh Kumbhar", capacity: "4,500 L", currentRoute: "Pune Route", status: "Available" },
  { id: "t2", number: "MH31 CD 5678", driver: "Suresh Pawar", capacity: "4,000 L", currentRoute: "Nagpur Route", status: "In Transit" },
  { id: "t3", number: "MH01 EF 9012", driver: "Imran Shaikh", capacity: "6,000 L", currentRoute: "Mumbai Route", status: "Available" },
  { id: "t4", number: "MH13 GH 3456", driver: "Vikram Jadhav", capacity: "4,000 L", currentRoute: "Solapur Route", status: "Maintenance" },
  { id: "t5", number: "KA28 IJ 7890", driver: "Anand Patil", capacity: "3,500 L", currentRoute: "Vijayapura Route", status: "Available" },
  { id: "t6", number: "KA23 KL 2345", driver: "Mahesh Desai", capacity: "3,000 L", currentRoute: "Belagavi Route", status: "Available" },
  { id: "t7", number: "KA36 MN 6789", driver: "Ganesh Hegde", capacity: "2,500 L", currentRoute: "Hubli Route", status: "Available" },
];
