import { getEditions } from "./service";

export async function GET() {
  const response = await getEditions()
  const editionsList = await response.json()

  return new Response(editionsList);
}

