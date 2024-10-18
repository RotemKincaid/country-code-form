import './App.css'
import { useEffect, useRef, useState } from 'react'
import InputMask from 'react-input-mask'
import CountryFlag from 'react-country-flag'
import apiClient from './api/apiClient'

export type CountryData = {
  id: number
  name: string
  calling_code: string
  phone_length: number
  country_code: string 
}

export type TwoFactorPayload = {
  country_id: number
  phone_number: number | undefined
}

function App() {
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(null)
  const [showList, setShowList] = useState<boolean>(false)
  const [searchString, setSearchString] = useState<string>('')
  const [phoneNumber, setPhoneNumber] = useState<string>('')
  const [phoneMask, setPhoneMask] = useState<string>('(999) 999-9999')
  const [phonePlaceHolder, setPhonePlaceHolder] = useState<string>('(000) 000-0000')
  const [countries, setCountries] = useState<CountryData[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const dropdownRef = useRef<HTMLDivElement>(null)

  // Convert the response to an array of objects I can use
  const convertCountriesObject = (countriesObj: Record<string, CountryData>): CountryData[] => {
    return Object.keys(countriesObj).map((key) => ({
      ...countriesObj[key],
      country_code: key, 
    }))
  }

  const fetchCountries = async () => {
    setLoading(true)
    try {
      const response = await apiClient.get('/challenges/countries')
      const converted = convertCountriesObject(response.data)
      setCountries(converted)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  // when phone number is submitted, send this request to the api
  const reqTwoFactor = async (obj: TwoFactorPayload) => {
    setLoading(true)
    try {
      const response = await apiClient.post('/challenges/two_factor_auth', obj)

      if (response.status === 200) console.log("YAY!")
    } catch (error) {
        throw new Error()
    } finally {
      setLoading(false) // Set loading to false after the request is done
    }
  }

  const handleSearch = (value: string) => {
    setSearchString(value)
  }

  const handleSelect = (country: CountryData) => {
    setSelectedCountry(country)
    setShowList(false)
  }

  const toggleList = (e: any) => {
    if (searchString.length) setSearchString('')
    setShowList(!showList)
  }

  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(searchString.toLowerCase())
  )

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setShowList(false)
    }
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()

    if (!selectedCountry) {
      console.error('Country not selected')
      return
    }

    const fullPhoneNumber = `${selectedCountry?.calling_code} ${phoneNumber}`
    const phoneAsInteger = parseInt(fullPhoneNumber.replace(/\D/g, ''), 10)

  
    const payload: TwoFactorPayload = {
       phone_number: phoneAsInteger, 
       country_id: selectedCountry?.id 
    }
    reqTwoFactor(payload)
  }

  // handle phone mask based on length
  const getPhoneMask = (length: number) => {
    const parsedLength = Number(length)
    
    if (parsedLength === 10) return '(999) 999-9999'
    else if (parsedLength === 11) return '999 999 99999'
    else if (parsedLength === 12) return '9999 999 9999'
    else if (parsedLength === 13) return '99999 999 9999'
    else return '(999) 999-9999'
  }

  const getPhonePlaceholder = (length: number) => {
    const parsedLength = Number(length)

    if (parsedLength === 10) return '(000) 000-0000'
    else if (parsedLength === 11) return '000 000 00000'
    else if (parsedLength === 12) return '0000 000 0000'
    else if (parsedLength === 13) return '00000 000 0000'
    else return '0'.repeat(parsedLength)
  }

  // when clicked outside of the list, close it
  useEffect(() => {
    if (!selectedCountry) return

    setPhoneMask(getPhoneMask(selectedCountry.phone_length))
    setPhonePlaceHolder(getPhonePlaceholder(selectedCountry.phone_length))
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [selectedCountry])

  useEffect(() => {
    fetchCountries()
  },[])

  return (
    <div className="bg-violet-400 w-[100vw] h-[100vh]">
      <form onSubmit={(e) => handleSubmit(e)} className="min-h-[80vh] flex items-center">
        <div className="relative flex flex-col items-center gap-3 m-auto p-8 min-w-[340px] sm:min-w-96 border bg-slate-400 rounded-xl text-zinc-600 text-sm shadow-lg">
        {loading && <div className="absolute top-0 left-0 right-0 text-white text-center">Loading...</div>} {/* Loading indicator */}

          <div className="flex justify-between w-[275px]">
            <button onClick={(e) => toggleList(e)} type="button" className="w-18 h-8 rounded-md bg-white px-1">
              <div className="flex items-center justify-around">
                <CountryFlag
                  countryCode={selectedCountry ? selectedCountry.country_code : countries[0]?.country_code}
                  svg
                  style={{ width: '30px', height: '20px' }}
                />
                <div>{selectedCountry ? selectedCountry.calling_code : countries[0]?.calling_code}</div>
              </div>
            </button>
            <InputMask
              mask={phoneMask}
              className="w-[200px] pl-2 rounded-md text-base"
              type="text"
              name="phone"
              placeholder={phonePlaceHolder}
              onChange={e => setPhoneNumber(e.target.value)}
            />
          </div>

          {/* Dropdown list */}
          <div
            ref={dropdownRef}
            className={`absolute top-16 mt-2 sm:left-13 w-[275px] border rounded-xl bg-white shadow-lg transition-all duration-300 ease-in-out transform origin-top-right ${
              showList ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5 pointer-events-none'
            }`}
          >
            <input
              type="text"
              className="border border-slate-500 w-[96%] h-8 rounded-md mx-2 my-2 px-2"
              placeholder="Search country..."
              onChange={(e) => handleSearch(e.target.value)}
            />
            <div className="max-h-[100px] w-[96%] mx-2 my-2 overflow-y-scroll border border-slate-500 rounded-md flex flex-col items-start pl-2 py-2">
              {filteredCountries.map((country, index) => (
                <button
                  type="button"
                  className="w-full flex items-center justify-start py-1"
                  key={index}
                  onClick={() => handleSelect(country)}
                >
                  <CountryFlag
                    countryCode={country.country_code}
                    svg
                    style={{ width: '30px', height: '20px' }}
                  />
                  <div className='pl-2'>{country.name} {country.calling_code}</div>
                </button>
              ))}
            </div>
          </div>

          <button className="min-w-[275px] border border-white bg-slate-100 text-slate-800 font-bold px-8 py-2 rounded-md hover:bg-violet-900 hover:text-white transition-all" type="submit">
            Submit
          </button>
        </div>
      </form>
    </div>
  )
}

export default App
