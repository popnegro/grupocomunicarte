import { neon } from '@neondatabase/serverless';
import { Support, Lead, MediaKit } from '../src/types/index.js';

const DATABASE_URL = process.env.DATABASE_URL || process.env.POSTGRES_URL;
if (!DATABASE_URL) {
  console.warn('[DBService] DATABASE_URL/POSTGRES_URL is not configured. Production requires Neon.');
}

const sql = DATABASE_URL ? neon(DATABASE_URL) : null;

const MOCK_IMAGES = {
  traditional: [
    'https://images.unsplash.com/photo-1540340561127-14e9f52f4aa1?w=800&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&auto=format&fit=crop&q=60'
  ],
  led: [
    'https://images.unsplash.com/photo-1572945281861-68b291979922?w=800&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=60'
  ],
  mobile: [
    'https://images.unsplash.com/photo-1516594798947-e65505dbb29d?w=800&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=60'
  ]
};

const DEFAULT_SUPPORTS: Support[] = [
  { id:'mendoza-trad-1', name:'Monumento de Acceso Este - Doble Faz', plaza:'Mendoza', type:'Soportes Tradicionales', address:'Acceso Este y Costanera, Guaymallén', latitude:-32.8982, longitude:-68.8251, description:'Soporte tradicional de gran formato con iluminación bifocal LED. Punto de ingreso clave a la Ciudad de Mendoza con tráfico vehicular masivo constante desde la Ruta Nacional 7.', imageUrl:MOCK_IMAGES.traditional[0], status:'available', size:'12x4m', refPoints:['Nudo Vial Costanera','Terminal de Ómnibus','Ingreso Principal a Capital'], contactsCount:'1.2M visualizaciones/mes' },
  { id:'mendoza-trad-2', name:'Soporte Av. San Martín y Las Heras', plaza:'Mendoza', type:'Soportes Tradicionales', address:'Av. San Martín 1540, Mendoza Capital', latitude:-32.8856, longitude:-68.8394, description:'Cartel frontal iluminado sobre azotea. Excelente impacto visual peatonal y vehicular en una de las esquinas comerciales más transitadas del microcentro mendocino.', imageUrl:MOCK_IMAGES.traditional[1], status:'available', size:'8x3m', refPoints:['Esquina Las Heras','Zona Bancaria','Paseo Peatonal San Martín'], contactsCount:'850K visualizaciones/mes' },
  { id:'mendoza-led-1', name:'Gran Pantalla LED Arístides Villanueva', plaza:'Mendoza', type:'Pantallas LED', address:'Arístides Villanueva y Olascoaga, Mendoza Capital', latitude:-32.8954, longitude:-68.8612, description:'Pantalla digital de alta resolución en el corazón de la zona gastronómica y nocturna más importante de Mendoza. Ideal para campañas dirigidas a público joven y turistas.', imageUrl:MOCK_IMAGES.led[0], videoUrl:'https://assets.mixkit.co/videos/preview/mixkit-commercial-street-of-a-big-city-at-night-42407-large.mp4', status:'available', size:'5x3m (P4 High Refresh)', refPoints:['Eje Gastronómico Arístides','Cerca de Universidad de Mendoza','Zona de Pubs'], contactsCount:'980K visualizaciones/mes' },
  { id:'mendoza-led-2', name:'Pantalla LED Nudo Vial Costanera', plaza:'Mendoza', type:'Pantallas LED', address:'Av. Vicente Zapata y Costanera, Mendoza Capital', latitude:-32.8978, longitude:-68.8276, description:'Pantalla digital de gran escala ubicada en el semáforo de ingreso a la Capital de Mendoza. Retención visual garantizada por el tiempo de espera del semáforo.', imageUrl:MOCK_IMAGES.led[1], status:'available', size:'7x4m (P6 Outdoor)', refPoints:['Nudo Vial de Entrada','Predio de la Virgen','Bajada Acceso Este'], contactsCount:'2.1M visualizaciones/mes' },
  { id:'mendoza-mobile-1', name:'LED Móvil Mendoza - Camión Tecnológico', plaza:'Mendoza', type:'LED Móvil', address:'Recorrido Circuito Cívico-Comercial, Mendoza', latitude:-32.8906, longitude:-68.8906, description:'Camión publicitario equipado con doble pantalla LED gigante de alta resolución y sonido envolvente. Recorre zonas de alto tráfico como Microcentro, Arístides, Bombal y Parque General San Martín.', imageUrl:MOCK_IMAGES.mobile[0], status:'available', size:'4x2m (Doble Pantalla)', refPoints:['Recorrido Microcentro','Parque General San Martín','Av. Emilio Civit'], contactsCount:'1.5M visualizaciones/mes', routePoints:[{lat:-32.8894,lng:-68.8458},{lat:-32.8953,lng:-68.8601},{lat:-32.8961,lng:-68.8712},{lat:-32.8885,lng:-68.8705},{lat:-32.8872,lng:-68.8452}] },
  { id:'ba-trad-1', name:'Monoestructura Panamericana Km 19', plaza:'Buenos Aires', type:'Soportes Tradicionales', address:'Autopista Panamericana Km 19.5, San Isidro', latitude:-34.4925, longitude:-58.5304, description:'Soporte tradicional tipo monoestructura monumental de doble faz. Visibilidad excepcional a más de 300 metros de distancia en la autopista más transitada de la provincia.', imageUrl:MOCK_IMAGES.traditional[0], status:'available', size:'15x5m', refPoints:['Acceso Norte Km 19','Unilever San Isidro','Cerca de Shopping Soleil'], contactsCount:'3.5M visualizaciones/mes' },
  { id:'ba-trad-2', name:'Soporte Av. del Libertador y Av. Monroe', plaza:'Buenos Aires', type:'Soportes Tradicionales', address:'Av. del Libertador 6400, Belgrano', latitude:-34.5518, longitude:-58.4502, description:'Soporte tipo cartelera estática Premium con iluminación backlight homogénea. Ubicado en el corredor norte residencial y comercial más exclusivo de la Ciudad de Buenos Aires.', imageUrl:MOCK_IMAGES.traditional[1], status:'available', size:'10x4m', refPoints:['Corredor Libertador Norte','Zona Clubes Belgrano','Cerca de Estadio Monumental'], contactsCount:'1.8M visualizaciones/mes' },
  { id:'ba-led-1', name:'Súper LED Obelisco BA', plaza:'Buenos Aires', type:'Pantallas LED', address:'Av. Corrientes y Av. 9 de Julio, San Nicolás', latitude:-34.6037, longitude:-58.3816, description:'Pantalla digital de última tecnología con visualización curva ultra premium en la esquina más icónica de la República Argentina. Tránsito peatonal y vehicular ininterrumpido las 24 horas.', imageUrl:MOCK_IMAGES.led[0], videoUrl:'https://assets.mixkit.co/videos/preview/mixkit-times-square-advertising-displays-at-night-42408-large.mp4', status:'available', size:'14x8m (Pantalla Curva P3)', refPoints:['Frente al Obelisco','Zona Teatros Calle Corrientes','Eje Turístico 9 de Julio'], contactsCount:'8.2M visualizaciones/mes' },
  { id:'ba-led-2', name:'Pantalla LED Plaza Serrano - Palermo Soho', plaza:'Buenos Aires', type:'Pantallas LED', address:'Honduras y Serrano, Palermo', latitude:-34.5885, longitude:-58.4306, description:'Pantalla digital de alta definición ubicada en el epicentro de la moda, el arte urbano y el polo gastronómico de Palermo Soho. Gran efectividad de impacto de marca.', imageUrl:MOCK_IMAGES.led[1], status:'available', size:'6x3.5m', refPoints:['Plaza Cortázar (Serrano)','Polo de Diseño Soho','Circuito de Bares de Palermo'], contactsCount:'1.9M visualizaciones/mes' },
  { id:'ba-mobile-1', name:'LED Móvil Buenos Aires - Mega Truck', plaza:'Buenos Aires', type:'LED Móvil', address:'Recorrido Corredores de Alto Perfil, Buenos Aires', latitude:-34.5710, longitude:-58.4110, description:'Unidad móvil premium equipada con pantalla LED hidráulica que permite elevarse hasta 3 metros. Recorrido estratégico cubriendo Palermo, Recoleta, Barrio Norte y Puerto Madero.', imageUrl:MOCK_IMAGES.mobile[1], status:'available', size:'5x3m (Elevación Hidráulica)', refPoints:['Recorrido Palermo Soho','Av. del Libertador Recoleta','Plaza Francia / Museos'], contactsCount:'2.5M visualizaciones/mes', routePoints:[{lat:-34.5885,lng:-58.4306},{lat:-34.5805,lng:-58.4206},{lat:-34.5711,lng:-58.4062},{lat:-34.5891,lng:-58.3912},{lat:-34.5951,lng:-58.4202}] }
];

