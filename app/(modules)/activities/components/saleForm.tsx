import SelectEdition from "@/app/components/selectEdition"
import { toBRL } from "@/lib/utils"
import { Button } from "@base-ui/react"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { ISale } from "../page"

export default function SaleForm({currentEdition, sales, setSales}:{
  currentEdition:string
  sales: ISale[]
  setSales:Dispatch<SetStateAction<ISale[]>>
}) {
  const emptyForm:ISale = {
      sold: 0, 
      payment: { total: 0, pix: 0, cash: 0, edited:false }, 
      edition: currentEdition, 
      paymentFormat: "pix",
      donation:0
  }
  const [saleForm, setSaleForm] = useState<ISale>(emptyForm)

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
  
  return(
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
  )

}