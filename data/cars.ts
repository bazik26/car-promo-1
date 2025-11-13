export interface Car {
  id: number;
  brand: string;
  model: string;
  year: number;
  mileage: number;
  price: number;
  origin: string;
  color: string;
  transmission: string;
  fuel: string;
  engine: string;
  image: string; // путь к реальной картинке
  tags: string[];
  discount: number;
  inStock: boolean;
}

export const promoCars: Car[] = [
  {
    id: 1,
    brand: 'BMW',
    model: 'X5 M Sport',
    year: 2020,
    mileage: 35000,
    price: 6850000,
    origin: 'Германия',
    color: 'Черный',
    transmission: 'Автомат',
    fuel: 'Бензин',
    engine: '3.0L Turbo',
    image: '/images/2025-11-13%2021.01.17.jpg',
    tags: ['ХИТ ПРОДАЖ', 'M SPORT'],
    discount: 25,
    inStock: true
  },
  {
    id: 2,
    brand: 'Mercedes-Benz',
    model: 'GLE 350 Coupe',
    year: 2020,
    mileage: 33000,
    price: 6750000,
    origin: 'Германия',
    color: 'Серебристый',
    transmission: 'Автомат 9G-Tronic',
    fuel: 'Бензин',
    engine: '2.0L Turbo',
    image: '/images/2025-11-13%2021.01.28.jpg',
    tags: ['AMG LINE', 'COUPE'],
    discount: 21,
    inStock: true
  },
  {
    id: 3,
    brand: 'Porsche',
    model: 'Cayenne Turbo',
    year: 2020,
    mileage: 31000,
    price: 8990000,
    origin: 'Германия',
    color: 'Серый металлик',
    transmission: 'Автомат Tiptronic',
    fuel: 'Бензин',
    engine: '4.0L V8 Twin-Turbo',
    image: '/images/2025-11-13%2021.01.33.jpg',
    tags: ['TURBO', 'ЭКСКЛЮЗИВ'],
    discount: 15,
    inStock: true
  },
  {
    id: 4,
    brand: 'Audi',
    model: 'Q7 55 TFSI',
    year: 2021,
    mileage: 28000,
    price: 7450000,
    origin: 'Германия',
    color: 'Белый',
    transmission: 'Автомат Tiptronic',
    fuel: 'Бензин',
    engine: '3.0L TFSI V6',
    image: '/images/2025-11-13%2021.01.38.jpg',
    tags: ['S-LINE', 'QUATTRO'],
    discount: 18,
    inStock: true
  }
];

export const stats = {
  totalCars: 67,
  remainingCars: 24,
  soldCars: 43,
  saleEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
};
