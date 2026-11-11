'server only'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function getEditions() {
  // For example, fetch data from your DB here
  'use cache'
  const apiUrl = `${API_URL}/editions`
  const response = await fetch(apiUrl);
  const editionsList = await response.json()
  

  
  if (!response.ok) {
    throw new Error(`Erro HTTP: ${response.status}`);
  }

  return editionsList
}