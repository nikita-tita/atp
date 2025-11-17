// Реальные данные Boeing и Airbus для замены джетов

// Helper function to get correct image path for both dev and production (including GitHub Pages)
const getImagePath = (path: string) => `${import.meta.env.BASE_URL}${path.startsWith('/') ? path.slice(1) : path}`;

export interface Aircraft {
  id: string;
  manufacturer: string;
  model: string;
  year: number;
  price: number;
  currency: string;
  hours: number;
  cycles: number;
  passengers: number;
  status: 'active' | 'pending' | 'sold';
  location: string;
  registration: string;
  description: string;
  image: string;
  category: 'commercial' | 'business' | 'regional';
  specifications: {
    maxRange: string;
    maxSpeed: string;
    engines: string;
    wingspan: string;
    length: string;
    maxTakeoffWeight: string;
  };
}

export const aircraftData: Aircraft[] = [
  // Boeing Aircraft
  {
    id: '1',
    manufacturer: 'Boeing',
    model: '737-800',
    year: 2015,
    price: 25000000,
    currency: 'USD',
    hours: 15000,
    cycles: 8500,
    passengers: 189,
    status: 'active',
    location: 'Miami, USA',
    registration: 'N737BA',
    description: 'Excellent condition Boeing 737-800, low hours, full maintenance history. This aircraft has been meticulously maintained and is ready for immediate delivery. Perfect for short to medium-haul operations.',
    image: getImagePath('/images/boeing-737.jpg'),
    category: 'commercial',
    specifications: {
      maxRange: '5,665 km',
      maxSpeed: '842 km/h',
      engines: '2x CFM56-7B',
      wingspan: '35.8 m',
      length: '39.5 m',
      maxTakeoffWeight: '79,016 kg'
    }
  },
  {
    id: '2',
    manufacturer: 'Boeing',
    model: '777-300ER',
    year: 2018,
    price: 185000000,
    currency: 'USD',
    hours: 8200,
    cycles: 2100,
    passengers: 396,
    status: 'active',
    location: 'Singapore',
    registration: 'N777ER',
    description: 'Premium Boeing 777-300ER with excellent fuel efficiency and long-range capabilities. Configured for high-density seating with modern cabin amenities. Ideal for long-haul international routes.',
    image: getImagePath('/images/boeing-777.jpg'),
    category: 'commercial',
    specifications: {
      maxRange: '13,649 km',
      maxSpeed: '905 km/h',
      engines: '2x GE90-115B',
      wingspan: '64.8 m',
      length: '73.9 m',
      maxTakeoffWeight: '351,534 kg'
    }
  },
  
  // Airbus Aircraft
  {
    id: '3',
    manufacturer: 'Airbus',
    model: 'A320-200',
    year: 2016,
    price: 32000000,
    currency: 'USD',
    hours: 12500,
    cycles: 9200,
    passengers: 180,
    status: 'active',
    location: 'Frankfurt, Germany',
    registration: 'D-ABCD',
    description: 'Well-maintained Airbus A320-200 with modern avionics and fuel-efficient engines. Perfect for European routes with excellent passenger comfort and operational reliability.',
    image: getImagePath('/images/airbus-a320.jpg'),
    category: 'commercial',
    specifications: {
      maxRange: '6,150 km',
      maxSpeed: '828 km/h',
      engines: '2x CFM56-5B',
      wingspan: '35.8 m',
      length: '37.6 m',
      maxTakeoffWeight: '78,000 kg'
    }
  },
  {
    id: '4',
    manufacturer: 'Airbus',
    model: 'A330-300',
    year: 2017,
    price: 85000000,
    currency: 'USD',
    hours: 9800,
    cycles: 3400,
    passengers: 335,
    status: 'active',
    location: 'Dubai, UAE',
    registration: 'A6-EFG',
    description: 'Modern Airbus A330-300 with excellent range and passenger capacity. Features latest generation engines and modern cabin configuration. Ideal for medium to long-haul operations.',
    image: getImagePath('/images/airbus-a330.jpg'),
    category: 'commercial',
    specifications: {
      maxRange: '11,750 km',
      maxSpeed: '871 km/h',
      engines: '2x Trent 772B',
      wingspan: '60.3 m',
      length: '63.7 m',
      maxTakeoffWeight: '242,000 kg'
    }
  },
  {
    id: '5',
    manufacturer: 'Airbus',
    model: 'A350-900',
    year: 2019,
    price: 165000000,
    currency: 'USD',
    hours: 4200,
    cycles: 1100,
    passengers: 325,
    status: 'active',
    location: 'Tokyo, Japan',
    registration: 'JA-HIJ',
    description: 'State-of-the-art Airbus A350-900 with carbon fiber fuselage and advanced systems. Ultra-modern aircraft with exceptional fuel efficiency and passenger comfort for long-haul operations.',
    image: getImagePath('/images/airbus-a350.jpg'),
    category: 'commercial',
    specifications: {
      maxRange: '15,000 km',
      maxSpeed: '903 km/h',
      engines: '2x Trent XWB-84',
      wingspan: '64.8 m',
      length: '66.8 m',
      maxTakeoffWeight: '280,000 kg'
    }
  },
  
  // Additional Boeing Aircraft
  {
    id: '6',
    manufacturer: 'Boeing',
    model: '737-MAX 8',
    year: 2020,
    price: 55000000,
    currency: 'USD',
    hours: 1500,
    cycles: 800,
    passengers: 189,
    status: 'active',
    location: 'Seattle, USA',
    registration: 'N737MX',
    description: 'Latest generation Boeing 737 MAX 8 with LEAP-1B engines and advanced fuel efficiency. Features modern cockpit systems and improved passenger amenities.',
    image: getImagePath('/images/boeing-737.jpg'),
    category: 'commercial',
    specifications: {
      maxRange: '6,570 km',
      maxSpeed: '839 km/h',
      engines: '2x LEAP-1B',
      wingspan: '35.9 m',
      length: '39.5 m',
      maxTakeoffWeight: '82,191 kg'
    }
  },
  
  // Additional Airbus Aircraft
  {
    id: '7',
    manufacturer: 'Airbus',
    model: 'A321neo',
    year: 2021,
    price: 62000000,
    currency: 'USD',
    hours: 800,
    cycles: 450,
    passengers: 220,
    status: 'active',
    location: 'Hamburg, Germany',
    registration: 'D-ANEO',
    description: 'Brand new Airbus A321neo with latest technology and exceptional fuel efficiency. Features new generation engines and modern cabin design for optimal passenger experience.',
    image: getImagePath('/images/airbus-a320.jpg'),
    category: 'commercial',
    specifications: {
      maxRange: '7,400 km',
      maxSpeed: '828 km/h',
      engines: '2x LEAP-1A',
      wingspan: '35.8 m',
      length: '44.5 m',
      maxTakeoffWeight: '97,000 kg'
    }
  },
  
  {
    id: '8',
    manufacturer: 'Boeing',
    model: '787-9 Dreamliner',
    year: 2019,
    price: 145000000,
    currency: 'USD',
    hours: 3200,
    cycles: 950,
    passengers: 290,
    status: 'active',
    location: 'Los Angeles, USA',
    registration: 'N787DL',
    description: 'Advanced Boeing 787-9 Dreamliner with composite construction and cutting-edge technology. Offers superior fuel efficiency and passenger comfort for long-haul operations.',
    image: getImagePath('/images/boeing-777.jpg'),
    category: 'commercial',
    specifications: {
      maxRange: '14,140 km',
      maxSpeed: '903 km/h',
      engines: '2x GEnx-1B',
      wingspan: '60.1 m',
      length: '62.8 m',
      maxTakeoffWeight: '254,011 kg'
    }
  },
  
  // Comac Aircraft
  {
    id: '11',
    manufacturer: 'Comac',
    model: 'C919',
    year: 2023,
    price: 65000000,
    currency: 'USD',
    hours: 500,
    cycles: 250,
    passengers: 168,
    status: 'active',
    location: 'Shanghai, China',
    registration: 'B-919A',
    description: 'Brand new Comac C919, China\'s first domestically produced narrow-body airliner. Features modern avionics and fuel-efficient engines. Ideal for airlines looking to expand their fleet with cutting-edge Chinese technology.',
    image: getImagePath('/images/airbus-a320.jpg'), // Using A320 image as placeholder
    category: 'commercial',
    specifications: {
      maxRange: '5,555 km',
      maxSpeed: '834 km/h',
      engines: '2x LEAP-1C',
      wingspan: '35.8 m',
      length: '38.9 m',
      maxTakeoffWeight: '77,300 kg'
    }
  },
  {
    id: '12',
    manufacturer: 'Comac',
    model: 'ARJ21',
    year: 2021,
    price: 38000000,
    currency: 'USD',
    hours: 2000,
    cycles: 1500,
    passengers: 90,
    status: 'active',
    location: 'Beijing, China',
    registration: 'B-ARJ21',
    description: 'Well-maintained Comac ARJ21 regional jet. Perfect for regional routes and feeder services. Proven reliability with comprehensive Chinese aviation authority certification.',
    image: getImagePath('/images/boeing-737.jpg'), // Using 737 image as placeholder
    category: 'regional',
    specifications: {
      maxRange: '3,700 km',
      maxSpeed: '828 km/h',
      engines: '2x CF34-10A',
      wingspan: '27.3 m',
      length: '33.5 m',
      maxTakeoffWeight: '43,500 kg'
    }
  },
  
  // Mitsubishi Aircraft
  {
    id: '13',
    manufacturer: 'Mitsubishi',
    model: 'SpaceJet M90',
    year: 2022,
    price: 42000000,
    currency: 'USD',
    hours: 1000,
    cycles: 600,
    passengers: 88,
    status: 'active',
    location: 'Tokyo, Japan',
    registration: 'JA-MSJ90',
    description: 'Advanced Mitsubishi SpaceJet M90 (formerly MRJ90). Features best-in-class fuel efficiency and passenger comfort. Japanese engineering excellence for regional aviation.',
    image: getImagePath('/images/airbus-a320.jpg'), // Using A320 image as placeholder
    category: 'regional',
    specifications: {
      maxRange: '3,770 km',
      maxSpeed: '860 km/h',
      engines: '2x PW1200G',
      wingspan: '29.2 m',
      length: '35.8 m',
      maxTakeoffWeight: '42,800 kg'
    }
  },
  {
    id: '14',
    manufacturer: 'Mitsubishi',
    model: 'SpaceJet M100',
    year: 2023,
    price: 35000000,
    currency: 'USD',
    hours: 200,
    cycles: 150,
    passengers: 76,
    status: 'pending',
    location: 'Nagoya, Japan',
    registration: 'JA-MSJ100',
    description: 'Latest Mitsubishi SpaceJet M100, optimized for U.S. scope clause compliance. Exceptional fuel economy and reduced emissions. The future of regional aviation.',
    image: getImagePath('/images/boeing-737.jpg'), // Using 737 image as placeholder
    category: 'regional',
    specifications: {
      maxRange: '3,540 km',
      maxSpeed: '860 km/h',
      engines: '2x PW1200G',
      wingspan: '27.8 m',
      length: '33.4 m',
      maxTakeoffWeight: '39,600 kg'
    }
  }
];

// Функция для получения самолета по ID
export const getAircraftById = (id: string): Aircraft | undefined => {
  return aircraftData.find(aircraft => aircraft.id === id);
};

// Функция для получения самолетов по производителю
export const getAircraftByManufacturer = (manufacturer: string): Aircraft[] => {
  return aircraftData.filter(aircraft => 
    aircraft.manufacturer.toLowerCase() === manufacturer.toLowerCase()
  );
};

// Функция для получения случайных самолетов
export const getRandomAircraft = (count: number): Aircraft[] => {
  const shuffled = [...aircraftData].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Функция для форматирования цены
export const formatPrice = (price: number, currency: string): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};
