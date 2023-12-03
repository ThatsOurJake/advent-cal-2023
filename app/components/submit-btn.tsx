import { useFormStatus } from "react-dom";

interface SubmitBtnProps {
  text: string;
  textSubmitting?: string;
}

const SubmitBtn = ({ text, textSubmitting }: SubmitBtnProps) => {
  const { pending } = useFormStatus()

  const submittingText = textSubmitting || text;

  return (
    <button type="submit" className="bg-purple-400 py-1 hover:underline rounded-md w-1/2" disabled={pending} aria-disabled={pending}>
      {
        pending && submittingText
      }
      {
        !pending && text
      }
    </button>
  )
};

export default SubmitBtn;
