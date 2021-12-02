import { format } from 'date-fns'

export const dateCompare = ({ date }, b) => (
  new Date(b.date.year, b.date.month, b.date.day) - new Date(date.year, date.month, date.day)
)

export const formatCurrency = value => (
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
)

export const formatTimestamp = timestamp => (
  (new Date(timestamp).getTime() > 0) ? format(new Date(timestamp), 'dd/MM/yyyy') : ''
)

export const parsePriceData = (arr = []) => (
  arr.sort(dateCompare)
    .reverse()
    .map(p => ({
      price: p.price,
      date: p.normalizedDate.getTime()
    }))
)
