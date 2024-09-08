"use client"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from 'embla-carousel-autoplay'
import messages from "@/messages.json"
import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"


const Home = () => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(()=>{
      setIsLoading(true)
    }, 1000)

    return ()=> clearTimeout(timer);
  },[])

  return (
    <>
    <main className='flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12'>
      <section className='text-center  mb-8 md:mb-12'>
        <h1 className='text-3xl md:text-5xl fond-bold'>Dive into the World of Anonymous Converstions</h1>
        <p className='mt-4 md:mt-4 text-base md:text-lg'>Explore Mystery Message - where your identity remans a secret.</p>
      </section>
      <Carousel 
      plugins={[Autoplay({delay: 2000})]}
      className="w-full max-w-xs">
      <CarouselContent>
        {isLoading == false ? 
            <Skeleton className="w-[400px] h-[400px] rounded-sm" />

        :
          messages.map((message, index) => (
            <CarouselItem key={index}>
                  <div className="p-1">
                    <Card>
                      <CardHeader>
                        {message.title}
                      </CardHeader>
                      <CardContent className="flex aspect-square items-center justify-center p-6">
                        <span className="text-lg font-semibold">{message.content}</span>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
          ))
        }
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
    </main>
    <footer className="text-center p-4 md:p-6">
      @ 2023 Mystery Notes. All rights reserved.
    </footer>
    </>
  )
}

export default Home
