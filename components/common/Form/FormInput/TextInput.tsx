import { PhoneInput } from "react-international-phone";
import { FormInput } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import "react-international-phone/style.css";

type TextInputProps = {
  value: string;
  onChange: (...event: any[]) => void;
  input: FormInput;
};

export default function TextInput({ input, value, onChange }: TextInputProps) {
  return input.type === "textarea" ? (
    <Textarea value={value} onChange={onChange} disabled={input.disabled} />
  ) : input.type === "phone" ? (
    <PhoneInput
      defaultCountry="us"
      value={value}
      onChange={onChange}
      disabled={input.disabled}
    />
  ) : (
    <Input
      value={value}
      onChange={onChange}
      type={input.type}
      placeholder={input.placeholder}
      disabled={input.disabled}
      autoComplete={input.type === "password" ? input.name : "off"}
    />
  );
}
