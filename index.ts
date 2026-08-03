import type { VercelRequest, VercelResponse } from "@vercel/node";
import { db } from "../../src/db/index";
import { leads } from "../../src/db/schema";
import { desc } from "drizzle-orm";

async function sendLeadNotificationEmail(lead: any) {
  const apiKey = process.env.RESEND_API_KEY;
  const toEmail =
    process.env.SALES_NOTIFY_EMAIL || "comercial@pantallasledmendoza.com";

  const emailHtml = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e7e5e4; border-radius: 12px; background-color: #faf9f5; text-align: left;">
      <h2 style="color: #06434a; border-bottom: 2px solid #06434a; padding-bottom: 10px; margin-top: 0;">🎉 ¡Nuevo Lead Recibido!</h2>
      <p style="font-size: 14px; color: #444; line-height: 1.5;">Se ha registrado un nuevo contacto interesado a través de los canales digitales de la plataforma comercial:</p>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px;">
        <tr style="background-color: #f5f4f0;"><td style="padding: 10px; font-weight: bold; width: 150px; border-bottom: 1px solid #e7e5e4; color: #1c1917;">Anunciante / Nombre</td><td style="padding: 10px; border-bottom: 1px solid #e7e5e4; color: #444;">${lead.name}</td></tr>
        <tr><td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #e7e5e4; color: #1c1917;">Email</td><td style="padding: 10px; border-bottom: 1px solid #e7e5e4; color: #444;"><a href="mailto:${lead.email}" style="color: #06434a; text-decoration: underline;">${lead.email}</a></td></tr>
        <tr style="background-color: #f5f4f0;"><td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #e7e5e4; color: #1c1917;">Empresa</td><td style="padding: 10px; border-bottom: 1px solid #e7e5e4; color: #444;">${lead.company || "No especificada"}</td></tr>
        <tr><td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #e7e5e4; color: #1c1917;">Origen del Lead</td><td style="padding: 10px; border-bottom: 1px solid #e7e5e4; color: #444;"><span style="background-color: #06434a; color: white; padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: bold;">${lead.source}</span></td></tr>
        <tr style="background-color: #f5f4f0;"><td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #e7e5e4; color: #1c1917;">Presupuesto Estimado</td><td style="padding: 10px; border-bottom: 1px solid #e7e5e4; color: #444; font-weight: bold; color: #06434a;">$${lead.value ? lead.value.toLocaleString() : "0"} ARS</td></tr>
      </table>
      <div style="margin-top: 25px; padding-top: 15px; border-top: 1px solid #e7e5e4; font-size: 11px; color: #888; text-align: center;">Este es un mensaje automático del Sistema de Gestión Comercial de Pantallas LED Mendoza.</div>
    </div>`;

  if (!apiKey) {
    console.log("SIMULACIÓN DE NOTIFICACIÓN POR EMAIL (FALTA RESEND_API_KEY)");
    return { simulated: true, success: true };
  }

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: "Plataforma DOOH <onboarding@resend.dev>",
        to: toEmail,
        subject: `🎯 Nuevo Lead: ${lead.name} - ${lead.company}`,
        html: emailHtml,
      }),
    });
  } catch (error) {
    console.error("Failed to send lead email via Resend:", error);
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "GET") {
    try {
      const dbLeads = await db.select().from(leads).orderBy(desc(leads.id));
      const formatted = dbLeads.map((row) => ({
        id: String(row.id),
        name: row.name,
        email: row.email,
        company: row.company || "",
        source: row.source || "",
        status: row.status || "new",
        date: row.date || new Date().toISOString(),
        value: row.value || 0,
      }));
      return res.status(200).json({ success: true, data: formatted });
    } catch (error: any) {
      console.error("Error fetching leads:", error);
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  if (req.method === "POST") {
    const { name, email, company, source, status, value } = req.body;
    if (!name || !email) {
      return res.status(400).json({ success: false, error: "Name and Email are required." });
    }

    try {
      const inserted = await db
        .insert(leads)
        .values({
          name,
          email,
          company: company || "Freelancer / Indiv",
          source: source || "Formulario Web",
          status: status || "new",
          date: new Date().toISOString(),
          value: Number(value) || 0,
        })
        .returning();

      const row = inserted[0];
      const leadData = {
        id: String(row.id),
        name: row.name,
        email: row.email,
        company: row.company || "",
        source: row.source || "",
        status: row.status || "new",
        date: row.date || new Date().toISOString(),
        value: row.value || 0,
      };

      // No esperar a que el email se envíe para responder
      sendLeadNotificationEmail(leadData);

      return res.status(200).json({ success: true, data: leadData });
    } catch (error: any) {
      console.error("Error creating lead:", error);
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}