const requireDb = () => {
  if (!sql) throw new Error('DATABASE_URL/POSTGRES_URL is required for persistent PMV storage.');
  return sql;
};

async function ensureSchema() {
  const db = requireDb();
  await db`CREATE TABLE IF NOT EXISTS supports (id TEXT PRIMARY KEY, data JSONB NOT NULL)`;
  await db`CREATE TABLE IF NOT EXISTS leads (id TEXT PRIMARY KEY, data JSONB NOT NULL)`;
  await db`CREATE TABLE IF NOT EXISTS mediakits (id TEXT PRIMARY KEY, data JSONB NOT NULL)`;
  const count = await db`SELECT COUNT(*)::int AS count FROM supports`;
  if (count[0].count === 0) {
    for (const support of DEFAULT_SUPPORTS) {
      await db`INSERT INTO supports (id, data) VALUES (${support.id}, ${JSON.stringify(support)}::jsonb) ON CONFLICT (id) DO NOTHING`;
    }
  }
}

const parseRows = <T>(rows: Array<{data: T}>): T[] => rows.map((row) => row.data);
const toTime = (value?: string) => value ? new Date(`${value}T00:00:00Z`).getTime() : null;
const overlaps = (start: string, end: string, reservedFrom?: string, reservedUntil?: string) => {
  const a = toTime(start), b = toTime(end), c = toTime(reservedFrom), d = toTime(reservedUntil);
  return a !== null && b !== null && c !== null && d !== null && a <= d && b >= c;
};

