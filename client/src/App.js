import React, {useState, useEffect} from 'react'

function App(){
  const [column, setColumn] = useState([])
  const [records, setRecords] = useState([])
  // const [data, setData] = useState([{}])
  useEffect(() => {
    fetch("http://localhost:3000/ebay_products.json").then(
      res => res.json()
    ).then(
      data => {
        setColumn(Object.keys(data.products[0]))
        setRecords(data.products)
        // setData(data)
        // console.log(data)
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
      {/* {(typeof data.members === 'undefined') ? (
        <p> Loading... </p>
      ) : (
        data.members.map((member, i) => (
          <p key = {i}>{member}</p>
        ))
      )} */}
    </div>
  )
}

export default App