import { useState, useRef, useEffect } from 'react'
import { useStore } from './store/AppStore'
import { Swiper, SwiperSlide } from 'swiper/react'

import useNetworkStatus from './hooks/useNetworkStatus'
import { DataSchool } from './store/AppStore'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'

import { NumberCollected } from './store/AppStore'

import { WifiOff, XSquare, CalendarCheck, MoveRightIcon } from 'lucide-react'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import rc4Min from 'rc4.js'
const rc4 = new rc4Min('appSchoolVenezuela')

import syncButton from './assets/img/btn-sincronizar.webp'
import noConectionImage from './assets/img/sin-conexion.webp'
import teamGamersLogo from './assets/img/logo-team-gamers.webp'
import queGuayViajesLogo from './assets/img/logo-que-guay.webp'
import locoPorLaCocinaLogo from './assets/img/logo-loco-por-la-cocina.png'
import movistarLogo from './assets/img/logo-movistar.webp'
import backgroundImage from './assets/img/landing-bg.webp'
import { Autoplay } from 'swiper/modules'

const PRODUCTS = [
  {
    value: 'que-guay-viajes',
    name: 'Que Guay Viajes',
    serviceID: 1,
  },
  {
    value: 'loco-por-la-cocina',
    name: 'Loco x la Cocina',
    serviceID: 2,
  },
  {
    value: 'team-gamers',
    name: 'Team Gamers',
    serviceID: 2,
  },
]

