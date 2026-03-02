export const handler = async (event) => {
    if (event.httpMethod !== 'POST') return { statusCode: 405 };

    const { customerEmail, customerName, items, totalCents } = JSON.parse(event.body ?? '{}');
    if (!customerEmail || !items?.length) {
        return { statusCode: 400, body: JSON.stringify({ error: 'Missing required fields' }) };
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
        // Silently skip — email not configured yet
        return { statusCode: 200, body: JSON.stringify({ skipped: true }) };
    }

    const fmt = (cents) => `$${(cents / 100).toFixed(2)}`;

    const itemRows = items
        .map(i => `
            <tr>
                <td style="padding:8px 0;border-bottom:1px dashed #e5d5b0;color:#1a110d;font-size:14px;">${i.qty}× ${i.name}</td>
                <td style="padding:8px 0;border-bottom:1px dashed #e5d5b0;color:#c05621;font-size:14px;text-align:right;font-weight:bold;">${fmt(i.priceCents * i.qty)}</td>
            </tr>`)
        .join('');

    const html = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#f4ebd0;font-family:'Georgia',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4ebd0;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:#1a110d;padding:28px 32px;border-bottom:4px solid #c05621;border-radius:12px 12px 0 0;">
            <p style="margin:0;color:#c05621;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;font-family:Arial,sans-serif;">The Wich Doc · Parksville, BC</p>
            <h1 style="margin:8px 0 0;color:#f4ebd0;font-size:26px;letter-spacing:-0.02em;">Order Confirmed ✦</h1>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="background:#ffffff;padding:32px;border-left:4px solid #1a110d;border-right:4px solid #1a110d;">
            <p style="margin:0 0 20px;color:#1a110d;font-size:15px;">Hi ${customerName},</p>
            <p style="margin:0 0 24px;color:#1a110d;font-size:15px;line-height:1.6;">
              Your prescription has been filled. We'll have your order ready for pickup — we'll reach out if we need anything.
            </p>

            <!-- Order Summary -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
              <tr>
                <td colspan="2" style="padding-bottom:8px;">
                  <p style="margin:0;color:#1a110d;font-size:10px;letter-spacing:0.15em;text-transform:uppercase;font-family:Arial,sans-serif;font-weight:bold;">Order Summary</p>
                </td>
              </tr>
              ${itemRows}
              <tr>
                <td style="padding:12px 0 0;font-weight:bold;color:#1a110d;font-size:15px;">Total</td>
                <td style="padding:12px 0 0;font-weight:bold;color:#c05621;font-size:18px;text-align:right;">${fmt(totalCents)}</td>
              </tr>
            </table>

            <div style="background:#f4ebd0;border:2px dashed #1a110d20;border-radius:8px;padding:16px;margin-bottom:24px;">
              <p style="margin:0 0 4px;font-size:10px;color:#1a110d;letter-spacing:0.15em;text-transform:uppercase;font-family:Arial,sans-serif;font-weight:bold;">Pickup Info</p>
              <p style="margin:0;font-size:14px;color:#1a110d;line-height:1.6;">
                Parksville, BC · Wed – Sat, 11am – 3pm<br/>
                <a href="tel:672-922-0970" style="color:#c05621;text-decoration:none;">672-922-0970</a>
              </p>
            </div>

            <p style="margin:0;font-size:13px;color:#1a110d80;line-height:1.5;">
              Questions? Reply to this email or reach us at
              <a href="mailto:chef@wichdocbakeshop.ca" style="color:#c05621;text-decoration:none;">chef@wichdocbakeshop.ca</a>
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#1a110d;padding:20px 32px;border-radius:0 0 12px 12px;border-top:4px solid #152238;">
            <p style="margin:0;color:#f4ebd080;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;font-family:Arial,sans-serif;text-align:center;">
              The Wich Doc · wichdocbakeshop.ca · Est. 2026
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

    const resp = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            from: 'The Wich Doc <orders@wichdocbakeshop.ca>',
            to: [customerEmail],
            subject: `Your Wich Doc order is confirmed ✦`,
            html,
        }),
    });

    if (!resp.ok) {
        const err = await resp.json();
        return { statusCode: 502, body: JSON.stringify({ error: err.message ?? 'Email send failed' }) };
    }

    return { statusCode: 200, body: JSON.stringify({ sent: true }) };
};
