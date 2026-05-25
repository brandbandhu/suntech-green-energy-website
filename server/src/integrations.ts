import nodemailer from "nodemailer";
import type mysql from "mysql2/promise";
import { config } from "./config.js";

type LeadPayload = {
  id: number;
  name: string;
  email: string | null;
  phone: string;
  pinCode: string | null;
  city: string | null;
  monthlyBill: number | null;
  message: string | null;
  sourcePage: string | null;
  referrer: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  createdAt: string;
};

type CompanyProfile = {
  email?: string;
  notificationsEmail?: string;
  name?: string;
};

const isTwilioConfigured = () =>
  Boolean(config.twilio.accountSid && config.twilio.authToken);

const formatLeadBody = (lead: LeadPayload) => [
  `Lead ID: ${lead.id}`,
  `Name: ${lead.name}`,
  `Email: ${lead.email || "Not provided"}`,
  `Phone: ${lead.phone}`,
  `PIN Code: ${lead.pinCode || "Not provided"}`,
  `City: ${lead.city || "Not provided"}`,
  `Monthly Bill: ${lead.monthlyBill != null ? `Rs ${lead.monthlyBill}` : "Not provided"}`,
  `Message: ${lead.message || "Not provided"}`,
  `Source Page: ${lead.sourcePage || "Unknown"}`,
  `Referrer: ${lead.referrer || "Direct"}`,
  `UTM Source: ${lead.utmSource || "-"}`,
  `UTM Medium: ${lead.utmMedium || "-"}`,
  `UTM Campaign: ${lead.utmCampaign || "-"}`,
  `Received At: ${lead.createdAt}`,
].join("\n");

const sendTwilioMessage = async (to: string, from: string, body: string) => {
  if (!isTwilioConfigured()) {
    return;
  }

  const url = `https://api.twilio.com/2010-04-01/Accounts/${config.twilio.accountSid}/Messages.json`;
  const authHeader = Buffer.from(`${config.twilio.accountSid}:${config.twilio.authToken}`).toString("base64");

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Basic ${authHeader}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      To: to,
      From: from,
      Body: body,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Twilio request failed: ${text}`);
  }
};

const normalizeWhatsAppNumber = (value: string) =>
  value.startsWith("whatsapp:") ? value : `whatsapp:${value}`;

export const sendLeadNotifications = async (
  db: mysql.Pool,
  lead: LeadPayload,
  companyProfile: CompanyProfile,
) => {
  const message = formatLeadBody(lead);

  const tasks: Promise<unknown>[] = [];

  if (config.smtp.host && config.smtp.user && config.smtp.pass && config.smtp.from) {
    const transporter = nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: config.smtp.secure,
      auth: {
        user: config.smtp.user,
        pass: config.smtp.pass,
      },
    });

    const to = companyProfile.notificationsEmail || companyProfile.email;

    if (to) {
      tasks.push(
        transporter.sendMail({
          from: config.smtp.from,
          to,
          subject: `New website lead: ${lead.name}`,
          text: message,
        }),
      );
    }
  }

  if (config.twilio.smsFrom && config.twilio.smsTo) {
    tasks.push(sendTwilioMessage(config.twilio.smsTo, config.twilio.smsFrom, message));
  }

  if (config.twilio.whatsappFrom && config.twilio.whatsappTo) {
    tasks.push(
      sendTwilioMessage(
        normalizeWhatsAppNumber(config.twilio.whatsappTo),
        normalizeWhatsAppNumber(config.twilio.whatsappFrom),
        message,
      ),
    );
  }

  if (config.crmWebhookUrl) {
    tasks.push(
      (async () => {
        try {
          const response = await fetch(config.crmWebhookUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              lead,
              companyName: companyProfile.name || "SUNTECH GREEN ENERGY SOLAR",
            }),
          });

          const responseText = await response.text();

          await db.execute(
            `INSERT INTO crm_sync_logs (lead_id, target, status, response_text)
             VALUES (?, 'crm_webhook', ?, ?)`,
            [lead.id, response.ok ? "success" : "failed", responseText.slice(0, 5000)],
          );

          if (!response.ok) {
            throw new Error(responseText);
          }
        } catch (error) {
          await db.execute(
            `INSERT INTO crm_sync_logs (lead_id, target, status, response_text)
             VALUES (?, 'crm_webhook', 'failed', ?)`,
            [lead.id, error instanceof Error ? error.message : "Unknown CRM error"],
          );
        }
      })(),
    );
  }

  await Promise.allSettled(tasks);
};
