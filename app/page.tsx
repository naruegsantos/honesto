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
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

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
  place?:string
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
    desc:'Brigada no ato pela democracia',
    place:'Centro',
    sold:12,
    donation:3
  },
  {
    id:2,
    editionId:2,
    date:'2026-10-18',
    desc:'Panfletagem',
    place:'Costeira',
    sold:2,
    donation:4
  },
  {
    id:3,
    editionId:2,
    date:'2026-10-18',
    desc:'Brigada no ato pela democracia',
    place:'Centro',
    sold:12,
    donation:3
  },
  {
    id:4,
    editionId:2,
    date:'2026-10-18',
    desc:'Panfletagem',
    place:'Costeira',
    sold:2,
    donation:4
  },
  
]





export default function Home() {
  const [edition, setEdition] = useState<IEdition | null>(editions.findLast((i) => i == i) || null)
  
  //  editionResume tem que vir do BFF junto com os dados da edição
  interface IEditionResume {
    sold: {
      value:number
      percent:number
    },
    totalRaised: number
    donationValue:number
    compliance:number
  }
  
  const soldValue = activities.filter((i) => i.editionId == edition?.id).reduce((total, i) => total + i.sold, 0);
  const soldPercent = +((soldValue * 100) / (edition ? edition.totalAmount : 1)).toFixed(0);
  const donationValue = activities.filter((i) => i.editionId == edition?.id).reduce((total, i) => total + i.donation, 0);
  const totalRaised = soldValue * 3 + donationValue;
  const compliance = edition ? +((totalRaised * 100) / (edition.totalAmount * 3)).toFixed(0) : 0

  const editionResume: IEditionResume = {
    sold: {
      value: soldValue,
      percent: soldPercent,
    },
    totalRaised: totalRaised,
    donationValue: donationValue,
    compliance: compliance,
  };

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
  

  

  return (
    edition ?
    <>
      <header className="fixed md:static bottom-0 h-12 w-screen px-2 md:px-4 bg-[#FF0000] text-white flex justify-between items-center">

        {/* edition selector */}
        <ArrowBigLeft onClick={() => editionNavigation('prev')} className="w-fit cursor-pointer" size={'30'}/>
        <div className="text-black flex justify-center font-bold bg-white rounded-2xl px-5 w-fit min-w-60 md:min-w-64">
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
      <main className="p-4 md:p-6">
        <section className="flex justify-between">
          <h2 className="text-2xl px-8 py-2 font-semibold bg-gray-300 w-fit ">Resumo</h2>
          <div>filtro</div>
        </section>
        <section className="flex flex-col md:flex-row justify-between gap-8 md:gap-6 divide-gray-300 md:divide-x-2 my-10">
          <section className="w-full md:w-1/2 flex flex-col gap-1">
            <div className="text-xl md:text-3xl gap-4 md:gap-2 w-full  flex">
              <div className="flex w-full gap-2 items-center">
                Recebidos 
                <span className="px-4  py-2  bg-gray-300 w-fit">{edition?.totalAmount}</span>
              </div>
              <div className="flex w-full gap-2 items-center">
                Sobras 
                <span className="  px-4  py-2 bg-gray-300 w-fit">{edition? edition.totalAmount - editionResume.sold.value : 0}</span>
              </div>
            </div>
            <div className="text-lg md:text-2xl h-10 w-full md:max-w-[45vw] flex items-end gap-2">
              Vendidos
              <span className={clsx(
                editionResume.sold.percent <= 10 ? 'bg-red-300' : 
                editionResume.sold.percent <= 80 && editionResume.sold.percent > 10  ? 'bg-yellow-300' : 
                'bg-green-300', `px-2 w-fit`)}>
                  {editionResume.sold.value}
              </span>
              <div className="h-full w-full md:max-w-[30vw] flex flex-col justify-end">
                <span className="text-sm">{editionResume.sold.percent}%</span>
                <div className="w-full h-3 bg-gray-300 ">
                  <div className={clsx(
                    editionResume.sold.percent <= 10 ? 'bg-red-500' : 
                    editionResume.sold.percent <= 80 && editionResume.sold.percent > 10  ? 'bg-yellow-300' : 
                    'bg-green-300'  ,` h-full trasition-[width] duration-150`)}
                    style={{
                      width:`${editionResume.sold.percent}%`
                    }}></div>
                </div>
              </div>
            </div>
          </section>
          <section className="w-full md:w-1/2 flex flex-col gap-2">
            <div className="text-xl md:text-3xl w-fit flex  items-center">
              <div className="flex gap-2 items-center">
                Total arrecadado 
                <span className="px-4 py-2 bg-gray-300 w-fit">{toBRL(editionResume.totalRaised)}</span>
              </div>
            </div>
            <div className="text-lg md:text-2xl h-10 w-full  md:max-w-[45vw] flex items-end gap-2">
              Adimplência 
              <span className={clsx(
                editionResume.compliance <= 10 ? 'bg-red-300' :
                editionResume.compliance <= 80 && editionResume.compliance> 10  ? 'bg-yellow-300' : 
                'bg-green-300' ,
                ` px-2 w-fit`)}>
                  {editionResume.compliance}%
              </span>
              <div className="h-full w-full md:max-w-[30vw] flex flex-col justify-end">
                <span className="text-sm">{toBRL(editionResume.totalRaised)}/{toBRL(edition.totalAmount * 3)}</span>
                <div className="w-full h-3 bg-gray-300 ">
                  <div className={clsx(
                    editionResume.compliance <= 10 ? 'bg-red-500' : 
                    editionResume.compliance <= 80 && editionResume.compliance> 10  ? 'bg-yellow-300' : 
                    'bg-green-300' ,'h-full trasition-[width] duration-150')}
                    style={{
                      width:`${editionResume.compliance}%`
                    }}></div>
                </div>
              </div>
              {/* <Progress value={sold*100/(edition? edition.totalAmount : 1)} className="w-full max-w-sm">
                <ProgressValue />
              </Progress> */}
            </div>
          </section>
        </section>
        <section className="flex justify-between">
          {/* tabela */}
          <Table className="w-[47%]">
            <TableHeader>
              <TableRow>
                <TableHead className="">Data</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Local</TableHead>
                <TableHead className="">Jornais vendidos</TableHead>
                <TableHead className="">Doações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="">
              {activities.filter((i) => i.editionId == edition?.id).map((i) => (
                <TableRow className="odd:bg-gray-200">
                  <TableCell className="font-medium">{new Date(i.date).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>{i.desc}</TableCell>
                  <TableCell>{i.place}</TableCell>
                  <TableCell className="">{i.sold}</TableCell>
                  <TableCell className="">{i.donation}</TableCell>
                </TableRow>
                  
              ))}
            </TableBody>
          </Table>
          {/* gráficos */}
          <div></div>
        </section>
      </main>
    </>
    : <></>
  );
}