export class DBService {
  public static async getSupports(): Promise<Support[]> { const db=requireDb(); await ensureSchema(); return parseRows<Support>(await db`SELECT data FROM supports ORDER BY id`); }
  public static async addSupport(support: Omit<Support,'id'>): Promise<Support> { const db=requireDb(); await ensureSchema(); const item={...support,id:`support-${crypto.randomUUID()}`}; await db`INSERT INTO supports (id,data) VALUES (${item.id},${JSON.stringify(item)}::jsonb)`; return item; }
  public static async updateSupport(id:string,updatedFields:Partial<Support>): Promise<Support> { const db=requireDb(); await ensureSchema(); const rows=await db`SELECT data FROM supports WHERE id=${id}`; if(!rows[0]) throw new Error(`Support with id ${id} not found`); const item={...(rows[0].data as Support),...updatedFields}; await db`UPDATE supports SET data=${JSON.stringify(item)}::jsonb WHERE id=${id}`; return item; }
  public static async deleteSupport(id:string): Promise<boolean> { const db=requireDb(); await ensureSchema(); const result=await db`DELETE FROM supports WHERE id=${id}`; return result.count>0; }
  public static async getLeads(): Promise<Lead[]> { const db=requireDb(); await ensureSchema(); return parseRows<Lead>(await db`SELECT data FROM leads ORDER BY (data->>'createdAt') DESC`); }
  public static async addLead(lead:Omit<Lead,'id'|'createdAt'|'status'>): Promise<Lead> { const db=requireDb(); await ensureSchema(); const item={...lead,id:`lead-${crypto.randomUUID()}`,createdAt:new Date().toISOString(),status:'pending' as const}; await db`INSERT INTO leads (id,data) VALUES (${item.id},${JSON.stringify(item)}::jsonb)`; return item; }
  public static async updateLeadStatus(id:string,status:'pending'|'contacted'|'archived'): Promise<Lead> { const db=requireDb(); await ensureSchema(); const rows=await db`SELECT data FROM leads WHERE id=${id}`; if(!rows[0]) throw new Error(`Lead with id ${id} not found`); const item={...(rows[0].data as Lead),status}; await db`UPDATE leads SET data=${JSON.stringify(item)}::jsonb WHERE id=${id}`; return item; }
  public static async getMediaKits(): Promise<MediaKit[]> { const db=requireDb(); await ensureSchema(); return parseRows<MediaKit>(await db`SELECT data FROM mediakits ORDER BY (data->>'createdAt') DESC`); }
  public static async addMediaKit(mediaKit:Omit<MediaKit,'id'|'createdAt'>): Promise<MediaKit> {
    const db=requireDb(); await ensureSchema();
    const supportIds=[...new Set(mediaKit.supportIds)];
    if(supportIds.length===0) throw new Error('Debe seleccionarse al menos un soporte.');
    const rows=await db`SELECT data FROM supports WHERE id = ANY(${supportIds})`;
    if(rows.length!==supportIds.length) throw new Error('Uno o más soportes seleccionados no existen.');
    if(mediaKit.campaignStartDate&&mediaKit.campaignEndDate){
      const start=toTime(mediaKit.campaignStartDate), end=toTime(mediaKit.campaignEndDate);
      if(start===null||end===null||start>end) throw new Error('El rango de fechas de campaña no es válido.');
      for(const row of rows){const support=row.data as Support;if(support.reservedFrom&&support.reservedUntil&&overlaps(mediaKit.campaignStartDate,mediaKit.campaignEndDate,support.reservedFrom,support.reservedUntil)) throw new Error(`El soporte "${support.name}" ya está reservado para ese período.`);}
    }
    const item={...mediaKit,supportIds,id:`mediakit-${crypto.randomUUID()}`,createdAt:new Date().toISOString()};
    await db`INSERT INTO mediakits (id,data) VALUES (${item.id},${JSON.stringify(item)}::jsonb)`;
    if(item.campaignStartDate&&item.campaignEndDate){
      for(const id of supportIds){const srows=await db`SELECT data FROM supports WHERE id=${id}`;if(srows[0]){const support=srows[0].data as Support;const reserved={...support,status:'reserved' as const,reservedFrom:item.campaignStartDate,reservedUntil:item.campaignEndDate};await db`UPDATE supports SET data=${JSON.stringify(reserved)}::jsonb WHERE id=${id}`;}}
    }
    return item;
  }
  public static async deleteMediaKit(id:string): Promise<boolean> {
    const db=requireDb(); await ensureSchema(); const rows=await db`SELECT data FROM mediakits WHERE id=${id}`; if(!rows[0]) return false;
    const kit=rows[0].data as MediaKit; const result=await db`DELETE FROM mediakits WHERE id=${id}`;
    if(kit.campaignStartDate&&kit.campaignEndDate){for(const supportId of kit.supportIds){const srows=await db`SELECT data FROM supports WHERE id=${supportId}`;if(srows[0]){const support=srows[0].data as Support;if(support.reservedFrom===kit.campaignStartDate&&support.reservedUntil===kit.campaignEndDate){const available={...support,status:'available' as const,reservedFrom:undefined,reservedUntil:undefined};await db`UPDATE supports SET data=${JSON.stringify(available)}::jsonb WHERE id=${supportId}`;}}}}
    return result.count>0;
  }
}
