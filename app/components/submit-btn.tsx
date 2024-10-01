import { useFormStatus } from "react-dom";
import Btn from "./btn";

interface SubmitBtnProps {
  text: string;
  textSubmitting?: string;
}

const SubmitBtn = ({ text, textSubmitting }: SubmitBtnProps) => {
  const { pending } = useFormStatus()

  const submittingText = textSubmitting || text;

  return (
    <Btn type="submit" disabled={pending} aria-disabled={pending} className="w-1/2">
      {
        pending && submittingText
      }
      {
        !pending && text
      }
    </Btn>
  )
};

export default SubmitBtn;
