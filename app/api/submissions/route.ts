import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const source = typeof body.source === "string" ? body.source : undefined;
    
    // We expect body to contain fullName, phone, email, instagram, goals, referrer
    const { fullName, phone, email, instagram, goals, referrer } = body;

    // Function to send to Discord
    const sendToDiscord = async () => {
      const webhookUrl = source === "creatorvision"
        ? process.env.DISCORD_WEBHOOK_URL_CREATORVISION
        : source === "bamboocreator"
        ? process.env.DISCORD_WEBHOOK_URL_BAMBOOCREATOR
        : process.env.DISCORD_WEBHOOK_URL;

      if (!webhookUrl) {
        console.warn("Discord webhook URL not set for source:", source);
        return;
      }

      const embed = {
        title: "New Form Submission",
        color: source === "creatorvision" ? 0x3b82f6 : source === "bamboocreator" ? 0x10b981 : 0x8E31E3,
        fields: [
          { name: "Full Name", value: fullName || "N/A", inline: true },
          { name: "Phone", value: phone || "N/A", inline: true },
          { name: "Email", value: email || "N/A", inline: true },
          { name: "Instagram", value: instagram || "N/A", inline: true },
          { name: "Goals", value: goals || "N/A" },
          { name: "Referrer", value: referrer || "direct" },
        ],
        timestamp: new Date().toISOString(),
      };

      try {
        const response = await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ embeds: [embed] }),
        });
        if (!response.ok) {
          console.error("Discord webhook failed:", response.status, await response.text());
        }
      } catch (err) {
        console.error("Discord webhook error:", err);
      }
    };

    // Function to send to Google Sheets
    const sendToGoogleSheets = async () => {
      const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_BAMBOOCREATOR;
      if (!webhookUrl) {
        console.warn("GOOGLE_SHEETS_WEBHOOK_BAMBOOCREATOR not set, skipping");
        return;
      }

      try {
        const response = await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullName,
            phone,
            email,
            instagram,
            goals,
            referrer: referrer || "direct",
          }),
        });
        if (!response.ok) {
          console.error("Google Sheets webhook failed:", response.status, await response.text());
        }
      } catch (err) {
        console.error("Google Sheets webhook error:", err);
      }
    };

    // Execute webhooks without blocking the response
    const promises = [sendToDiscord()];
    if (source === "bamboocreator") {
      promises.push(sendToGoogleSheets());
    }

    // Wait for them concurrently
    await Promise.allSettled(promises);

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error: any) {
    console.error("API Submission error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
