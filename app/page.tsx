import Link from "next/link";
import EditionPannel from "./components/editionPannel";
import { CircleArrowRight } from "lucide-react";
import { getEditions } from "./api/editions/service";
import { Suspense } from "react";





export default async function Home() {
  const editions = await getEditions()
  console.log(editions);
  

  return (
    editions ?
    <>
    <Suspense fallback={
      <div>
        Carregando...
      </div>
    }>
      <EditionPannel editions={editions}/>
    </Suspense>
      <div className="p-1 bg-black text-bold rounded-sm absolute bottom-5 right-5 w-fit text-white">
        <Link href={'/activities'}>
          <CircleArrowRight className="cursor-pointer"/>    
        </Link>
      </div>
    </>
    : <></>
  );
}
