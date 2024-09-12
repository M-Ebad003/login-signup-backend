'use client'
import React from 'react'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

import Autoplay from 'embla-carousel-autoplay'
import messages from '@/messages.json'

const page = () => {
  return (
    <>
      <main className='flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12'>
        <section className='text-center mb-8 md:mb-12'>
          <h1 className='text-2xl md:text-5xl font-bold'>Dive into the world of Anonymous Conversations</h1>
          <p className='mt-3 md:mt-4 text-base md:text-lg'>Explore Nextify Message-Where your identity remains a secret</p>
        </section>
        <Carousel className="w-full max-w-sm" plugins={[Autoplay({ delay: 2000 })]}>
          <CarouselContent>
            {
              messages.map((message, index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <Card>
                      <CardHeader className='text-lg bg-gray-500 rounded flex text-center shadow-md'>
                        {message.title}
                      </CardHeader>
                      <CardContent className="flex aspect-square items-center justify-center p-6">
                        <span className="text-xl font-semibold">{message.content}</span>
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
      <footer className='text-center p-4 md:p-6'>
        &copy; 2024 Nextify Message.All rights reserved.
      </footer>
    </>

  )
}

export default page