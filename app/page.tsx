'use client'

import { ArrowBigLeft, ArrowBigRight } from "lucide-react";
import Image from "next/image";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress"

import { useState } from "react";
import { clsx } from "cn";

interface IEdition {
  id: number,
  name: string,
  number: string,
  startDate: string,
  endDate: string,
  totalAmount: number,
  individualAmount: number,
  activity_amount: number,
}

interface IActivity {
  id:number
  editionId:number 
  date:string
  desc:string
  sold: number
  donation: number
}

const editions = [
  {
    id: 1,
    name: 'Outubro 1',
    number: '342',
    startDate: '2026-10-01',
    endDate: '2026-10-15',
    totalAmount: 150,
    individualAmount: 50,
    activity_amount: 100,
  },
  {
    id: 2,
    name: 'Outubro 2',
    number: '343',
    startDate: '2026-10-16',
    endDate: '2026-10-31',
    totalAmount: 172,
    individualAmount: 41,
    activity_amount: 172,
  },
 
]

const activities:IActivity[] = [
  {
    id:1,
    editionId:2,
    date:'2026-10-18',
    desc:'Brigada',
    sold:12,
    donation:3
  },
  {
    id:2,
    editionId:2,
    date:'2026-10-18',
    desc:'Panfletagem',
    sold:2,
    donation:4
  },
  
]





export default function Home() {
  const [edition, setEdition] = useState<IEdition | null>(editions[0])
  const sold = activities.filter((i) => i.editionId == edition?.id).reduce((total, i) => total + i.sold, 0)

  function editionNavigation(direction:string) {
    const currentedition = editions.find((i) => i.number == edition?.number)
    let next
    if(currentedition) {
      next = editions[editions.indexOf(currentedition) + (direction == 'next'? 1 : -1) ]
    } else {
      console.log(`edição nula ${currentedition}`, )
    }

    next ? setEdition(next) : console.log('última edição')
    console.log(next);
  }

  function selectEdition(value:any) {
    console.log(value == '338');
    
    const selected = editions.find((i) => i.number == value)
    console.log(selected);
    
    setEdition(selected || null)
  }

  const toBRL = (value:number):string => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
      value,
    ) 

  function totalRaised() {
    return sold*3 + (activities.filter((i) => i.editionId == edition?.id).reduce((total, i) => total + i.donation, 0)) 
  }

  return (
    edition ?
    <>
      <header className="h-12 px-4 bg-[#FF0000] text-white flex justify-between items-center">

        {/* edition selector */}
        <ArrowBigLeft onClick={() => editionNavigation('prev')} className="w-fit cursor-pointer" size={'30'}/>
        <div className="text-black flex justify-center font-bold bg-white rounded-2xl px-5 w-fit min-w-64">
          <Select value={edition?.number} onValueChange={(value) => selectEdition(value)} items={editions.map((i) => ({label:`Edição ${i.number} - ${i.name} - ${new Date(i.startDate).getUTCFullYear()}`, value:i.number}))}>
            <SelectTrigger className="border-none w-fit">
              <SelectValue placeholder='Selecione a edição' />
            </SelectTrigger>
            <SelectContent className={"w-fit"}>
              <SelectGroup>
                <SelectLabel>Selecione</SelectLabel>
                  {editions.map((i) => (
                    <SelectItem key={i.id} value={i.number}>
                      {i.number} - {i.name} - {new Date(i.startDate).getUTCFullYear()}
                    </SelectItem>
                  ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <ArrowBigRight  onClick={() => editionNavigation('next')} className="w-fit cursor-pointer" size={'30'}/>
      </header>

      {/* resumo */}
      <main className="p-6">
        <section className="flex justify-between  outline">
          <h2 className="text-2xl px-8 py-2 font-semibold bg-gray-300 w-fit ">Resumo</h2>
          <div>filtro</div>
        </section>
        <section className="outline flex justify-evenly divide-gray-300 divide-x-2">
          <section className="my-10 w-[47%] flex flex-col gap-2">
            <div className="text-3xl w-fit flex gap-20 items-center">
              <div className="flex gap-2 items-center">
                Recebidos 
                <span className="text-3xl px-4  py-2  bg-gray-300 w-fit">{edition?.totalAmount}</span>
              </div>
              <div className="flex gap-2 items-center">
                Sobras 
                <span className="text-3xl px-4  py-2 bg-gray-300 w-fit">{edition? edition.totalAmount - sold : 0}</span>
              </div>
            </div>
            <div className="text-2xl h-10 w-full max-w-[45vw] flex items-end gap-2">
              Vendidos <span className="text-2xl px-2  bg-yellow-300 w-fit">{sold}</span>
              <div className="h-full w-full max-w-[30vw] flex flex-col justify-end">
                <span className="text-sm">{(sold*100/(edition? edition.totalAmount : 1)).toFixed(0)}%</span>
                <div className="w-full h-3 bg-gray-300 ">
                  <div className={clsx(`w-[${(sold*100/(edition? edition.totalAmount : 1)).toFixed(0)}%] h-full bg-yellow-300`)}></div>
                </div>
              </div>
              {/* <Progress value={sold*100/(edition? edition.totalAmount : 1)} className="w-full max-w-sm">
                <ProgressValue />
              </Progress> */}
            </div>
          </section>
          <section className="my-10 w-[47%] flex flex-col gap-2">
            <div className="text-3xl w-fit flex gap-20 items-center">
              <div className="flex gap-2 items-center">
                Total arrecadado 
                <span className="text-3xl px-4 py-2 bg-gray-300 w-fit">{toBRL(totalRaised())}</span>
              </div>
            </div>
            <div className="text-2xl h-10 w-full max-w-[45vw] flex items-end gap-2">
              Adimplência <span className="text-2xl px-2  bg-yellow-300 w-fit">{sold}</span>
              <div className="h-full w-full max-w-[30vw] flex flex-col justify-end">
                <span className="text-sm">{(totalRaised()*100/(edition.totalAmount*3)).toFixed(0)}%</span>
                <div className="w-full h-3 bg-gray-300 ">
                  <div className={clsx(`w-[${(totalRaised()*100/(edition.totalAmount*3)).toFixed(0)}%] h-full bg-yellow-300`)}></div>
                </div>
              </div>
              {/* <Progress value={sold*100/(edition? edition.totalAmount : 1)} className="w-full max-w-sm">
                <ProgressValue />
              </Progress> */}
            </div>
          </section>
        </section>
      </main>
      <section>
        {/* tabela */}
        <div></div>

        {/* gráficos */}
        <div></div>
      </section>
    </>
    : <></>
  );
}
