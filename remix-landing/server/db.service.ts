import fs from 'fs';
import path from 'path';
import { Support, Lead, MediaKit, UserSession } from '../src/types';

const DB_PATH = path.join(process.cwd(), 'server-db.json');

// Realistic high-quality mock images of premium advertising screens
const MOCK_IMAGES = {
  traditional: [
    'https://images.unsplash.com/photo-1540340561127-14e9f52f4aa1?w=800&auto=format&fit=crop&q=60', // Big billboard on highway
    'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&auto=format&fit=crop&q=60'  // Banner at city square
  ],
  led: [
    'https://images.unsplash.com/photo-1572945281861-68b291979922?w=800&auto=format&fit=crop&q=60', // Massive neon digital display
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=60'  // Modern smart digital screen
  ],
  mobile: [
    'https://images.unsplash.com/photo-1516594798947-e65505dbb29d?w=800&auto=format&fit=crop&q=60', // Truck with customized display container
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=60'  // Commercial moving digital van
  ]
};

// Fixture data for supports with correct GPS coordinates
const DEFAULT_SUPPORTS: Support[] = [
  // Mendoza - Tradicionales
  {
    id: 'mendoza-trad-1',
    name: 'Monumento de Acceso Este - Doble Faz',
    plaza: 'Mendoza',
    type: 'Soportes Tradicionales',
    address: 'Acceso Este y Costanera, Guaymallén',
    latitude: -32.8982,
    longitude: -68.8251,
    description: 'Soporte tradicional de gran formato con iluminación bifocal LED. Punto de ingreso clave a la Ciudad de Mendoza con tráfico vehicular masivo constante desde la Ruta Nacional 7.',
    imageUrl: MOCK_IMAGES.traditional[0],
    status: 'available',
    size: '12x4m',
    refPoints: ['Nudo Vial Costanera', 'Terminal de Ómnibus', 'Ingreso Principal a Capital'],
    contactsCount: '1.2M visualizaciones/mes'
  },
  {
    id: 'mendoza-trad-2',
    name: 'Soporte Av. San Martín y Las Heras',
    plaza: 'Mendoza',
    type: 'Soportes Tradicionales',
    address: 'Av. San Martín 1540, Mendoza Capital',
    latitude: -32.8856,
    longitude: -68.8394,
    description: 'Cartel frontal iluminado sobre azotea. Excelente impacto visual peatonal y vehicular en una de las esquinas comerciales más transitadas del microcentro mendocino.',
    imageUrl: MOCK_IMAGES.traditional[1],
    status: 'available',
    size: '8x3m',
    refPoints: ['Esquina Las Heras', 'Zona Bancaria', 'Paseo Peatonal San Martín'],
    contactsCount: '850K visualizaciones/mes'
  },
  // Mendoza - Pantallas LED
  {
    id: 'mendoza-led-1',
    name: 'Gran Pantalla LED Arístides Villanueva',
    plaza: 'Mendoza',
    type: 'Pantallas LED',
    address: 'Arístides Villanueva y Olascoaga, Mendoza Capital',
    latitude: -32.8954,
    longitude: -68.8612,
    description: 'Pantalla digital de alta resolución en el corazón de la zona gastronómica y nocturna más importante de Mendoza. Ideal para campañas dirigidas a público joven y turistas.',
    imageUrl: MOCK_IMAGES.led[0],
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-commercial-street-of-a-big-city-at-night-42407-large.mp4',
    status: 'available',
    size: '5x3m (P4 High Refresh)',
    refPoints: ['Eje Gastronómico Arístides', 'Cerca de Universidad de Mendoza', 'Zona de Pubs'],
    contactsCount: '980K visualizaciones/mes'
  },
  {
    id: 'mendoza-led-2',
    name: 'Pantalla LED Nudo Vial Costanera',
    plaza: 'Mendoza',
    type: 'Pantallas LED',
    address: 'Av. Vicente Zapata y Costanera, Mendoza Capital',
    latitude: -32.8978,
    longitude: -68.8276,
    description: 'Pantalla digital de gran escala ubicada en el semáforo de ingreso a la Capital de Mendoza. Retención visual garantizada por el tiempo de espera del semáforo.',
    imageUrl: MOCK_IMAGES.led[1],
    status: 'available',
    size: '7x4m (P6 Outdoor)',
    refPoints: ['Nudo Vial de Entrada', 'Predio de la Virgen', 'Bajada Acceso Este'],
    contactsCount: '2.1M visualizaciones/mes'
  },
  // Mendoza - LED Móvil
  {
    id: 'mendoza-mobile-1',
    name: 'LED Móvil Mendoza - Camión Tecnológico',
    plaza: 'Mendoza',
    type: 'LED Móvil',
    address: 'Recorrido Circuito Cívico-Comercial, Mendoza',
    latitude: -32.8906,
    longitude: -32.8906, // Will be centered dynamically on map
    description: 'Camión publicitario equipado con doble pantalla LED gigante de alta resolución y sonido envolvente. Recorre zonas de alto tráfico como Microcentro, Arístides, Bombal y Parque General San Martín.',
    imageUrl: MOCK_IMAGES.mobile[0],
    status: 'available',
    size: '4x2m (Doble Pantalla)',
    refPoints: ['Recorrido Microcentro', 'Parque General San Martín', 'Av. Emilio Civit'],
    contactsCount: '1.5M visualizaciones/mes',
    routePoints: [
      { lat: -32.8894, lng: -68.8458 }, // Km 0 - San Martín y Garibaldi
      { lat: -32.8953, lng: -68.8601 }, // Arístides y Belgrano
      { lat: -32.8961, lng: -68.8712 }, // Portones del Parque
      { lat: -32.8885, lng: -68.8705 }, // Emilio Civit
      { lat: -32.8872, lng: -68.8452 }  // Regreso por Las Heras/San Martín
    ]
  },

  // Buenos Aires - Tradicionales
  {
    id: 'ba-trad-1',
    name: 'Monoestructura Panamericana Km 19',
    plaza: 'Buenos Aires',
    type: 'Soportes Tradicionales',
    address: 'Autopista Panamericana Km 19.5, San Isidro',
    latitude: -34.4925,
    longitude: -58.5304,
    description: 'Soporte tradicional tipo monoestructura monumental de doble faz. Visibilidad excepcional a más de 300 metros de distancia en la autopista más transitada de la provincia.',
    imageUrl: MOCK_IMAGES.traditional[0],
    status: 'available',
    size: '15x5m',
    refPoints: ['Acceso Norte Km 19', 'Unilever San Isidro', 'Cerca de Shopping Soleil'],
    contactsCount: '3.5M visualizaciones/mes'
  },
  {
    id: 'ba-trad-2',
    name: 'Soporte Av. del Libertador y Av. Monroe',
    plaza: 'Buenos Aires',
    type: 'Soportes Tradicionales',
    address: 'Av. del Libertador 6400, Belgrano',
    latitude: -34.5518,
    longitude: -58.4502,
    description: 'Soporte tipo cartelera estática Premium con iluminación backlight homogénea. Ubicado en el corredor norte residencial y comercial más exclusivo de la Ciudad de Buenos Aires.',
    imageUrl: MOCK_IMAGES.traditional[1],
    status: 'available',
    size: '10x4m',
    refPoints: ['Corredor Libertador Norte', 'Zona Clubes Belgrano', 'Cerca de Estadio Monumental'],
    contactsCount: '1.8M visualizaciones/mes'
  },
  // Buenos Aires - Pantallas LED
  {
    id: 'ba-led-1',
    name: 'Súper LED Obelisco BA',
    plaza: 'Buenos Aires',
    type: 'Pantallas LED',
    address: 'Av. Corrientes y Av. 9 de Julio, San Nicolás',
    latitude: -34.6037,
    longitude: -58.3816,
    description: 'Pantalla digital de última tecnología con visualización curva ultra premium en la esquina más icónica de la República Argentina. Tránsito peatonal y vehicular ininterrumpido las 24 horas.',
    imageUrl: MOCK_IMAGES.led[0],
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-times-square-advertising-displays-at-night-42408-large.mp4',
    status: 'available',
    size: '14x8m (Pantalla Curva P3)',
    refPoints: ['Frente al Obelisco', 'Zona Teatros Calle Corrientes', 'Eje Turístico 9 de Julio'],
    contactsCount: '8.2M visualizaciones/mes'
  },
  {
    id: 'ba-led-2',
    name: 'Pantalla LED Plaza Serrano - Palermo Soho',
    plaza: 'Buenos Aires',
    type: 'Pantallas LED',
    address: 'Honduras y Serrano, Palermo',
    latitude: -34.5885,
    longitude: -58.4306,
    description: 'Pantalla digital de alta definición ubicada en el epicentro de la moda, el arte urbano y el polo gastronómico de Palermo Soho. Gran efectividad de impacto de marca.',
    imageUrl: MOCK_IMAGES.led[1],
    status: 'available',
    size: '6x3.5m',
    refPoints: ['Plaza Cortázar (Serrano)', 'Polo de Diseño Soho', 'Circuito de Bares de Palermo'],
    contactsCount: '1.9M visualizaciones/mes'
  },
  // Buenos Aires - LED Móvil
  {
    id: 'ba-mobile-1',
    name: 'LED Móvil Buenos Aires - Mega Truck',
    plaza: 'Buenos Aires',
    type: 'LED Móvil',
    address: 'Recorrido Corredores de Alto Perfil, Buenos Aires',
    latitude: -34.5710,
    longitude: -58.4110, // Will be dynamically centered
    description: 'Unidad móvil premium equipada con pantalla LED hidráulica que permite elevarse hasta 3 metros. Recorrido estratégico cubriendo Palermo, Recoleta, Barrio Norte y Puerto Madero.',
    imageUrl: MOCK_IMAGES.mobile[1],
    status: 'available',
    size: '5x3m (Elevación Hidráulica)',
    refPoints: ['Recorrido Palermo Soho', 'Av. del Libertador Recoleta', 'Plaza Francia / Museos'],
    contactsCount: '2.5M visualizaciones/mes',
    routePoints: [
      { lat: -34.5885, lng: -58.4306 }, // Km 0 - Plaza Serrano
      { lat: -34.5805, lng: -58.4206 }, // Av. Santa Fe y Scalabrini Ortiz
      { lat: -34.5711, lng: -58.4062 }, // Av. del Libertador y Av. Sarmiento
      { lat: -34.5891, lng: -58.3912 }, // Recoleta - Cementerio
      { lat: -34.5951, lng: -58.4202 }  // Regreso por Scalabrini Ortiz
    ]
  }
];

