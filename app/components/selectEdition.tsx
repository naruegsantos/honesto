import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ISelectEditionProps {
  edition: string
  onChange: (value:string) => void
  items:{
    label: string
    value: any
  }[]
}

export default function SelectEdition({edition, onChange, items}:ISelectEditionProps) {
  console.log("edição: ",edition);
  
  return (
    <Select value={edition ? edition : ""} onValueChange={(value) => value? onChange(value) :{}} items={items}>
      <SelectTrigger className="border-none w-fit">
        <SelectValue placeholder='Selecione a edição' />
      </SelectTrigger>
      <SelectContent className={"w-fit"}>
        <SelectGroup>
          <SelectLabel>Selecione</SelectLabel>
            {items.map((i, index) => (
              <SelectItem key={index} value={i.value}>
                {i.label}
              </SelectItem>
            ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}