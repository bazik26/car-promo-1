const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://car-api-production.up.railway.app';

export interface CarFile {
  id: number;
  carId: number;
  fileName: string;
  filePath: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface Car {
  id: number;
  brand: string;
  model: string;
  year: number;
  mileage: number;
  vin: string | null;
  gearbox: string;
  fuel: string;
  powerValue: number;
  powerType: string;
  engine: number;
  drive: string;
  price: number;
  isSold: boolean;
  promo: boolean | null;
  description: string;
  files: CarFile[];
  createdAt: string;
  updatedAt: string;
}

export const getFileUrl = (file: CarFile): string => {
  if (!file) return '';
  return `${API_URL}/files/${file.fileName}`;
};

export const getCars = async (params?: {
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  random?: boolean;
}): Promise<Car[]> => {
  try {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);
    if (params?.random) queryParams.append('random', 'true');

    const url = `${API_URL}/cars${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Всегда свежие данные
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch cars: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching cars:', error);
    return [];
  }
};

export const getPromoCars = async (): Promise<Car[]> => {
  // Получаем промо машины (promo = true)
  const allCars = await getCars({ limit: 50 });
  return allCars.filter(car => car.promo === true && !car.isSold);
};