interface DatabaseSchema {
  supports: Support[];
  leads: Lead[];
  mediakits: MediaKit[];
}

export class DBService {
  private static initDB(): DatabaseSchema {
    if (!fs.existsSync(DB_PATH)) {
      const initialSchema: DatabaseSchema = {
        supports: DEFAULT_SUPPORTS,
        leads: [],
        mediakits: []
      };
      fs.writeFileSync(DB_PATH, JSON.stringify(initialSchema, null, 2), 'utf-8');
      return initialSchema;
    }

    try {
      const fileContent = fs.readFileSync(DB_PATH, 'utf-8');
      return JSON.parse(fileContent);
    } catch (e) {
      console.error('Error reading database file, recreating schema...', e);
      const initialSchema: DatabaseSchema = {
        supports: DEFAULT_SUPPORTS,
        leads: [],
        mediakits: []
      };
      fs.writeFileSync(DB_PATH, JSON.stringify(initialSchema, null, 2), 'utf-8');
      return initialSchema;
    }
  }

  private static saveDB(data: DatabaseSchema) {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  }

  // Support CRUD operations
  public static getSupports(): Support[] {
    const db = this.initDB();
    return db.supports;
  }

  public static addSupport(support: Omit<Support, 'id'>): Support {
    const db = this.initDB();
    const newId = `support-${Date.now()}`;
    const newSupport: Support = { ...support, id: newId };
    db.supports.push(newSupport);
    this.saveDB(db);
    return newSupport;
  }

