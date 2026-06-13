"use client";

import { ImageKitProvider } from "@imagekit/next";
import { SessionProvider } from "next-auth/react";

export function Providers({children}:
    {children: React.ReactNode
}) {
    // Build the full ImageKit URL endpoint from the short ID if necessary.
    const raw = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "";
    const urlEndpoint = raw.startsWith("http") ? raw : `https://ik.imagekit.io/${raw}`;

    return (
        <SessionProvider refetchInterval={5 * 60}>
            <ImageKitProvider urlEndpoint={urlEndpoint}>
                {children}
            </ImageKitProvider>
        </SessionProvider>
    );
}