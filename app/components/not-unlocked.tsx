import Link from "next/link";
import Alert from "./alert";

const NotUnlocked = () => {
  return (
    <Alert type="warning">
      <p className="text-2xl font-bold">Slow down 🐌</p>
      <p className="text-base">This day is not unlocked yet!</p>
      <Link href="/" className="text-blue-500 hover:underline">Take me home!</Link>
    </Alert>
  )
};

export default NotUnlocked;
