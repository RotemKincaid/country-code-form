import './App.css'
import { useContext, useEffect, useRef, useState } from 'react'
import { AppContext } from './context/AppContext'
import InputMask from 'react-input-mask'
import CountryFlag from 'react-country-flag'

export type CountryData = {
  id: number;
  name: string;
  calling_code: string;
  phone_length: number;
  country_code: string;
};

function App() {
  const { countryData } = useContext(AppContext)
  const countryArray: CountryData[] = (Object.keys(countryData) as Array<keyof typeof countryData>).map(key => {
    return { ...countryData[key], country_code: key }
  });

  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(null)
  const [showList, setShowList] = useState<boolean>(false)
  const [searchString, setSearchString] = useState<string>('')
  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleSearch = (value: string) => {
    setSearchString(value)
  };

  const handleSelect = (country: CountryData) => {
    setSelectedCountry(country) // Set selected country 
    setShowList(false)
  };

  const toggleList = (e: any) => {
    e.preventDefault()
    if(searchString.length) setSearchString('')

    setShowList(!showList) // Toggle dropdown
  };

  const filteredCountries = countryArray.filter(country =>
    country.name.toLowerCase().includes(searchString.toLowerCase())
  );

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setShowList(false); // Close dropdown if clicked outside
    }
  };

  // Dynamically changing the phone mask based on selected country
  const getPhoneMask = (length: number) => {
    if (length === 10) return '(999) 999-9999';
    else if (length === 11) return '999 999 99999'
    else if (length === 12) return '9999 999 9999'
    else if (length === 13) return '99999 999 9999'
    return '999999999999999' // Default mask with up to 15 digits
  };


  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    };
  }, [selectedCountry])

  return (
    <div className="bg-violet-400 w-[100vw] h-[100vh]">
      <form onSubmit={(e) => e.preventDefault()} className="min-h-[80vh] flex items-center">
        <div className="relative flex flex-col items-center gap-3 m-auto p-8 min-w-[340px] sm:min-w-96 border bg-slate-400 rounded-xl text-zinc-600 text-sm shadow-lg">
          
          {/* Button that triggers dropdown */}
          <div className="flex justify-between w-[267px]">
            <button
              onClick={(e) => toggleList(e)}
              type="button"
              className="w-16 h-8 rounded-md bg-white pl-2"
            >
              <div className="flex items-center justify-around">
              <CountryFlag
                  countryCode={selectedCountry ? selectedCountry.country_code : countryArray[0].country_code}
                  svg
                  style={{ width: '30px', height: '20px'}}
                />                
                <div>{selectedCountry ? selectedCountry.calling_code : countryArray[0].calling_code}</div>
              </div>
            </button>
            <InputMask
              mask={getPhoneMask(selectedCountry? selectedCountry.phone_length : 0)}
              className="w-[200px] pl-2 rounded-md text-base"
              type="text"
              name="phone"
              placeholder="(xxx) xxx-xxxx"
            />
          </div>

          {/* Dropdown list */}
          <div
            ref={dropdownRef} // Attach ref here
            className={`absolute top-16 mt-2 sm:left-14 w-[267px] border rounded-xl bg-white shadow-lg transition-all duration-300 ease-in-out transform origin-top-right ${
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
                  className="w-full flex items-center justify-start py-1"
                  key={index}
                  onClick={() => handleSelect(country)}
                >
                  <CountryFlag
                    countryCode={country.country_code}
                    svg
                    style={{ width: '30px', height: '20px' }}
                  />                  
                  <div>{country.name} {country.calling_code}</div>
                </button>
              ))}
            </div>
          </div>

          <button className="min-w-[267px] border border-white bg-slate-100 text-slate-800 font-bold px-8 py-2 rounded-md hover:bg-violet-900 hover:text-white transition-all">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default App;
