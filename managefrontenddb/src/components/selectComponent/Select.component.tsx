import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "../ui/label";

type SelectDemoProps={
    values:string[],
    handleSelectedValue:(value:string)=>void,
    label:string,
    placeholderText:string
} 

const SelectDemo = ({values, handleSelectedValue, label, placeholderText}:SelectDemoProps) => {

    
  return (
    <div>
          <Select 
          onValueChange={(value) => handleSelectedValue(value)} 
            
          >
              <Label>{placeholderText}</Label>
              <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={placeholderText} />
              </SelectTrigger>
              <SelectContent>
                  <SelectGroup>
                      <SelectLabel>{label}</SelectLabel>
                      {
                          values.map(val =>
                              <SelectItem
                                  key={val}
                                  value={val}
                                  className="cursor-pointer"
                                  >{val}</SelectItem>
                          )
                      }
                  </SelectGroup>
              </SelectContent>
          </Select>
    </div>
  );
};

export default SelectDemo;