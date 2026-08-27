import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const firstName = String(body.firstName || "").trim();
    const lastName = String(body.lastName || "").trim();
    const email = String(body.email || "").trim();
    const message = String(body.message || "").trim();

    if (!firstName || !lastName || !email || !message) {
      return NextResponse.json(
        { error: "Please complete all fields." },
        { status: 400 }
      );
    }

    const smtpUser = process.env.SMTP_USER;
    const smtpPassword = process.env.SMTP_PASSWORD;

    if (!smtpUser || !smtpPassword) {
      console.error("SMTP credentials are missing.");
      return NextResponse.json(
        { error: "Email service is not configured." },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: smtpUser,
        pass: smtpPassword,
      },
    });

    const subject = `INRASTUDIO Contact — ${firstName} ${lastName}`;

    const emailText = `New message from the INRASTUDIO contact form

FIRST NAME:
${firstName}

LAST NAME:
${lastName}

EMAIL:
${email}

MESSAGE:
${message}

--------------------------------
Sent from the INRASTUDIO contact page.
`;

    await transporter.sendMail({
      from: `"INRASTUDIO Contact" <${smtpUser}>`,
      to: "prospereze12345@gmail.com",
      replyTo: email,
      subject,
      text: emailText,
    });

    return NextResponse.json({
      success: true,
      message: "Message sent successfully.",
    });
  } catch (error) {
    console.error("Contact email error:", error);

    return NextResponse.json(
      { error: "Unable to send your message. Please try again." },
      { status: 500 }
    );
  }
}