  public static updateSupport(id: string, updatedFields: Partial<Support>): Support {
    const db = this.initDB();
    const index = db.supports.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error(`Support with id ${id} not found`);
    }
    const updatedSupport = { ...db.supports[index], ...updatedFields };
    db.supports[index] = updatedSupport;
    this.saveDB(db);
    return updatedSupport;
  }

  public static deleteSupport(id: string): boolean {
    const db = this.initDB();
    const initialLength = db.supports.length;
    db.supports = db.supports.filter(s => s.id !== id);
    this.saveDB(db);
    return db.supports.length < initialLength;
  }

  // Leads operations
  public static getLeads(): Lead[] {
    const db = this.initDB();
    return db.leads;
  }

  public static addLead(lead: Omit<Lead, 'id' | 'createdAt' | 'status'>): Lead {
    const db = this.initDB();
    const newId = `lead-${Date.now()}`;
    const newLead: Lead = {
      ...lead,
      id: newId,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    db.leads.unshift(newLead); // Premium leads appear first
    this.saveDB(db);
    return newLead;
  }

  public static updateLeadStatus(id: string, status: 'pending' | 'contacted' | 'rejected'): Lead {
    const db = this.initDB();
    const index = db.leads.findIndex(l => l.id === id);
    if (index === -1) {
      throw new Error(`Lead with id ${id} not found`);
    }
    db.leads[index].status = status;
    this.saveDB(db);
    return db.leads[index];
  }

  // Media Kit operations
  public static getMediaKits(): MediaKit[] {
    const db = this.initDB();
    return db.mediakits;
  }

  public static addMediaKit(mediaKit: Omit<MediaKit, 'id' | 'createdAt'>): MediaKit {
    const db = this.initDB();
    const newId = `mediakit-${Date.now()}`;
    const newMediaKit: MediaKit = {
      ...mediaKit,
      id: newId,
      createdAt: new Date().toISOString()
    };
    db.mediakits.unshift(newMediaKit);
    this.saveDB(db);
    return newMediaKit;
  }

  public static deleteMediaKit(id: string): boolean {
    const db = this.initDB();
    const initialLength = db.mediakits.length;
    db.mediakits = db.mediakits.filter(m => m.id !== id);
    this.saveDB(db);
    return db.mediakits.length < initialLength;
  }
}
