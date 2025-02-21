import CommentBoard from "@/components/comment-board";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="fixed inset-0 bg-gradient-to-b from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-950 overflow-hidden">
      <div className="absolute top-4 right-1 z-10 w-96">
        <Link href="/qr-code"> <Button>Qr Code</Button></Link>
      </div>
      <div className="absolute top-4 left-4 z-10">
        <h1 className="text-2xl font-bold text-blue-800 dark:text-blue-200">
          Digital Comment Board
        </h1>
      </div>
      <div className="w-full h-full">
        <CommentBoard />
      </div>
    </main>
  );
}

{
  /* <main className="fixed inset-0 bg-gradient-to-b from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-950 overflow-hidden">
      <div className="absolute top-4 right-4 z-10 w-96">
        {/* <QRCodeDisplay /> 
      </div>
      <div className="absolute top-4 left-4 z-10">
        <h1 className="text-2xl font-bold text-blue-800 dark:text-blue-200">
          Digital Comment Board
        </h1>
      </div>
      <div className="w-full h-full">
        <CommentBoard />
      </div>
    </main> 
    */
}
