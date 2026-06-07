import { connectToDB } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";
import Video, { IVideo } from "@/models/Video";
import { getServerSession } from "next-auth";

export async function GET(){
    try {
        await connectToDB();
        const videos = await Video.find({}).sort({createdAt: -1}).lean()
        if(!videos || videos.length === 0)
            return NextResponse.json({},{status:200})
        return NextResponse.json(videos)

    } catch (error) {
        return NextResponse.json(
            {error : "Failed to fetch video!!!"},
            {status:500}
        )
    }
}

export async function POST(request:NextRequest){
    try {
        const session = await getServerSession()
        if(!session){
            return NextResponse.json(
            {error : "User unauthenticated!!!"},
            {status:401}
        )
        }
        await connectToDB()
        const body : IVideo = await request.json()
        if(
            !body.title ||
            !body.videoUrl ||
            !body.description ||
            !body.thumbnailUrl

        ){
            return NextResponse.json(
            {error : "Missing components"},
            {status:401}
            )
        }
        
        const videodata = {
            ...body,
            controls: body?.controls ?? true,
            transformation: {
                height: 1920,
                width:1080,
                quality: body.transformation?.quality ?? 100,
            },
        }
        const nextVideo = await Video.create(videodata)
        return NextResponse.json(nextVideo)
    } catch (error) {
        return NextResponse.json(
            {error : "Failed to create video"},
            {status:500}
            )
    }
}