function App() {
  const { schools, setClientName } = useStore()
  const addDataCollected = useStore((state) => state.addNumberCollected)
  const updateStatus = useStore((state) => state.updateStatus)

  const [phoneInput, setPhoneInput] = useState('')
  const [formatedPhone, setFormatedPhone] = useState('')
  const [inputMessage, setInputMessage] = useState('')
  const [productSelected, setProductSelected] = useState('')
  const [showSyncSection, setShowSyncSection] = useState(false)
  const { isOnline, hasInternet } = useNetworkStatus()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const swiperRef = useRef<any>(null)

  function pauseSwiper() {
    if (swiperRef.current) {
      swiperRef.current.autoplay.stop()
    }
  }

  function resumeSwiper() {
    if (swiperRef.current) {
      swiperRef.current.autoplay.start()
    }
  }

  const handleAddNumber = ({
    number,
    serviceID,
  }: {
    number: string
    serviceID: number
  }) => {
    if (number.length > 10 || number.length < 10) return
    setClientName('Movistar-Venezuela') // Configura la escuela
    const numberEncrypted = rc4.encrypt(number)
    addDataCollected('Movistar-Venezuela', {
      serviceID: serviceID,
      number: numberEncrypted,
    }) // Agrega el número

    // cargar 500 numeros consecutivos para prueba de carga masiva
    // for (let i = 0; i < 500; i++) {
    //   const numberInt = parseInt(number) + i

    //   const numberEncrypted = rc4.encrypt(numberInt.toString())
    //   addNumberCollected('Movistar-Venezuela', numberEncrypted) // Agrega el número
    // }

    setPhoneInput('')
    setFormatedPhone('')
    setProductSelected('')
    resumeSwiper()

    const actualDate = new Date().toLocaleDateString('es-ES')
    updateStatus(actualDate, 'unsended')
  }

  const removeFormatting = (value: string) => {
    return value.replace(/\D/g, '')
  }

  const formatPhoneNumber = (value: string) => {
    if (value.length > 3) {
      return `${value.slice(0, 3)}-${value.slice(3, 10)}`
    }
    return value
  }

  function handleInputNumber(event: React.ChangeEvent<HTMLInputElement>) {
    const numberInput = event.target.value
    const rawValue = removeFormatting(numberInput)
    setPhoneInput(rawValue)
    setFormatedPhone(formatPhoneNumber(rawValue))

    if (rawValue.length > 10) {
      setInputMessage('El número tiene más de 10 dígitos')
    }

    if (rawValue.length < 10) {
      setInputMessage('El número debe tener 10 dígitos')
    }

    if (rawValue.length === 10) {
      setInputMessage('')
    }
  }

  useEffect(() => {
    if (swiperRef.current) {
      const index = PRODUCTS.findIndex((p) => p.value === productSelected)

      if (index !== -1) {
        swiperRef.current.slideToLoop(index) // Mueve el Swiper al índice seleccionado
      }
    }
    if (productSelected === '') return
    pauseSwiper()
  }, [productSelected])

  return (
    <div className=" w-screen bg-black ">
      <main
        className="relative w-screen max-w-7xl mx-auto h-[100dvh] min-h-fit px-4 py-8 flex flex-col items-center justify-center md:justify-evenly gap-4 overflow-hidden"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
        }}
      >
        <div className=" z-10 absolute top-12 right-4 w-16 md:w-24 p-1 flex flex-col items-center gap-2">
          {hasInternet ? (
            <button
              type="button"
              onClick={() => setShowSyncSection(true)}
              className=" z-50 w-full "
            >
              <img src={syncButton} alt="Sync Button" />
            </button>
          ) : (
            <div className={` z-0  w-full  `}>
              <img src={noConectionImage} alt="No internet conection Icon" />
            </div>
          )}
        </div>
        <div className="absolute z-0 top-10  w-screen  mx-auto ">
          <Swiper
            onSwiper={(swiper) => {
              swiperRef.current = swiper
            }}
            slidesPerView={2.1}
            centeredSlides={true}
            autoplay={{
              delay: 2000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            spaceBetween={30}
            // loop={true}
            breakpoints={{
              1024: {
                slidesPerView: 3,
                autoplay: false,
                centeredSlides: false,
              },
              768: {
                slidesPerView: 2.1,
              },
              640: {
                slidesPerView: 1.1,
              },
            }}
            pagination={{
              clickable: true,
            }}
            modules={[Autoplay]}
            direction="horizontal"
            // dir="rtl"
            className="relative mySwiper h-40 md:h-60 w-full max-w-[350px] md:max-w-screen-lg lg:pl-6 flex items-center mt-10 "
          >
            <SwiperSlide className=" w-full h-full flex items-center">
              <img
                src={queGuayViajesLogo}
                alt="Que Guay Viajes Logo"
                className={`${
                  productSelected === 'que-guay-viajes'
                    ? 'scale-100'
                    : ' scale-100 grayscale'
                } w-auto h-4/6 ml-2 mx-auto`}
                onClick={() => setProductSelected('que-guay-viajes')}
              />
            </SwiperSlide>
            <SwiperSlide className=" w-full h-full flex items-center">
              <img
                src={locoPorLaCocinaLogo}
                alt="Locos por la Cocina Logo"
                className={` ${
                  productSelected === 'loco-por-la-cocina'
                    ? 'scale-100'
                    : ' scale-100 grayscale'
                } w-auto h-full mx-auto`}
                onClick={() => setProductSelected('loco-por-la-cocina')}
              />
            </SwiperSlide>
            <SwiperSlide className=" w-full h-full flex items-center">
              <img
                src={teamGamersLogo}
                alt="Team Gamers Logo"
                className={`${
                  productSelected === 'team-gamers'
                    ? 'scale-100 '
                    : ' scale-100 grayscale brightness-75 '
                } w-auto h-4/5 mx-auto`}
                onClick={() => setProductSelected('team-gamers')}
              />
            </SwiperSlide>
          </Swiper>
        </div>
        <section className="w-full mt-48 min-h-fit max-h-[500px] flex flex-col items-center gap-3">
          <p className=" w-full max-w-[500px]  px-2 font-white font-poppinsReg text-white uppercase text-[0.65rem] md:text-sm lg:text-base">
            Déjanos tu teléfono y, si eres cliente Movistar, en las próximas
            horas estarás disfrutando de 20 días sin costo de la opción de
            entretenimiento de tu elección
          </p>
          <div className=" w-full max-w-[400px] lg:max-w-[500px] px-4 py-6 lg:px-8 flex flex-col items-center justify-between gap-6 lg:gap-8 bg-[#dbdbdb] rounded-2xl">
            <div className=" relative w-full">
              <label
                htmlFor="tel"
                className=" w-full text-neutral-800 uppercase font-poppinsReg text-xs md:text-base lg:text-lg text-left"
              >
                Ingrese su número telefónico
              </label>
              <div className="relative w-full h-fit ">
                <img
                  src="/img/icono-mobile.webp"
                  alt="Phone Icon Mobile"
                  className=" absolute left-2 h-full py-1 lg:py-2"
                />
                <Input
                  type="tel"
                  id="tel"
                  value={formatedPhone}
                  onChange={(e) => handleInputNumber(e)}
                  className=" pl-10 lg:pl-14 lg:py-6 font-medium text-lg md:text-xl lg:text-2xl placeholder:font-normal placeholder:text-base"
                  minLength={11}
                  maxLength={11}
                />
                <p className=" absolute mt-1 text-sm text-red-600">
                  {inputMessage}
                </p>
              </div>
            </div>
            <div className="relative w-full h-fit ">
              <label
                htmlFor="products"
                className=" w-full text-neutral-800 uppercase font-poppinsReg text-xs md:text-base lg:text-lg text-left "
              >
                Producto a suscribirte
              </label>

              <Select
                onValueChange={(value) => setProductSelected(value)}
                name="products"
                value={productSelected}
                defaultValue={''}
              >
                <SelectTrigger className=" w-full text-neutral-800 uppercase font-poppinsReg text-xs md:text-base lg:text-lg text-left">
                  <SelectValue
                    placeholder={'Seleccionar una opción'}
                    className="w-[180px]"
                  />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCTS.map((prod, index) => {
                    return (
                      <SelectItem
                        key={index}
                        value={prod.value}
                        className=" my-2 cursor-pointer rounded-md text-base"
                      >
                        {prod.name}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>

            <button
              type="button"
              className=" px-6 py-1 bg-black text-sm md:text-base text-white uppercase disabled:bg-neutral-400 disabled:text-neutral-500 rounded-full"
              disabled={phoneInput.length !== 10 || productSelected === ''}
              onClick={() =>
                handleAddNumber({
                  number: phoneInput,
                  serviceID: PRODUCTS.find(
                    (prod) => prod.value === productSelected
                  )!.serviceID,
                })
              }
            >
              Agregar
            </button>
          </div>
        </section>

        <img
          src={movistarLogo}
          alt="Brand Logo"
          className="w-1/2 max-w-[300px]"
        />

        <SyncSection
          {...{
            showSyncSection,
            setShowSyncSection,
            updateStatus,
            schools,
            isOnline,
            hasInternet,
          }}
        />
      </main>
    </div>
  )
}

export default App

const SyncSection = ({
  showSyncSection,
  setShowSyncSection,
  updateStatus,
  schools,
  isOnline,
  hasInternet,
}: {
  showSyncSection: boolean
  setShowSyncSection: React.Dispatch<React.SetStateAction<boolean>>
  updateStatus: (date: string, status: 'unsended' | 'sended' | 'error') => void
  schools: DataSchool[]
  isOnline: boolean
  hasInternet: boolean
}) => {
  //const [schoolSync, setSchoolSync] = useState('Movistar-Venezuela')
  const [dateSync, setDateSync] = useState('')
  const [popupMessage, setPopupMessage] = useState('')
  const [dataColSync, setDataColSync] = useState<NumberCollected[]>([])

  async function handleSendData() {
    // console.log('Send Data')
    if (!dateSync.length && !dataColSync.length) return

    setPopupMessage('Enviando datos... Por favor espere.')

    // usar un for para recorrer el array de dataColSync en bloques de 10 y enviarlos por separado
    for (let i = 0; i < dataColSync.length; i += 10) {
      const res = await pushData({
        date: dateSync,
        numbersCollected: dataColSync.slice(i, i + 10),
      })

      if (!res.ok) {
        updateStatus(dateSync, 'error')
        console.error('Error')

        break
      }
      if (res.ok) {
        updateStatus(dateSync, 'sended')
        console.log('Paquete de datos enviado')
      }
    }

    setDateSync('')
    setDataColSync([])
    setShowSyncSection(false)
    setPopupMessage('')
  }

  async function pushData({
    date,
    numbersCollected,
  }: {
    date: string
    numbersCollected: NumberCollected[]
  }) {
    const ENDPOINT =
      'https://test.moob.club:8005/movistar/venezuela/app-recolecciondatos-multiproducto/'

    // let res, data

    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Movistar-Venezuela',
          data: [
            {
              date,
              numbersCollected,
            },
          ],
        }),
        redirect: 'follow',
      })

      const data = await res.json()
      console.log(data)

      // data = await res.json()
      // console.log('---- Data enviada: ----')
      // console.log(data)
      return { ok: true }
    } catch (error) {
      console.log('Error al enviar los datos: ', error)
      // console.log(error)
      return { ok: false, error: error }
    }
  }

  return (
    <section
      className={`${
        showSyncSection ? ' translate-y-0 ' : ' translate-y-full  '
      } absolute z-30 top-0 w-full px-4 h-full flex flex-col items-center justify-evenly lg:gap-20 transition-all duration-300 ease-in-out`}
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
      }}
    >
      <button
        type="button"
        onClick={() => setShowSyncSection(false)}
        className=" z-50 absolute top-4 right-4 bg-neutral-950 text-white rounded-sm "
      >
        <XSquare
          className={` text-white h-5 w-5 md:w-7 md:h-7 lg:w-9 lg:h-9 m-2`}
        />
      </button>
      {/* <div className=" w-full flex flex-col items-center gap-2 lg:gap-6">
        <img
          src={teamGamersLogo}
          alt="Team Gamers Logo"
          className=" w-5/6 max-w-[350px] "
        />
        <p className=" text-white uppercase font-poppinsBoldItalic md:text-2xl">
          Tu portal de gaming
        </p>
      </div> */}

      <div className=" w-full max-w-[500px] flex flex-col items-center gap-2 mt-10">
        <p className=" font-poppinsReg text-center lg:text-lg text-white uppercase font-bold tracking-wider">
          Sincronización de datos
        </p>
        <div className=" w-full px-4 py-6 flex flex-col items-center justify-around gap-6 bg-neutral-300 rounded-2xl">
          <label htmlFor="date" className="w-full flex items-center gap-2">
            <CalendarCheck className="h-4 w-4 text-neutral-800" />
            <span className=" text-neutral-800">Fecha cargada</span>
          </label>
          <Select
            onValueChange={(value) => {
              setDateSync(value)
              setDataColSync(
                schools
                  .filter((school) => school.name === 'Movistar-Venezuela')
                  .map((school) => school.data)
                  .flat()
                  .filter((school) => school.date === value)[0]
                  ?.numbersCollected
              )
            }}
            value={dateSync?.length ? dateSync : ''}

            // disabled={!schoolSync?.length}
          >
            <SelectTrigger className="w-full md:text-lg lg:text-xl">
              <SelectValue
                placeholder={'Seleccione el día'}
                className="w-[180px]"
              />
            </SelectTrigger>
            <SelectContent>
              {schools
                ?.filter((school) => school.name === 'Movistar-Venezuela')
                .map((school) => school.data)
                .flat()
                .map((school, index) => {
                  return (
                    <SelectItem
                      key={index}
                      value={school.date}
                      className=" my-2 cursor-pointer rounded-md text-lg"
                      style={{
                        backgroundColor:
                          school.status === 'sended'
                            ? 'lightgreen'
                            : school.status === 'error'
                            ? 'red'
                            : 'lightgray',
                      }}
                    >
                      {school.date} -{' '}
                      {school.status === 'sended'
                        ? 'Enviado'
                        : school.status === 'error'
                        ? 'Error'
                        : 'Sin enviar'}
                    </SelectItem>
                  )
                })}
            </SelectContent>
          </Select>
          <div className=" w-full flex justify-end ">
            {isOnline && hasInternet ? (
              <button
                type="button"
                onClick={handleSendData}
                disabled={dataColSync.length === 0}
                className=" z-50 px-4 py-2 text-xs md:text-sm flex items-center gap-4 bg-black text-white uppercase hover:bg-black disabled:bg-neutral-400 disabled:text-neutral-600 rounded-full"
              >
                {dataColSync.length === 0 ? 'No hay datos' : 'Enviar Datos'}
                <MoveRightIcon
                  className={`${
                    dataColSync.length === 0 && 'hidden'
                  } text-white w-6 `}
                />
              </button>
            ) : (
              <div className=" bg-neutral-400 text-neutral-800 select-none px-6 p-2 text-xs md:text-sm flex items-center gap-4 rounded-full">
                <WifiOff className={` text-neutral-800 h-4 w-4`} />
                Sin internet
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        className={` ${
          popupMessage.length ? 'block' : 'hidden'
        } absolute z-50 w-full h-full flex items-center justify-center bg-black/80 pointer-events-none`}
      >
        <p className=" w-full max-w-[360px] bg-sky-700 text-white uppercase font-semibold animate-pulse text-center px-20 py-6 sm:rounded-lg">
          {popupMessage}
        </p>
      </div>

      <img
        src={movistarLogo}
        alt="Brand Logo"
        className="w-1/2 max-w-[300px]"
      />
    </section>
  )
}
