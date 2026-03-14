import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@mantine/core/styles.css'
import '@mantine/dates/styles.css'   // ← ADD THIS — fixes broken calendar UI
import './index.css'
import { MantineProvider } from '@mantine/core'
import { DatesProvider } from '@mantine/dates'  // ← ADD THIS
import AppRouter from './routes/AppRouter'
import dayjs from 'dayjs';
import 'dayjs/locale/en';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);
dayjs.locale('en');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider>
      <DatesProvider settings={{ locale: 'en', firstDayOfWeek: 1 }}>
        <AppRouter />
      </DatesProvider>
    </MantineProvider>
  </StrictMode>,
)