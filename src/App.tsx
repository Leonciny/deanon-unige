import { useEffect, useState } from 'react';
import './App.css'
import { Input } from './components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './components/ui/table'
import dataSrc from '@/data.json'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';

const capitalizeNames = (str: string) => 
  str.split(' ').map( e => e[0].toUpperCase() + e.slice(1).toLowerCase() ).join(' ');


const initialData = dataSrc.map( ({id, nomeECognome}) => ({ id, nomeECognome: capitalizeNames(nomeECognome) }))

function Highlighter (props: { str: string }) {
  const tokens = props.str.split(/{|}/g)
  if ( tokens.length === 1 ) return props.str;
  
  console.log({ props })
  console.log({ tokens })

  return <p>
    { tokens.map( (e, i) => {
      if ( (i & 0b1) === 1 ) {
        return <span className='bg-zinc-600'>{e}</span>
      }
      return e;
    })}
  </p>

}



function App() {

  const [sort, setSort] = useState<'id' | 'nomeECognome'>('id');
  const [data, setData] = useState(initialData.sort( (a,b) => a[sort].toLowerCase().localeCompare(b[sort].toLowerCase())));

  useEffect(() => {
    setData( d => d.sort( (a,b) => a[sort].localeCompare(b[sort])))
  }, [sort, setData])


  const filter = (value: string) => {
    const val = value.toLowerCase()
    const isNumber = ! Number.isNaN(Number(val));

    const regex = new RegExp(`${val}`, 'gi')

    if ( value === '' ) setData( initialData )
    else if ( isNumber ) 
      setData(initialData
        .filter( e => e.id.includes(val) )
        .sort( (a,b) => a[sort].toLowerCase().localeCompare(b[sort].toLowerCase()))
        .map( e => ({nomeECognome: e.nomeECognome, id: e.id.replace(regex, `{${val}}`)})))
    else
      setData(initialData
          .filter( e => e.nomeECognome.toLowerCase().includes(val)) 
          .sort( (a,b) => a[sort].toLowerCase().localeCompare(b[sort].toLowerCase()))
          .map( e => ({nomeECognome: e.nomeECognome.replace(regex, `{${val}}`), id: e.id })))
  }

  return (
    <>
      <h1 className='w-full text-left text-5xl md:text-7xl'>
        UNIGE DEANON
      </h1>
      <div className='w-full mb-5 mt-5 flex flex-1 gap-2 flex-col md:flex-row'>
        <Input className='p-2' type='search' placeholder='Cerca...' onChange={(e) => {
          filter(e.target.value);
        }}></Input>
        <Select value={sort} onValueChange={(v: 'id' | 'nomeECognome') => setSort(v)}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Ordina" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="id">ID</SelectItem>
            <SelectItem value="nomeECognome">Nome e Cognome</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Table className='w-full'>
        <TableHeader>
        <TableRow className='w-full'>
          <TableHead className="w-[100px] justify-between">ID</TableHead>
          <TableHead className="text-left justify-between w-full">Nome e Cognome</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className='w-full'>
        { data.map( d => 
          <TableRow>
            <TableCell className="text-left font-medium">
              <Highlighter str={d.id} />
            </TableCell>
            <TableCell className="text-left">
              <Highlighter str={d.nomeECognome} />
            </TableCell>
          </TableRow>
        )
        }
      </TableBody>
      </Table>
    </>
  )
}

export default App
