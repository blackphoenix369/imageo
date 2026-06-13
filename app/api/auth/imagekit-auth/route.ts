import { getUploadAuthParams } from "@imagekit/next/server"

// process may not be recognized by the workspace TS config in some setups;
// declare it locally to avoid TypeScript errors in route files.
declare const process: any;

export async function GET() {
    try{
        const AuthenticationParameters = getUploadAuthParams({
            privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string,
            publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY as string,
        })

        return Response.json({
            AuthenticationParameters,
            publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY,
        })
    } catch (error) {
        return Response.json(
            { error: "Failed to generate upload authentication parameters" },
            { status: 500 }
        )
    }
}