// SOS Emergency Notification Edge Function
// Sends SMS (Twilio) and Email (SendGrid) notifications to emergency contacts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface Contact {
  id: string;
  name: string;
  phone_number: string;
  email?: string;
}

interface SOSPayload {
  alert_id: string;
  user_id: string;
  latitude: number | null;
  longitude: number | null;
  alert_type: string;
  notes?: string;
  contacts: Contact[];
}

interface NotificationResult {
  contact_id: string;
  sms_sent: boolean;
  email_sent: boolean;
  errors: string[];
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const payload: SOSPayload = await req.json();
    const { alert_id, user_id, latitude, longitude, alert_type, notes, contacts } = payload;

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user profile for name
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user_id)
      .single();

    const userName = profile?.full_name || "A She-Safe-Nomad user";

    // Generate map link
    const mapLink = latitude && longitude
      ? `https://www.google.com/maps?q=${latitude},${longitude}`
      : "Location unavailable";

    // Get notification service credentials
    const twilioAccountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
    const twilioAuthToken = Deno.env.get("TWILIO_AUTH_TOKEN");
    const twilioPhoneNumber = Deno.env.get("TWILIO_PHONE_NUMBER");
    const sendgridApiKey = Deno.env.get("SENDGRID_API_KEY");
    const fromEmail = Deno.env.get("FROM_EMAIL") || "alerts@shesafenomad.com";

    const results: NotificationResult[] = [];
    const notifiedContactIds: string[] = [];

    // Process each contact
    for (const contact of contacts) {
      const result: NotificationResult = {
        contact_id: contact.id,
        sms_sent: false,
        email_sent: false,
        errors: [],
      };

      // Construct message
      const smsMessage = `EMERGENCY ALERT: ${userName} has triggered an SOS alert on She-Safe-Nomad. ${
        notes ? `Message: ${notes}. ` : ""
      }Location: ${mapLink}. Please contact them immediately or alert local authorities.`;

      // Send SMS via Twilio
      if (contact.phone_number && twilioAccountSid && twilioAuthToken && twilioPhoneNumber) {
        try {
          const twilioResponse = await fetch(
            `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`,
            {
              method: "POST",
              headers: {
                "Authorization": `Basic ${btoa(`${twilioAccountSid}:${twilioAuthToken}`)}`,
                "Content-Type": "application/x-www-form-urlencoded",
              },
              body: new URLSearchParams({
                To: contact.phone_number,
                From: twilioPhoneNumber,
                Body: smsMessage,
              }),
            }
          );

          if (twilioResponse.ok) {
            result.sms_sent = true;
            console.log(`SMS sent to ${contact.name} (${contact.phone_number})`);
          } else {
            const error = await twilioResponse.text();
            result.errors.push(`SMS failed: ${error}`);
            console.error(`SMS failed for ${contact.name}:`, error);
          }
        } catch (smsError) {
          result.errors.push(`SMS error: ${smsError.message}`);
          console.error(`SMS error for ${contact.name}:`, smsError);
        }
      }

      // Send Email via SendGrid
      if (contact.email && sendgridApiKey) {
        try {
          const emailHtml = buildEmailHtml(userName, mapLink, notes, latitude, longitude, alert_type);

          const sendgridResponse = await fetch("https://api.sendgrid.com/v3/mail/send", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${sendgridApiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              personalizations: [
                {
                  to: [{ email: contact.email, name: contact.name }],
                },
              ],
              from: { email: fromEmail, name: "She-Safe-Nomad Emergency" },
              subject: `EMERGENCY: ${userName} needs help!`,
              content: [
                { type: "text/plain", value: smsMessage },
                { type: "text/html", value: emailHtml },
              ],
            }),
          });

          if (sendgridResponse.ok || sendgridResponse.status === 202) {
            result.email_sent = true;
            console.log(`Email sent to ${contact.name} (${contact.email})`);
          } else {
            const error = await sendgridResponse.text();
            result.errors.push(`Email failed: ${error}`);
            console.error(`Email failed for ${contact.name}:`, error);
          }
        } catch (emailError) {
          result.errors.push(`Email error: ${emailError.message}`);
          console.error(`Email error for ${contact.name}:`, emailError);
        }
      }

      // Track if any notification was sent
      if (result.sms_sent || result.email_sent) {
        notifiedContactIds.push(contact.id);
      }

      results.push(result);
    }

    // Update alert with notification status
    const { error: updateError } = await supabase
      .from("sos_alerts")
      .update({
        contacts_notified: notifiedContactIds,
        updated_at: new Date().toISOString(),
      })
      .eq("id", alert_id);

    if (updateError) {
      console.error("Failed to update alert:", updateError);
    }

    // Log notification event
    await supabase.from("notification_logs").insert([
      {
        alert_id,
        user_id,
        notification_type: "sos",
        contacts_attempted: contacts.length,
        contacts_notified: notifiedContactIds.length,
        results: JSON.stringify(results),
        created_at: new Date().toISOString(),
      },
    ]).catch((err) => {
      // Don't fail if logging fails
      console.error("Failed to log notification:", err);
    });

    return new Response(
      JSON.stringify({
        success: true,
        notified: notifiedContactIds.length,
        total: contacts.length,
        results,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("SOS notification error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});

function buildEmailHtml(
  userName: string,
  mapLink: string,
  notes: string | undefined,
  latitude: number | null,
  longitude: number | null,
  alertType: string
): string {
  const alertTypeLabel = alertType === "emergency"
    ? "EMERGENCY"
    : alertType === "check_in"
    ? "Check-in Request"
    : "Suspicious Activity";

  const alertColor = alertType === "emergency" ? "#dc2626" : "#f59e0b";

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto;">
    <tr>
      <td style="padding: 20px;">
        <!-- Header -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td style="background-color: ${alertColor}; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: white; font-size: 28px; font-weight: bold;">
                ${alertTypeLabel} SOS ALERT
              </h1>
            </td>
          </tr>
        </table>

        <!-- Content -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <p style="font-size: 18px; color: #1f2937; margin: 0 0 20px 0;">
                <strong>${userName}</strong> has triggered an emergency alert on She-Safe-Nomad.
              </p>

              ${notes ? `
              <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0;">
                <p style="margin: 0; color: #92400e; font-weight: 600;">Message from ${userName}:</p>
                <p style="margin: 10px 0 0 0; color: #78350f;">${notes}</p>
              </div>
              ` : ""}

              ${latitude && longitude ? `
              <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">
                  <strong>Location Coordinates:</strong>
                </p>
                <p style="margin: 0; color: #1f2937; font-size: 16px;">
                  ${latitude.toFixed(6)}, ${longitude.toFixed(6)}
                </p>
              </div>
              ` : ""}

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="${mapLink}"
                       style="display: inline-block; background-color: ${alertColor}; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                      View Location on Map
                    </a>
                  </td>
                </tr>
              </table>

              <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 20px;">
                <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 16px;">What to do:</h3>
                <ol style="margin: 0; padding-left: 20px; color: #4b5563; line-height: 1.8;">
                  <li>Try to contact ${userName} immediately by phone</li>
                  <li>If you cannot reach them, consider contacting local authorities</li>
                  <li>Check the location on the map above</li>
                  <li>If this is a false alarm, ${userName} can resolve the alert in the app</li>
                </ol>
              </div>

              <div style="background-color: #fee2e2; border-radius: 8px; padding: 15px; margin-top: 20px;">
                <p style="margin: 0; color: #991b1b; font-size: 14px;">
                  <strong>Emergency Numbers:</strong><br>
                  USA: 911 | UK: 999 | EU: 112 | Australia: 000
                </p>
              </div>
            </td>
          </tr>
        </table>

        <!-- Footer -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td style="padding: 20px; text-align: center;">
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                This is an automated emergency alert from She-Safe-Nomad.<br>
                Please take this alert seriously and respond accordingly.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}
