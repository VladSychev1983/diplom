import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { store, persistor } from './store/store.js'
import  { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

//экземляр клиента для пагинации.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // количество попыток переповтора запроса при ошибке
      refetchOnWindowFocus: false, // отключаем авто-запрос при смене вкладки
    },
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
    <App />
    </PersistGate>
    </Provider>
    </QueryClientProvider>
  </StrictMode>
)
