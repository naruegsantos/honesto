import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ReactNode } from "react"

export function ConfirmationModal({children, title, description, action}:{
  children:ReactNode,
  title?:string,
  description:string,
  action: () => void
} ) {
  return (
    <Dialog>
      <DialogTrigger>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="flex flex-row justify-end ">
          <DialogClose className={'w-fit'} render={<Button variant="default">Cancelar</Button>} />
          <DialogClose onClick={() => action()} className={'w-fit'} render={<Button variant="destructive">Confirmar</Button>} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
