'use client'

import React, { useEffect, useState, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { Calendar } from "@/components/ui/calendar"
import { Toggle } from "@/components/ui/toggle"
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { format } from 'date-fns'
import { calendarService } from '../../services/calendarService'
import { useSession, signIn, signOut } from "next-auth/react";

function Appointments() {
  const container = useRef<HTMLDivElement>(null)
  const { data: session } = useSession();
  const totalTime = { start: '09', end: '18' } //esses dados podem estar na camada da api
  const [dateSelected, setDateSelected] = useState<Date>(new Date())
  const [availableTimes, setAvailableTimes] = useState<[]>([])
  const [message, setMessage] = useState('')
  const [occupiedSlots, setOccupiedSlots] = useState<[{ start: string, end: string }] | [] | undefined>([])

  async function signInGoogle(){
    await signIn('google')
  }

  useEffect(() => {
    async function fetchFreeHours() {
      const date = format(dateSelected, 'yyyy-MM-dd')
      const response = await calendarService.getFreeHours({ date: date, start: totalTime.start, end: totalTime.end })
      response ? setAvailableTimes(response.data) : []
    }
    if (dateSelected)
      fetchFreeHours()
  }, [dateSelected])
  const handleInsertEvent = async () => {
    const response = await calendarService.insertEvent()
    setMessage(response.data.message)

  console.log('handleInsertResponse', response.data)
  }
  return (
    <section id="appointment" className="flex items-center flex-col">
      <header className='flex items-center justify-between' style={{'width': container.current?.clientWidth}}>
      <h1 className="py-4 text-center">Google Calendar App</h1>
      <div className='flex items-center justify-between'>
      <p className='px-2'>{session?.user?.name}</p>
      <Image src={session?.user?.image ?? ''} alt='' width='30' height='30'/>
      </div>
      </header>
      <div className="flex justify-center">
        <div ref={container} className="grid grid-cols-2 gap-1 rounded-xl border bg-card text-card-foreground shadow">
          <Calendar
            mode='single'
            selected={dateSelected}
            onDayClick={setDateSelected}
          />
          <div className="flex flex-col p-3 h-90">
            <h4 className="mb-3 text-md font-medium">Horários disponíveis em {format(dateSelected, 'dd/MM/yyyy')}</h4>
            <div className="flex flex-wrap mb-auto max-w-[336px]">
              {availableTimes.length > 0 && availableTimes.map((item, index) =>
                <Toggle
                  id={`radio${index}`}
                  key={index}
                  variant='outline'
                  name="horario"
                  value={`${item}h `}
                  className="my-1 mx-1 text-md"
                >
                  {`${(item)}h`}
                </Toggle>
              )
              }
            </div>
            <p color='red'>{message}</p>
            {session ?
              <>
                <Button className="w-full mt-auto mb-1 text-md" onClick={handleInsertEvent}>Confirmar</Button>
                <Button className="w-full mt-auto mb-1 text-md" onClick={() => signOut()}>Fazer logout</Button>
              </>
              :
              <Button className="w-full mt-auto mb-1 text-md" onClick={signInGoogle}>Fazer login</Button>
            }
          </div>
        </div>
        {/* {occupiedSlots.sort((a, b) => Number(b.start) - Number(a.start)).map((index, item) => <Field key={index} value={`${item}`} />)} */}
      </div>

    </section >
  )
}
export default Appointments
