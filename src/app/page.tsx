'use client'

import './page.module.css'
import React, { useEffect, useState, useRef } from 'react'
//import { NavLink } from 'react-router-dom'
import { format, addDays } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import i18n from '../assets/js/materialcss_datepicker_i18n_ptBR.js'
if (typeof window !== 'undefined') {
  const M = require('materialize-css')
}
import * as Yup from 'yup'
import { phoneMask } from '../assets/js/mask'
import { Form, Field, Formik, FormikProps } from 'formik'
import Input from '../components/Input'
import Preloader from '../components/Preloader'
import { calculateFreeTimeSlots } from './utils/freeSlotsByHour'
interface FormValues {
  name: string;
  banda: string;
  email: string;
  phone: string;
  dia: string;
  horario: never[];
  observacoes: string;
  subject: string;
}
function Appointments() {
  const client_id = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
  const api_key = process.env.NEXT_PUBLIC_GOOGLE_API_KEY
  const totalTime = { start: '15:00', end: '23:00' }
  const [formStatusMessage, setFormStatusMessage] = useState('')
  const [dateSelected, setDateSelected] = useState('')
  const [availableTimes, setAvailableTimes] = useState([])
  const [fetchCalendarStatusMessage, setFetchCalendarStatusMessage] = useState('')
  const [occupiedSlots, setOccupiedSlots] = useState<[{ start: string, end: string }] | [] | undefined>([])

  //Datepicker
  useEffect(() => {
    const el = document.querySelector('.datepicker')
    const dateInput: Element = el!
    const options = {
      autoClose: true,
      format: 'dd/mm/yyyy',
      container: 'body',
      minDate: addDays(new Date(), 1),
      onSelect: (date: string) => {
        setDateSelected(date)
      },
      onClose: function focus() {
        if (!!dateInput) {
          dateInput.focus()
        }
      },
      i18n: i18n
    }
    M.Datepicker.init(dateInput, options)
  }, [])


  //configuração do formik
  const initialValues = {
    name: '',
    banda: '',
    email: '',
    phone: '',
    dia: '',
    horario: [],
    observacoes: '',
    subject: ''
  }

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .min(6, 'Informe seu nome com pelo menos 6 letras')
      .required('Informe seu nome completo'),
    email: Yup.string().required('E-mail obrigatório').email('E-mail inválido'),
    banda: Yup.string().required('Informe nome de artista ou banda'),
    phone: Yup.string()
      .min(15, 'O telefone deve ter DDD + 9 dígitos')
      .required('Informe um número para contato'),
    dia: Yup.lazy(() => {
      return Yup.string().required('Escolha uma data')
    }),
    horario: Yup.array(Yup.string()).when('dia', {
      is: (value: []) => !!value,
      then: () => Yup.array(Yup.string())
        .required()
        .min(1, 'Selecione pelo menos um horário')
    }),
    observacoes: Yup.lazy(() => {
      return Yup.string().notRequired()
    }),
    subject: Yup.string()
  })
  const form = useRef<FormikProps<FormValues>>()
  const resetHorarioCheckbox = () => {
    form.current?.setFieldValue('horario', [])
  }
  /* implementa mascara no campo de telefone */
  const [phone, setPhone] = useState('')
  const handlePhoneChange = (text: string) => {
    const maskedText = phoneMask(text)
    setPhone(maskedText)
    form.current?.setFieldValue('phone', maskedText)
  }

  /* formik guarda valores por padrão / resetar valores ao gerar novos horários */
  const customResetForm = () => {
    form.current?.resetForm()
    setPhone('')
    setFetchCalendarStatusMessage('')
    setFormStatusMessage('')
    setAvailableTimes([])
    M.updateTextFields()
  }
  // const dateSelectedFormated = format(
  //   new Date(dateSelected),
  //   "EEEE',' dd 'de' MMMM",
  //   { locale: ptBR }
  // )
  //fetch occupied slots

  useEffect(() => {
    //dateSelected && form.current?.setFieldValue('dia', format(new Date(dateSelected), 'dd/MM/yyyy'))
    dateSelected &&
      fetchCalendar(dateSelected, totalTime).then(json => {
        const slotsResponse = json.map((item: { start: { dateTime: string }, end: { dateTime: string } }) => {
          return { start: item.start.dateTime, end: item.end.dateTime }
        })
        console.log('slotsResponse', slotsResponse)
        setOccupiedSlots(slotsResponse)
      }).catch(error => {
        setAvailableTimes([])
        setFetchCalendarStatusMessage('Um erro ocorreu. Tente novamente.')
        console.error(error)
      })
    resetHorarioCheckbox()
  }, [dateSelected])

  const fetchCalendar = async (selectedDate: string, totalTime: { start: string, end: string }, timezone: string = '-03:00') => {
    console.clear()
    setAvailableTimes([])
    setFetchCalendarStatusMessage('Consultando horários...')
    const date = format(new Date(selectedDate), 'yyyy-MM-dd')
    const timeStart = Number(totalTime.start.split(":")[0]);
    const timeEnd = Number(totalTime.end.split(":")[0]);
    const dateTimeStart = encodeURIComponent(`${date}T${timeStart}:00${timezone}`)
    const dateTimeEnd = encodeURIComponent(`${date}T${timeEnd}:00${timezone}`)
    const calendar_url = `https://www.googleapis.com/calendar/v3/calendars/${client_id}/events?key=${api_key}&timeMin=${dateTimeStart}&timeMax=${dateTimeEnd}&singleEvents=true&maxResults=20`
    let response = await fetch(calendar_url)
    let json = await response.json()
    return json.items
  }

  useEffect(() => {
    console.log('occupiedSlots', occupiedSlots)
    let response: number[] = []
    response = calculateFreeTimeSlots(totalTime, occupiedSlots)
    setAvailableTimes(response)
  }, [occupiedSlots])

  useEffect(() => {
    occupiedSlots && occupiedSlots.length > 0 &&
      console.log('availableTimes', availableTimes)
  }, [availableTimes])

  return (
    <section id="containerAppointment">
      <div className="container">
        <div className="flex-row row">
          <div className="col l6 s12 flex-center">
            {/* <img className="matchbox img-fluid" width="554" height="554" src={matchbox} alt="" /> */}
          </div>
          <div className="col l6 s12">
            <Formik
              innerRef={form}
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={(values, { setSubmitting, resetForm }) => {
                setFormStatusMessage('Enviando sua mensagem...')
                // api.post('https://dubstudio.com.br/web/sendMail.php', values).then(response => {
                //   setSubmitting(false)
                //   setFormStatusMessage('Sua mensagem foi enviada!')
                //   customResetForm()
                //   console.log(response.data)
                // }, (error) => {
                //   console.log(error)
                //   setFormStatusMessage('Ocorreu um erro. Sua mensagem não foi enviada.')
                //   setSubmitting(false)
                // })
              }
              }>
              {({ errors, touched, handleChange, setFieldValue, isSubmitting, setFormStatusMessage }) => (
                <Form>
                  <Input type="hidden" name="subject" label="" />

                  <div className="row">
                    <div className="col l6 s12">
                      <Input name="name" type="text" label="Nome" />
                      {touched.name && errors.name ? (
                        <div className="errorMessage">{errors.name}</div>
                      ) : null}
                    </div>
                    <div className="col l6 s12">
                      <Input name="banda" id="banda" type="text" label="Banda ou artista" />
                      {touched.banda && errors.banda ? (
                        <div className="errorMessage">{errors.banda}</div>
                      ) : null}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col l6 s12">
                      <Input
                        name="email"
                        type="text"
                        id="email"
                        label="E-mail"
                      />
                      {touched.email && errors.email ? (
                        <div className="errorMessage">{errors.email}</div>
                      ) : null}
                    </div>
                    <div className="col l6 s12">
                      <Input
                        name="phone"
                        id="phone"
                        type="text"
                        label="Celular com DDD"
                        value={phone}
                        maxLength={15}
                        onChange={(e) => { handlePhoneChange(e.target.value) }}
                      />
                      {touched.phone && errors.phone ? (
                        <div className="errorMessage">{errors.phone}</div>
                      ) : null}
                    </div>
                  </div>

                  <div className="row">
                    <div className="col l12 s12">
                      <Input
                        type="text"
                        name="dia"
                        id="dia"
                        label="Qual o dia?"
                        className="datepicker"
                        onChange={handleChange('dia')}
                        onBlur={handleChange}
                        helperText="Escolha uma data para ver os horários disponíveis"
                        value={
                          dateSelected
                            ? format(new Date(dateSelected), 'dd/MM/yyyy')
                            : ''
                        }
                      />
                      {touched.dia && errors.dia ? (
                        <div className="errorMessage">{errors.dia}</div>
                      ) : null}
                    </div>
                  </div>

                  <div className="row">
                    {fetchCalendarStatusMessage && (
                      <div className="col s12">
                        <p>{fetchCalendarStatusMessage}</p>
                      </div>
                    )}
                    <div className="col s6">
                      <div role="group" aria-labelledby="checkbox-group">
                        {availableTimes.map((item, index) =>
                          <div data-key={index} key={index} >
                            <label htmlFor={`radio${index}`}>
                              <Field
                                type="checkbox"
                                id={`radio${index}`}
                                name="horario"
                                value={`${item}h `}
                                onChange={handleChange}
                                className="filled-in with-gap"
                              //disabled={item.disabled}
                              />
                              <span>
                                <i className="material-icons">block</i>
                                {`${item.start}h - ${item.end}h`}
                              </span>
                            </label>
                          </div>
                        )
                        }
                      </div>
                    </div>

                    <div className='col s6'>
                      {/* {occupiedSlots.sort((a, b) => Number(b.start) - Number(a.start)).map((index, item) => <Field key={index} value={`${item}`} />)} */}
                    </div>

                    <div className="col s12">
                      {touched.horario && errors.horario ? (
                        <div className="errorMessage">{errors.horario}</div>
                      ) : null}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col l12 s12">
                      <Input
                        label='Observações'
                        name="observacoes"
                        id="observacoes"
                        helperText={'Descreva aqui o estilo musical, número de instrumentistas e o dia da semana de sua preferência que entraremos em contato para agendar um horário.'
                        }
                        className="materialize-textarea"
                      ></Input>
                      {touched.observacoes && errors.observacoes ? (
                        <div className="errorMessage">{errors.observacoes}</div>
                      ) : null}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col s12 ">
                      {isSubmitting && <p>Enviando sua solicitação...</p>}
                      {/* {Object.keys(errors).length > 0 ? () => setFormStatusMessage('Erro') : null} */}

                      {formStatusMessage && <p> {formStatusMessage} </p>}
                      <div className="input-field">
                        {isSubmitting && <Preloader />}
                        <button
                          type="submit"
                          className="btn waves-effect waves-light"
                          disabled={isSubmitting}
                        >
                          MARCAR HORÁRIO
                        </button>
                        <span className="helper-text center">A marcação do horário está sujeita a confirmação. </span>
                      </div>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </section >
  )
}
export default Appointments
