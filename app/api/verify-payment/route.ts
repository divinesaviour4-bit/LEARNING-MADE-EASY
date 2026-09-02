export async function POST(req: Request) {
  try {
    const { reference, email } = await req.json();
    if (!reference || !email) {
      return Response.json({ error: "Missing reference or email" }, { status: 400 });
    }

    // Verify transaction with Paystack API server-side
    const response = await fetch(https://api.paystack.co/transaction/verify/, {
      method: "GET",
      headers: {
        Authorization: Bearer ,
      },
    });

    const data = await response.json();
    if (data.status && data.data.status === "success") {
      // Generate unique access token code
      const accessToken = "CLH-" + Math.random().toString(36).substring(2, 8).toUpperCase();
      return Response.json({ success: true, accessToken });
    } else {
      return Response.json({ success: false, error: "Payment verification failed" }, { status: 400 });
    }
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}