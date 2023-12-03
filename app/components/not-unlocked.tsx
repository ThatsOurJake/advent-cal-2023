import Link from "next/link";

const NotUnlocked = () => {
  return (
    <div className="text-center">
      <p className="text-2xl py-2 font-bold">Slow down 🐌</p>
      <p className="text-xl py-2 font-bold">This day is not unlocked yet!</p>
      <Link href="/" className="text-blue-500 hover:underline">Take me home!</Link>
    </div>
  )
};

export default NotUnlocked;
