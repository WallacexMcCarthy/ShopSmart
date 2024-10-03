import React, {useState, useEffect} from 'react'

function App(){
  const [column, setColumn] = useState([])
  const [records, setRecords] = useState([])
  useEffect(() => {
    fetch("/ebay").then(
      res => res.json()
    ).then(
      data => {
        setColumn(Object.keys(data.products[0]))
        setRecords(data.products)
        console.log(column)
        console.log(records)
      
      }
    )
  }, [])

  return(
    <div>
      <table className='table'>
        <thead>
          <tr>
            {column.map((c,i) => (
              <th key = {i}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {
            records.map((record, i) =>(
              <tr key = {i}>
                <td>{record.id}</td>
                <td>{record.title}</td>
                <td>{record.price}</td>
                <td>{record.link}</td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  )
}

export default App