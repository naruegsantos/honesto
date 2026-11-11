'use client'

import SelectEdition from "@/app/components/selectEdition";
import { IEdition } from "@/app/page";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { toBRL } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { ReceiptText, Trash } from "lucide-react";
import Image from "next/image";
import { redirect } from "next/navigation";
import { ConfirmationModal } from "@/lib/confirmationModal";
import Link from "next/link";

interface ISale {
  sold: number
  payment: {
    total: number
    pix: number
    cash: number
    edited?: boolean
  }
  edition: string
  donation?: number
  paymentFormat: 'pix' | 'mixed' | 'cash'
}






export default function Page() {
  const [editions, setEditions] = useState<IEdition[] | null>()
  const [sales, setSales] = useState<ISale[]>([])

  // const [sales, setSales] = useState<ISale[]>([
  //   { sold: 14, payment: { total: 45, pix: 45, cash: 0 }, edition: '347', paymentFormat: "pix" },
  //   { sold: 9, payment: { total: 27, pix: 0, cash: 27 }, edition: '347', paymentFormat: "cash" },
  //   { sold: 20, payment: { total: 66, pix: 42, cash: 24 }, edition: '347', paymentFormat: "mixed" },
  //   { sold: 5, payment: { total: 18, pix: 18, cash: 0 }, edition: '347', paymentFormat: "pix" },
  //   { sold: 12, payment: { total: 39, pix: 0, cash: 39 }, edition: '347', paymentFormat: "cash" },
  // ])
  
  const [currentEdition, setCurrentEdition] = useState<string>("")

  const emptyForm:ISale = {
      sold: 0, 
      payment: { total: 0, pix: 0, cash: 0, edited:false }, 
      edition: currentEdition, 
      paymentFormat: "pix",
      donation:0
    }
  const [saleForm, setSaleForm] = useState<ISale>(emptyForm)

  function calcPaymentBySold(sold:number) {
    const paymentData = saleForm.payment.edited?
    saleForm.payment 
      : {
        total: sold*3,
        pix: saleForm.paymentFormat == 'pix' ? sold*3 : 0,
        cash:saleForm.paymentFormat == 'cash' ? sold*3 : 0
      }
    return paymentData
  }

  function  addSale(){
    const saleTotalValue = saleForm.payment.cash + saleForm.payment.pix
    const updatedSales = [...sales, {...saleForm, 
      donation:saleTotalValue - saleForm.sold*3, 
      payment: {...saleForm.payment, 
        total:saleTotalValue
      }
    }]
    setSales(updatedSales);
    localStorage.setItem('sales', JSON.stringify(updatedSales))
    setSaleForm(
      { sold: 0, payment: { total: 0, pix: 0, cash: 0 }, edition: currentEdition, paymentFormat: "pix", donation:0 }
    )
  }
  useEffect(() => {
    const fetchEditions = async () => {
      const apiUrl = process.env.DEV_ENV ? "http://localhost:3000/editions" : `${process.env.NEXT_PUBLIC_API_URL}/editions`
      const response = await fetch(apiUrl);
      const editionsList = await response.json()
      
      let lastEdition =[...editionsList].findLast((i) => i == i )?.number ?? ""
      let localSales = JSON.parse(localStorage.getItem('sales') ?? "") || null
      
      localSales ? setSales(localSales) : localStorage.setItem('sales', JSON.stringify(sales))

      setEditions([...editionsList])      
      setCurrentEdition(lastEdition)

      
      setSaleForm({...saleForm, edition:lastEdition})
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
    };

    fetchEditions();
  }, []);


  return (
    <>
      <div className="bg-accent" >
        <Link href={'/'}>
          <Image className="" height={50} width={50} src={'/averdade.svg'} alt="icone jornal a verdade"/>
        </Link>
      </div>
      <div className="bg-accent p-3 flex flex-col gap-4 place-items-center">
        <div className="flex justify-center">
          <div className="text-black flex justify-center font-bold bg-white rounded-2xl px-5 w-fit min-w-60 md:min-w-64">
            <SelectEdition onChange={(value) => setCurrentEdition(value)}  edition={currentEdition} items={ editions? editions.map((i) => ({label:`Edição ${i.number} - ${i.name} - ${new Date(i.startDate).getFullYear()}`, value:i.number})) : []} />
          </div>
        </div>
        <div className="bg-white p-2 rounded-sm flex flex-col gap-2 w-full max-w-3xl">
          <div className="flex gap-3 justify-between place-items-center">
            <label className="flex-none text-lg" htmlFor="sold">Jornais Vendidos</label>
            <input inputMode="numeric" value={saleForm.sold} onChange={(e) => {
              const value = +e.target.value.replace(/[^0-9]/g, '')
              setSaleForm({...saleForm, sold:value, payment:calcPaymentBySold(value)})
              
            }} className="rounded-sm pl-4 w-1/2 bg-gray-300 text-lg p-1" name="sold" type="nmber" />
          </div>
          <div>
            <span className="text-lg">Forma de pagamento</span>
            <div className="flex justify-evenly">
              <div className="flex gap-2 ">
                <input checked={saleForm.paymentFormat=="pix"} value={"pix"} onChange={() => {setSaleForm({...saleForm, paymentFormat:'pix', payment:{...saleForm.payment, pix:saleForm.sold? saleForm.sold*3 : saleForm.payment.cash, cash:0}})}} id="sold" type="radio"/>
                <label htmlFor="sold">Pix</label>
              </div>
              <div className="flex gap-2 ">
                <input checked={saleForm.paymentFormat=="cash"} value={"cash"} onChange={() => {setSaleForm({...saleForm, paymentFormat:'cash', payment:{...saleForm.payment, cash:saleForm.sold? saleForm.sold*3 : saleForm.payment.pix, pix:0}})}} id="cash" type="radio" />
                <label htmlFor="cash">Dinheiro</label>
              </div>
              <div className="flex gap-2 ">
                <input checked={saleForm.paymentFormat=="mixed"} value={"mixed"} onChange={() => setSaleForm({...saleForm, paymentFormat:'mixed'})} id="mixed" type="radio" />
                <label htmlFor="mix">mixed</label>
              </div>
            </div>
          </div>
          {saleForm.paymentFormat == 'mixed' ?
            <div className="flex flex-col gap-1 justify-between">
              <div className="flex gap-2 justify-between place-items-center">
                <label className="flex-none text-lg" htmlFor="sold">No pix</label>
                <input  value={toBRL(saleForm.payment.pix)} onChange={(e) => {
                  const value = +e.target.value.replace(/\D/g, '')/100
                  setSaleForm({...saleForm, payment: {...saleForm.payment, pix: value, edited:true}})

                }} className="rounded-sm   w-1/2 bg-gray-300 text-lg p-1" name="sold" type="text" />
              </div>
              <div className="flex gap-2 justify-between place-items-center">
                <label className="flex-none text-lg" htmlFor="sold">Em dinheiro</label>
                <input  value={toBRL(saleForm.payment.cash)} onChange={(e) => {
                  const value = +e.target.value.replace(/\D/g, '')/100
                  
                  setSaleForm({...saleForm, payment: {...saleForm.payment, cash: value, edited:true}, donation:saleForm.payment.total })
                }} className="rounded-sm  flex-none w-1/2 bg-gray-300 text-lg p-1" name="sold" type="text" />
              </div>
            </div>
          :
          <div className="flex gap-3 justify-between place-items-center">
            <label className="flex-none text-lg" htmlFor="sold">Pagamento</label>
            <input  value={toBRL(saleForm.payment[`${saleForm.paymentFormat}`])} onChange={(e) => {
              const value = +e.target.value.replace(/\D/g, '')/100
              const paymentData = {
                total: value,
                pix: saleForm.paymentFormat == 'pix' ? value : 0,
                cash:saleForm.paymentFormat == 'cash' ? value : 0,
                edited: true
              }
              setSaleForm({...saleForm, payment:paymentData,})
            }} className="rounded-sm pl-2 flex-none w-1/2 bg-gray-300 text-lg p-1" name="sold" type="text" />
          </div>
          }
          <hr className=""/>
          <div className="flex flex-col place-items-center gap-4">
            <div className="text-black flex  justify-center font-bold border rounded-2xl px-5 w-fit min-w-60 md:min-w-64">
              <SelectEdition onChange={(value) => setSaleForm({...saleForm, edition:value})}  edition={saleForm.edition} items={ editions? editions.map((i) => ({label:`Edição ${i.number} - ${i.name} - ${new Date(i.startDate).getFullYear()}`, value:i.number})) : []} />
            </div>
            
              <div className="w-full flex justify-end gap-2">
                <Button onClick={() => setSaleForm(emptyForm)} variant={"outline"}>limpar</Button>
                <Button onClick={() => addSale()} variant={"default"}>confirmar</Button>
              </div>
          </div>
          
        </div>
      </div>

      {!sales.length ?
        <div className="p-3 h-screen">
          <div className="size-full bg-muted text-lg font-bold text-center text-muted-foreground p-3">
            <p className="text-xl">Sem vendas ainda!</p>
            <article>
              "Para Lênin, a teoria não era um dogma, mas um guia para a ação."
            </article>
          </div>
        </div>
      :
        <div>
          <Table className="">
            <TableHeader>
              <TableRow>
                <TableHead className="">JAV's</TableHead>
                <TableHead>Pagamento</TableHead>
                <TableHead className="">Contribuição</TableHead>
                <TableHead>Edição</TableHead>
                <TableHead className="">Formato</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="">
              {sales.map((i, index) => (
                <TableRow key={index} className="odd:bg-gray-200">
                  <TableCell align="center" className="font-medium">{i.sold}</TableCell>
                  <TableCell align="center">{toBRL(i.payment.total)}</TableCell>
                  <TableCell align="center">{toBRL(i.donation??0)}</TableCell>
                  <TableCell align="center" className="">{i.edition}</TableCell>
                  <TableCell className="">{i.paymentFormat}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      }
      <ConfirmationModal title="Limpar todos os items?" description="Depois de limpo, não há como recuperar" action={() => {setSales([]); localStorage.setItem('sales', JSON.stringify([]))}}>
        <div className="p-1 bg-black text-bold rounded-sm fixed bottom-14 right-5 w-fit text-white">
          <Trash className=""/>
        </div>
      </ConfirmationModal>
      





      <Drawer showSwipeHandle>
        <DrawerTrigger>
          <div className="p-1 bg-black text-bold rounded-sm fixed bottom-5 right-5 w-fit text-white">
            <ReceiptText className=""/>
          </div>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Informe</DrawerTitle>
            <DrawerDescription>Informe completo baseado nas informações passadas</DrawerDescription>
          </DrawerHeader>
            <div className="flex-1 p-4">
              <div className="size-full rounded-2xl border p-2">
                <div className="flex flex-wrap md:justify-evenly gap-4">
                  <div>
                    <h1 className="text-2xl font-bold">
                      Jornais vendidos: 
                      <span className="py-1 px-4 rounded-sm border">
                        {sales.reduce((sold, i) => sold + i.sold, 0)}
                      </span>
                    </h1>
                    <p>Edições:</p>
                    <ul className="list-disc pl-4">
                      { [...new Set(sales.map((i) => i.edition))].map((edition) => (
                        <li>{edition}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">
                      Contribuição: 
                      <span className="py-1 px-4 rounded-sm border">
                        {toBRL(sales.reduce((donation, i) => i.donation??0 + donation, 0))}
                      </span>
                    </h1>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold">
                      Valor arrecadado: 
                      <span className="py-1 px-4 rounded-sm bg-muted">
                        {toBRL(sales.reduce((value, i) => value + i.payment.total, 0))}
                      </span>
                    </h1>
                    <ul className="list-disc pl-4">
                      <li>
                        Pix: {toBRL(sales.reduce((value, i) => value + i.payment.pix, 0))}
                      </li>
                      <li>
                        Dinheiro: {toBRL(sales.reduce((value, i) => value + i.payment.cash, 0))}
                      </li>
                    </ul>
                  </div>                         
                </div>


              </div>
            </div>
          <DrawerFooter>
            <DrawerClose render={<Button>Close</Button>} />
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}