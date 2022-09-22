export type Person = {
  id: string,
  key: string,
  value: string,
  description: string,
  popularPlace: string,
  pincode: number  
}

export const defaultData: Person[] = [
  {
    id: "1-city",
    key: "City",
    value: "Ahmedabad",
    description: "Ahmedabad, in western India, is the largest city in the state of Gujarat. ",
    popularPlace: "Kankaria Lake",
    pincode: 380001
  },
  {
    id: "2-city",
    key: "City",
    value: "Surat",
    description: "Surat is a large city beside the Tapi River in the west Indian state of Gujarat",
    popularPlace: "Dumas Beach",
    pincode: 395003
  },
  {
    id: "3-city",
    key: "City",
    value: "Mahemdavad",
    description: "Mahemdavad is a town with municipality in the Kheda district in the Indian state of Gujarat",
    popularPlace: "Siddhivinayak Temple",
    pincode: 387130
  },
];

export function getData() {
  return defaultData
};