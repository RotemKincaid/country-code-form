import { createContext } from "react"
// THIS COMPONENT WAS ONLY USED FOR TESTING BEFORE I HIT THE API ENDPOINTS

// Dummy data
const countryData = {
    PK: {
      id: 1,
      name: "Pakistan",
      calling_code: "+92",
      phone_length: 10
    },
    IN: {
      id: 2,
      name: "India",
      calling_code: "+91",
      phone_length: 10
    },
    US: {
      id: 3,
      name: "United States",
      calling_code: "+1",
      phone_length: 10
    },
    CN: {
      id: 4,
      name: "China",
      calling_code: "+86",
      phone_length: 13
    },
    ES: {
      id: 5,
      name: "Spain",
      calling_code: "+34",
      phone_length: 9
    },
    OK: {
      id: 1,
      name: "Pakistan",
      calling_code: "+92",
      phone_length: 10
    },
    UN: {
      id: 2,
      name: "India",
      calling_code: "+91",
      phone_length: 10
    },
    WS: {
      id: 3,
      name: "United States",
      calling_code: "+1",
      phone_length: 10
    },
    XN: {
      id: 4,
      name: "China",
      calling_code: "+86",
      phone_length: 13
    },
    MS: {
      id: 5,
      name: "Spain",
      calling_code: "+34",
      phone_length: 9
    }
  }

  export const AppContext = createContext()

  const AppContextProvider = (props) => {
    const value = {
        countryData
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
  }

  export default AppContextProvider