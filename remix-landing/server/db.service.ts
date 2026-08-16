import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { Lead, MediaKit, Support } from '../src/types/index.js';
import { MOCK_IMAGES } from './mock-images.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, 'db.json');

const DEFAULT_SUPPORTS: Support[] = [
  {
    id: 'mza-led-1',
    name: 'Pantalla LED Acceso Este Mendoza',
    plaza: 'Mendoza',
    type: 'Pantallas LED',
    address: 'Acceso Este y Costanera, Mendoza',
    latitude: -32.8895,
    longitude: -68.8212,
    description: 'Pantalla LED premium de alta visibilidad ubicada sobre uno de los corredores de ingreso más importantes de Mendoza.',
    imageUrl: MOCK_IMAGES.led[0],
    status: 'available',
    size: '10x5m',
    refPoints: ['Acceso Este', 'Costanera', 'Centro de Mendoza'],
    contactsCount: '1.4M visualizaciones/mes'
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
      const initialSchema: DatabaseSchema = { supports: DEFAULT_SUPPORTS, leads: [], mediakits: [] };
      fs.writeFileSync(DB_PATH, JSON.stringify(initialSchema, null, 2), 'utf-8');
      return initialSchema;
    }
    try {
      return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8')) as DatabaseSchema;
    } catch (error) {
      console.error('Error reading database file, recreating schema...', error);
      const initialSchema: DatabaseSchema = { supports: DEFAULT_SUPPORTS, leads: [], mediakits: [] };
      fs.writeFileSync(DB_PATH, JSON.stringify(initialSchema, null, 2), 'utf-8');
      return initialSchema;
    }
  }

  private static saveDB(data: DatabaseSchema) { fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8'); }

  public static getSupports(): Support[] { return this.initDB().supports; }
  public static addSupport(support: Omit<Support, 'id'>): Support { const db=this.initDB(); const newSupport={...support,id:`support-${Date.now()}`}; db.supports.push(newSupport); this.saveDB(db); return newSupport; }
  public static updateSupport(id: string, updatedFields: Partial<Support>): Support { const db=this.initDB(); const index=db.supports.findIndex(s=>s.id===id); if(index===-1) throw new Error(`Support with id ${id} not found`); const updated={...db.supports[index],...updatedFields}; db.supports[index]=updated; this.saveDB(db); return updated; }
  public static deleteSupport(id: string): boolean { const db=this.initDB(); const before=db.supports.length; db.supports=db.supports.filter(s=>s.id!==id); this.saveDB(db); return db.supports.length<before; }

  public static getLeads(): Lead[] { return this.initDB().leads; }
  public static addLead(lead: Omit<Lead,'id'|'createdAt'|'status'>): Lead { const db=this.initDB(); const newLead={...lead,id:`lead-${Date.now()}`,createdAt:new Date().toISOString(),status:'pending' as const}; db.leads.unshift(newLead); this.saveDB(db); return newLead; }
  public static updateLeadStatus(id: string, status: 'pending' | 'contacted' | 'archived'): Lead { const db=this.initDB(); const index=db.leads.findIndex(l=>l.id===id); if(index===-1) throw new Error(`Lead with id ${id} not found`); db.leads[index].status=status; this.saveDB(db); return db.leads[index]; }

  public static getMediaKits(): MediaKit[] { return this.initDB().mediakits; }
  public static addMediaKit(mediaKit: Omit<MediaKit,'id'|'createdAt'>): MediaKit { const db=this.initDB(); const newMediaKit={...mediaKit,id:`mediakit-${Date.now()}`,createdAt:new Date().toISOString()}; db.mediakits.unshift(newMediaKit); this.saveDB(db); return newMediaKit; }
  public static deleteMediaKit(id: string): boolean { const db=this.initDB(); const before=db.mediakits.length; db.mediakits=db.mediakits.filter(m=>m.id!==id); this.saveDB(db); return db.mediakits.length<before; }
}
