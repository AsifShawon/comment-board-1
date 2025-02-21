"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Card, CardContent } from "@/components/ui/card";
import { QrCode } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function QRCodeDisplay() {
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        const commentUrl = `${window.location.origin}/comment`;
        const url = await QRCode.toDataURL(commentUrl);
        setQrCodeUrl(url);
      } catch (err) {
        console.error(err);
      }
    };

    generateQRCode();
  }, []);

  return (
    <Card className="bg-white/90 dark:bg-blue-950/90 backdrop-blur-sm">
      <CardContent className="p-2">
        <div className="flex items-center gap-2 mb-2">
          <QrCode className="w-10 h-10" />
          <span className="text-xs">Scan to Comment</span>
        </div>
        <div className="flex justify-center">
          {qrCodeUrl ? (
            <Image
              src={qrCodeUrl}
              alt="QR Code"
              width={68}
              height={68}
              className="w-[450px] h-[450px]"
            />
          ) : (
            <p>Loading QR Code...</p>
          )}
        </div>
        <Link href="/comment">
          <p className="text-center mt-2 text-blue-500 dark:text-blue-300 underline">
          https://comment-board.vercel.app/comment
          </p>
        </Link>
      </CardContent>
    </Card>
  );
}
