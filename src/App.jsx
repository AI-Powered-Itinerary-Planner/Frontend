import { useState } from 'react'
import './App.css'
import { Toaster } from 'react-hot-toast'

function App() {
  return (
    <>
      <Toaster position='bottom-right' toastOptions={{duration:2000}}/>
    </>
  )
}

export default App
