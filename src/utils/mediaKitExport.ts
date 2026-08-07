import { DoohScreen } from "../types";
import { MediaKit } from "../components/dashboard/types";

/**
 * Generates a clean, modern, standalone HTML string representing the MediaKit presentation.
 * Designed with a premium print layout (A4 / Letter-safe) that formats perfectly for PDF output.
 * Contains custom inline CSS, responsive vector charts, and precise geographical references.
 */
export function generateMediaKitHtml(
  screens: DoohScreen[],
  title: string,
  clientName: string,
  city: string,
  metaInfo: {
    id?: string;
    version?: number;
    notes?: string;
    preparedBy?: string;
  } = {}
): string {
  const preparedBy = metaInfo.preparedBy || "Director Comercial - Grupo Comunicarte";
  const docId = metaInfo.id || `MK-${Math.floor(1000 + Math.random() * 9000)}`;
  const version = metaInfo.version || 1;
  const dateStr = new Date().toLocaleDateString("es-AR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Calculate totals
  const totalScreens = screens.length;
  const totalImpacts = screens.reduce((sum, s) => sum + s.impactos, 0);
  const totalWeeklyPrice = screens.reduce((sum, s) => sum + s.precio, 0);
  const totalMonthlyPrice = totalWeeklyPrice * 4;

  // Generate SVG Map visual representation of coordinates
  // Normalize lat/lng to fit within a nice SVG coordinate space (e.g. 500x300)
  let svgPins = "";
  let svgLines = "";
  if (screens.length > 0) {
    const lats = screens.map(s => s.lat);
    const lngs = screens.map(s => s.lng);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    const padX = 40;
    const padY = 40;
    const width = 560;
    const height = 240;

    const latRange = maxLat - minLat || 0.01;
    const lngRange = maxLng - minLng || 0.01;

    screens.forEach((screen, index) => {
      // Map lat/lng to SVG space (with latitude inverted as y-axis)
      const x = padX + ((screen.lng - minLng) / lngRange) * (width - 2 * padX);
      const y = height - (padY + ((screen.lat - minLat) / latRange) * (height - 2 * padY));

      // Draw grid connecting lines if multiple screens
      if (index > 0) {
        const prevX = padX + ((screens[index - 1].lng - minLng) / lngRange) * (width - 2 * padX);
        const prevY = height - (padY + ((screens[index - 1].lat - minLat) / latRange) * (height - 2 * padY));
        svgLines += `<line x1="${prevX}" y1="${prevY}" x2="${x}" y2="${y}" stroke="#06434a" stroke-dasharray="3,3" stroke-opacity="0.3" stroke-width="1.5" />`;
      }

      // Pin color based on category
      const pinColor = screen.categoria === "Pantallas LED" ? "#06434a" : screen.categoria === "LED Móvil" ? "#ca8a04" : "#2563eb";

      svgPins += `
        <g transform="translate(${x}, ${y})">
          <circle r="14" fill="${pinColor}" fill-opacity="0.1" />
          <circle r="7" fill="${pinColor}" stroke="#ffffff" stroke-width="1.5" />
          <text y="-14" text-anchor="middle" font-family="sans-serif" font-size="7" font-weight="900" fill="#1c1917" background="#ffffff">
            ${index + 1}. ${screen.nombre.split(" ")[0]}
          </text>
        </g>
      `;
    });
  }

  // Generate SVG Bar Chart of Audience Impacts
  let barItems = "";
  if (screens.length > 0) {
    const maxImpact = Math.max(...screens.map(s => s.impactos)) || 1;
    screens.forEach((screen, index) => {
      const heightPercent = (screen.impactos / maxImpact) * 110;
      const x = 40 + index * 60;
      const y = 140 - heightPercent;
      const barColor = screen.categoria === "Pantallas LED" ? "#06434a" : screen.categoria === "LED Móvil" ? "#ca8a04" : "#2563eb";

      barItems += `
        <g>
          <rect x="${x}" y="${y}" width="24" height="${heightPercent}" rx="3" fill="${barColor}" opacity="0.9" />
          <text x="${x + 12}" y="${y - 6}" text-anchor="middle" font-family="monospace" font-size="7" font-weight="bold" fill="#06434a">
            ${(screen.impactos / 1000).toFixed(1)}k
          </text>
          <text x="${x + 12}" y="152" text-anchor="middle" font-family="sans-serif" font-size="7" font-weight="900" fill="#78716c">
            #${index + 1}
          </text>
        </g>
      `;
    });
  }

  // HTML rows of screens listing
  const rowsHtml = screens
    .map(
      (screen, index) => `
    <tr class="item-row">
      <td class="text-center font-mono font-bold text-stone-400" style="width: 40px; padding: 12px 6px;">
        ${(index + 1).toString().padStart(2, "0")}
      </td>
      <td style="padding: 12px 16px; text-align: left;">
        <span class="badge ${
          screen.categoria === "Pantallas LED"
            ? "badge-teal"
            : screen.categoria === "LED Móvil"
            ? "badge-amber"
            : "badge-blue"
        }">${screen.categoria || "DOOH"}</span>
        <h4 style="margin: 6px 0 2px 0; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px; font-weight: 800; color: #1c1917;">
          ${screen.nombre}
        </h4>
        <p style="margin: 0; font-size: 10px; color: #78716c; font-weight: 500;">
          ${screen.ciudad} • ${screen.zona}
        </p>
      </td>
      <td style="padding: 12px 16px; text-align: left; font-size: 11px; color: #44403c; line-height: 1.4;">
        <div><strong>Fto:</strong> ${screen.formato || "No especificado"}</div>
        <div style="margin-top: 2px;"><strong>Dim:</strong> ${screen.dimensiones || "Estándar"}</div>
      </td>
      <td style="padding: 12px 16px; text-align: left; font-size: 11px; color: #44403c; line-height: 1.4;">
        <div><strong>Brillo:</strong> ${screen.brillo || "N/A"}</div>
        <div style="margin-top: 2px;"><strong>Tránsito:</strong> ${screen.tipo || "Mixto"}</div>
      </td>
      <td class="font-mono text-right font-bold" style="padding: 12px 16px; font-size: 12px; color: #15803d;">
        ${(screen.impactos / 1000).toFixed(1)}k / día
      </td>
      <td class="font-mono text-right font-bold" style="padding: 12px 16px; font-size: 12px; color: #06434a;">
        $${screen.precio.toLocaleString()}
      </td>
    </tr>
  `
    )
    .join("");

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} | Presentación MediaKit</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
    
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    body {
      font-family: 'Plus Jakarta Sans', sans-serif;
      background-color: #FAF9F5;
      color: #292524;
      margin: 0;
      padding: 0;
      line-height: 1.6;
    }

    .container {
      max-width: 800px;
      margin: 40px auto;
      background: #ffffff;
      border: 1px solid #e7e5e4;
      padding: 48px;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(28, 25, 23, 0.03);
    }

    /* Professional header block styling - Zero AI Slop */
    .header-block {
      border-bottom: 2px solid #06434a;
      padding-bottom: 24px;
      margin-bottom: 32px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .brand-section {
      text-align: left;
    }

    .brand-logo-badge {
      background-color: #06434a;
      color: #ffffff;
      font-weight: 900;
      font-size: 14px;
      padding: 4px 8px;
      border-radius: 6px;
      display: inline-block;
      margin-bottom: 12px;
    }

    .brand-company {
      font-size: 10px;
      font-weight: 900;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: #78716c;
    }

    .proposal-title {
      font-family: 'Playfair Display', serif;
      font-size: 26px;
      font-weight: 900;
      color: #06434a;
      margin: 4px 0 8px 0;
      line-height: 1.2;
    }

    .proposal-subtitle {
      font-size: 12px;
      color: #78716c;
      font-weight: 500;
      margin: 0;
    }

    .meta-section {
      text-align: right;
      font-size: 11px;
      color: #78716c;
      line-height: 1.6;
      font-weight: 600;
    }

    .meta-id {
      font-family: monospace;
      font-weight: bold;
      color: #06434a;
      background: #f5f5f4;
      padding: 2px 6px;
      border-radius: 4px;
    }

    /* Key metrics grid */
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin-bottom: 36px;
    }

    .metric-card {
      background: #fafafa;
      border: 1px solid #f5f5f4;
      padding: 16px;
      border-radius: 12px;
      text-align: left;
    }

    .metric-label {
      font-size: 8px;
      font-weight: 800;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #a8a29e;
      margin-bottom: 4px;
    }

    .metric-value {
      font-size: 18px;
      font-weight: 900;
      color: #1c1917;
      margin: 0;
      font-family: 'Plus Jakarta Sans', sans-serif;
    }

    .metric-sub {
      font-size: 10px;
      font-weight: 600;
      color: #06434a;
      margin-top: 2px;
    }

    /* Infographic grid */
    .infographic-grid {
      display: grid;
      grid-template-columns: 1.2fr 1fr;
      gap: 20px;
      margin-bottom: 36px;
    }

    .chart-box {
      border: 1px solid #e7e5e4;
      border-radius: 12px;
      padding: 16px;
      background: #ffffff;
      text-align: center;
    }

    .chart-title {
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      color: #78716c;
      margin-bottom: 12px;
      text-align: left;
      border-bottom: 1px solid #f5f5f4;
      padding-bottom: 6px;
    }

    /* Responsive Table Styles */
    .table-container {
      width: 100%;
      border: 1px solid #e7e5e4;
      border-radius: 12px;
      overflow: hidden;
      margin-bottom: 36px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }

    th {
      background-color: #f5f5f4;
      color: #78716c;
      font-size: 9px;
      font-weight: 800;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      padding: 10px 16px;
      border-bottom: 1px solid #e7e5e4;
    }

    tr.item-row {
      border-bottom: 1px solid #f5f5f4;
    }

    tr.item-row:last-child {
      border-bottom: none;
    }

    tr.item-row:nth-child(even) {
      background-color: #fafaf9;
    }

    /* Badges */
    .badge {
      font-size: 8px;
      font-weight: 900;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      padding: 2px 6px;
      border-radius: 4px;
      display: inline-block;
    }

    .badge-teal {
      background-color: #e6f1f2;
      color: #06434a;
      border: 1px solid #ccdfdf;
    }

    .badge-amber {
      background-color: #fef9c3;
      color: #ca8a04;
      border: 1px solid #fef08a;
    }

    .badge-blue {
      background-color: #dbeafe;
      color: #2563eb;
      border: 1px solid #bfdbfe;
    }

    /* Guidance/Notes Box */
    .notes-box {
      background-color: #f5fbfb;
      border-left: 3px solid #06434a;
      padding: 16px;
      border-radius: 0 12px 12px 0;
      margin-bottom: 36px;
      text-align: left;
    }

    .notes-title {
      font-size: 9px;
      font-weight: 800;
      text-transform: uppercase;
      color: #06434a;
      letter-spacing: 0.05em;
      margin: 0 0 4px 0;
    }

    .notes-content {
      font-size: 11px;
      color: #44403c;
      margin: 0;
      line-height: 1.5;
    }

    /* Footer / Signatures */
    .footer-block {
      border-top: 1px solid #e7e5e4;
      padding-top: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 11px;
      color: #78716c;
    }

    .signature-box {
      border-top: 1px solid #d6d3d1;
      width: 200px;
      margin-top: 32px;
      padding-top: 6px;
      font-size: 9px;
      font-weight: 700;
      text-align: center;
    }

    .print-btn-container {
      max-width: 800px;
      margin: 0 auto 20px auto;
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }

    .btn {
      font-family: inherit;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 8px 16px;
      border-radius: 8px;
      cursor: pointer;
      border: 1px solid #d6d3d1;
      background: #ffffff;
      color: #44403c;
      transition: all 0.2s;
    }

    .btn-primary {
      background-color: #06434a;
      border-color: #06434a;
      color: #ffffff;
    }

    .btn:hover {
      opacity: 0.9;
    }

    @media print {
      body {
        background-color: #ffffff;
        font-size: 11px;
      }
      .container {
        border: none;
        box-shadow: none;
        padding: 0;
        margin: 0;
        max-width: 100%;
      }
      .print-btn-container {
        display: none;
      }
      .metrics-grid {
        gap: 12px;
      }
      .metric-card {
        padding: 12px;
      }
      /* Ensure proper page breaks */
      .page-break {
        page-break-before: always;
      }
    }
  </style>
</head>
<body>

  <!-- Printable Actions (hidden on print) -->
  <div class="print-btn-container" style="padding-top: 20px;">
    <button class="btn" onclick="window.close()">Cerrar Vista</button>
    <button class="btn btn-primary" onclick="window.print()">Imprimir / Guardar PDF</button>
  </div>

  <div class="container">
    
    <!-- 1. Header block -->
    <div class="header-block">
      <div class="brand-section">
        <div class="brand-logo-badge">C</div>
        <div class="brand-company">Grupo Comunicarte</div>
        <h1 class="proposal-title">${title}</h1>
        <p class="proposal-subtitle">Propuesta Comercial de Pauta Exterior OOH/DOOH</p>
      </div>

      <div class="meta-section">
        <div>Propuesta: <span class="meta-id">${docId}</span></div>
        <div style="margin-top: 4px;">Versión: <strong>v${version}.0</strong></div>
        <div style="margin-top: 4px;">Fecha: <strong>${dateStr}</strong></div>
        <div style="margin-top: 4px;">Plaza: <strong>${city}</strong></div>
      </div>
    </div>

    <!-- 2. Campaign Metrics Summary -->
    <div class="metrics-grid">
      <div class="metric-card" style="border-left: 3px solid #06434a;">
        <div class="metric-label">Soportes Seleccionados</div>
        <div class="metric-value">${totalScreens} Pantallas</div>
        <div class="metric-sub">Distribución geolocalizada</div>
      </div>
      
      <div class="metric-card" style="border-left: 3px solid #16a34a;">
        <div class="metric-label">Impacto Estimado</div>
        <div class="metric-value">${(totalImpacts / 1000).toFixed(1)}k / día</div>
        <div class="metric-sub">${(totalImpacts * 30 / 1000000).toFixed(1)}M impactos / mes</div>
      </div>

      <div class="metric-card" style="border-left: 3px solid #ca8a04;">
        <div class="metric-label">Inversión Mensual Est.</div>
        <div class="metric-value">$${totalMonthlyPrice.toLocaleString()}</div>
        <div class="metric-sub">Base: $${totalWeeklyPrice.toLocaleString()} / sem</div>
      </div>
    </div>

    <!-- 3. Infographic Vector Layout: Geographic & Impact Distribution -->
    <div class="infographic-grid">
      
      <!-- Visual Map Vector Representation -->
      <div class="chart-box">
        <div class="chart-title">Mapa de Cobertura Geográfica (Puntos Catalogados)</div>
        <div style="height: 240px; background-color: #fafaf9; border-radius: 8px; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; border: 1px solid #f5f5f4;">
          <svg width="100%" height="100%" viewBox="0 0 560 240" style="background-color: #f7f6f2;">
            <!-- Simple gridlines for architectural look -->
            <line x1="10" y1="40" x2="550" y2="40" stroke="#e7e5e4" stroke-width="0.5" />
            <line x1="10" y1="80" x2="550" y2="80" stroke="#e7e5e4" stroke-width="0.5" />
            <line x1="10" y1="120" x2="550" y2="120" stroke="#e7e5e4" stroke-width="0.5" />
            <line x1="10" y1="160" x2="550" y2="160" stroke="#e7e5e4" stroke-width="0.5" />
            <line x1="10" y1="200" x2="550" y2="200" stroke="#e7e5e4" stroke-width="0.5" />
            
            <line x1="80" y1="10" x2="80" y2="230" stroke="#e7e5e4" stroke-width="0.5" />
            <line x1="160" y1="10" x2="160" y2="230" stroke="#e7e5e4" stroke-width="0.5" />
            <line x1="240" y1="10" x2="240" y2="230" stroke="#e7e5e4" stroke-width="0.5" />
            <line x1="320" y1="10" x2="320" y2="230" stroke="#e7e5e4" stroke-width="0.5" />
            <line x1="400" y1="10" x2="400" y2="230" stroke="#e7e5e4" stroke-width="0.5" />
            <line x1="480" y1="10" x2="480" y2="230" stroke="#e7e5e4" stroke-width="0.5" />

            <!-- Compass accent -->
            <g transform="translate(520, 40)" stroke="#78716c" stroke-width="1" fill="none">
              <circle r="15" stroke-dasharray="2,2" />
              <line x1="0" y1="-18" x2="0" y2="18" />
              <line x1="-18" y1="0" x2="18" y2="0" />
              <text x="0" y="-20" text-anchor="middle" font-family="sans-serif" font-size="7" font-weight="bold" fill="#78716c">N</text>
            </g>

            <!-- Grid coordinates border values -->
            <text x="12" y="232" font-family="monospace" font-size="6" fill="#a8a29e">REF: G_COMUNICARTE_COORD_MAP</text>

            <!-- Vector Connecting Network Lines -->
            ${svgLines}

            <!-- Vector Map Pins -->
            ${svgPins}
          </svg>
        </div>
      </div>

      <!-- Vector Impacts comparison graph -->
      <div class="chart-box">
        <div class="chart-title">Distribución de Impactos Diarios por Soporte</div>
        <div style="height: 240px; background-color: #fafaf9; border-radius: 8px; display: flex; align-items: center; justify-content: center; border: 1px solid #f5f5f4;">
          <svg width="100%" height="100%" viewBox="0 0 240 180" style="background-color: #fafaf9;">
            <!-- Horizontal baselines -->
            <line x1="20" y1="30" x2="220" y2="30" stroke="#e7e5e4" stroke-width="0.5" />
            <line x1="20" y1="85" x2="220" y2="85" stroke="#e7e5e4" stroke-width="0.5" />
            <line x1="20" y1="140" x2="220" y2="140" stroke="#e7e5e4" stroke-width="1" />

            <!-- Render dynamic bars -->
            ${barItems}
          </svg>
        </div>
      </div>

    </div>

    <!-- 4. Notes and orientations -->
    <div class="notes-box">
      <h3 class="notes-title">Orientación Estratégica & Plan de Pauta</h3>
      <p class="notes-content">
        ${
          metaInfo.notes ||
          "La pauta propuesta tiene como objetivo captar la atención de flujos mixtos comerciales de alta densidad. Las ubicaciones han sido seleccionadas estratégicamente para maximizar los impactos diarios continuos."
        }
      </p>
    </div>

    <!-- Page Break here for pristine inventory table layout on PDF export -->
    <div class="page-break" style="margin-top: 30px;"></div>

    <!-- 5. Soportes Detail Listing Table -->
    <h3 style="font-family: 'Playfair Display', serif; font-size: 16px; font-weight: 900; color: #06434a; margin: 0 0 16px 0; border-bottom: 1px solid #e7e5e4; padding-bottom: 8px; text-align: left;">
      Especificaciones Técnicas del Lote de Exhibición
    </h3>
    
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th class="text-center" style="width: 40px;">Item</th>
            <th>Soporte / Ubicación</th>
            <th>Formatos / Dim.</th>
            <th>Características</th>
            <th style="text-align: right;">Impactos</th>
            <th style="text-align: right;">Tarifa Sem.</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
    </div>

    <!-- 6. General Commercial Terms -->
    <div style="background-color: #fcfbf9; border: 1px solid #f2efeb; padding: 16px; border-radius: 12px; margin-bottom: 36px; text-align: left; font-size: 10px; color: #57534e; line-height: 1.5;">
      <h4 style="margin: 0 0 6px 0; color: #1c1917; font-weight: bold; text-transform: uppercase; font-size: 9px; letter-spacing: 0.05em;">Condiciones Generales de Contratación</h4>
      <ul style="margin: 0; padding-left: 16px;">
        <li>Las tarifas no incluyen IVA. Sujetas a modificaciones según disponibilidad al momento del bloqueo de reserva.</li>
        <li>La duración mínima de la pauta es de una (1) semana, con loops regulares de 15 segundos cada 2 minutos en pantallas digitales.</li>
        <li>Los materiales creativos deberán entregarse con un mínimo de 48 hs hábiles antes del inicio de campaña en los formatos especificados.</li>
      </ul>
    </div>

    <!-- 7. Bottom Sign-off / Signature section -->
    <div class="footer-block">
      <div style="text-align: left;">
        <strong>Preparado para:</strong> ${clientName}<br />
        <strong>Por:</strong> ${preparedBy}
      </div>

      <div>
        <div class="signature-box">
          Firma Conforme de Aceptación<br />
          <span style="font-size: 7px; color: #a8a29e; font-weight: normal; margin-top: 2px; display: block;">Representante de la Firma Cliente</span>
        </div>
      </div>
    </div>

  </div>

</body>
</html>
  `;
}

/**
 * Triggers a download of the full, standalone MediaKit document as an HTML file.
 * The exported file has built-in styling, high-fidelity SVGs, and printable behavior.
 */
export function downloadMediaKitAsHtml(
  screens: DoohScreen[],
  title: string,
  clientName: string,
  city: string,
  metaInfo?: {
    id?: string;
    version?: number;
    notes?: string;
    preparedBy?: string;
  }
) {
  const htmlContent = generateMediaKitHtml(screens, title, clientName, city, metaInfo);
  const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.href = url;
  
  const safeTitle = title.replace(/[^a-z0-9]/gi, "_").toLowerCase();
  link.setAttribute("download", `mediakit_${safeTitle}_export.html`);
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
