import React from "react";
import { QRCodeDisplay } from "../components/qr-code-display";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const Page = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="absolute top-4 right-1 z-10 w-96">
        <Link href="/">
          <Button>Comment Board</Button>
        </Link>
      </div>
      <QRCodeDisplay />
    </div>
  );
};

export default Page;
