import { getEditions } from "./service";

export async function GET() {
  const response = await getEditions()


  return new Response(JSON.stringify(response), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}