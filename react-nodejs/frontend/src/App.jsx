import { useState } from 'react'
import './App.css'

const apiUrl = import.meta.env.VITE_API_URL;

function App() {
  const [data, setData] = useState({ "Message": "No Data" })

  const getTodos = async () => {
    try {
      const res = await fetch(apiUrl + "/todos", { credentials: 'include', });
      const data = await res.json();
      setData(data)
    }
    catch (err) {
      console.error(err);
      setData({ "Message": "Unauthenticated! Please login" })
    }
  }

  const handleLogin = () => {
    try {
      fetch(apiUrl + "/login", {
        credentials: 'include',
      }).then(res => res.json()
      ).then(data => window.location.href = data.congnitoLoginURL
      )
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <>
      <div className="card">
        {JSON.stringify(data)}
        <br />
        <button onClick={getTodos}>
          Fetch Todos
        </button>
        <br />
        <button onClick={handleLogin}>
          Login
        </button>
      </div>
    </>
  )
}

export default App