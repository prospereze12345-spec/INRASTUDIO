import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const firstName = String(body.firstName || "").trim();
    const lastName = String(body.lastName || "").trim();
    const email = String(body.email || "").trim();
    const message = String(body.message || "").trim();

    if (!firstName || !lastName || !email || !message) {
      return NextResponse.json(
        {
          success: false,
          error: "Please complete all fields.",
        },
        { status: 400 }
      );
    }

    const backendUrl =
      process.env.BACKEND_URL ||
      process.env.NEXT_PUBLIC_API_URL;

    if (!backendUrl) {
      console.error("Backend URL is not configured.");

      return NextResponse.json(
        {
          success: false,
          error: "Contact service is not configured.",
        },
        { status: 500 }
      );
    }

    const response = await fetch(
      `${backendUrl.replace(/\/$/, "")}/api/auth/contact/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          name: `${firstName} ${lastName}`,
          email,
          subject: `INRASTUDIO Contact — ${firstName} ${lastName}`,
          message,
        }),
        cache: "no-store",
      }
    );

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      console.error("Backend contact error:", data);

      return NextResponse.json(
        {
          success: false,
          error:
            data?.message ||
            data?.error ||
            "Unable to send your message. Please try again.",
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: data?.message || "Message sent successfully.",
    });
  } catch (error) {
    console.error("Contact API error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to send your message. Please try again.",
      },
      { status: 500 }
    );
  }
}