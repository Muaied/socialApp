import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { HeroUIProvider } from '@heroui/react'
import { RouterProvider } from 'react-router'
import { myRouter } from './Routing/AppRouter'
import { Toaster } from 'react-hot-toast'
import CounterContext from './Context/CounterContext/CounterContext'
import AuthContextProvider from './Context/AuthContextProvider/AuthContextProvider'
import 'react-loading-skeleton/dist/skeleton.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Offline, Online } from 'react-detect-offline'



createRoot(document.getElementById('root')).render(
  <>
    <QueryClientProvider client={new QueryClient()}>
    <AuthContextProvider>
     <CounterContext>
      <HeroUIProvider>
      <RouterProvider router={myRouter}/>
            <ReactQueryDevtools initialIsOpen={false} />
      <Toaster/>
    </HeroUIProvider>
    </CounterContext>
   </AuthContextProvider>
   </QueryClientProvider>
   <Offline>
    <div className="fixed top-[50%] bg-black text-white p-6 rounded-4xl z-100">Your Are Offline</div>
   </Offline>
  </>,
)
