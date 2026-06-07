import {IVideo} from "../models/Video";

export type VideoFromData = Omit<IVideo, "_id">;

type Fetchoptions = {
    method?: "GET" | "POST" | "PUT" | "DELETE",
    body?: any,
    headers?: Record<string, string>
}

class ApiClient {
    private async fetch<T>(
        endpoint: string,
        options: Fetchoptions = {},
    ) : Promise<T>{
        const {method = "GET", body, headers = {}} = options;

        const defaultHeaders = {
            "Content-Type": "application/json",
            ...headers,
        }
        
        const response =await  fetch(`/api/${endpoint}`,{
            method,
            headers: defaultHeaders,
            body: body ? JSON.stringify(body) : undefined,

        })
        if(!response.ok){
            throw new Error (await response.text())
        }
        return response.json();
    }
    async getVideos(){
        return this.fetch("/videos");
    }
    async createVideo(videodata: VideoFromData){
        return this.fetch("/videos",{
            method: "POST",
            body: videodata,
        })
    }
}

export const apiClient = new ApiClient()