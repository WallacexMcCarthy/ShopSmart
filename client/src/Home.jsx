import React, {useState, useEffect} from 'react'


const HomePage = () => {
  const [column, setColumn] = useState([])
  const [records, setRecords] = useState([])
  const [product, setProduct] = useState([])
  const [pages,  setPages] = useState([])
  
  const lookupProduct = async (e) => {
    e.preventDefault()
    try{
      console.log("fetching port /ebay")
      fetch('/ebay', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product: product, pages: pages }),  
      }).then((res) => {
        return res.json(); 
      })
      .then((data) => {
        setColumn(Object.keys(data.products[0]))
          setRecords(data.products)
          console.log(column)
          console.log(records)
      })
    } catch(error){
      console.log(error)
    }
  }
  useEffect(() => {
    
  }, [])
    return(
        <div className='home-container'>
          <form className='lookup-product' onSubmit={lookupProduct}>
            <h2> Product Lookup </h2>
            <label htmlFor='product'>
              Lookup Product:
              <input type= "text" onChange={(e) => setProduct(e.target.value)} />
            </label>
            <label htmlFor='pages'>
              Number of Pages to look through:
              <input type= "text" onChange={(e) => setPages(e.target.value)} />
            </label>
            <button type = 'submit'> Lookup </button>
            </form> 
            <table className='display_products'>
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

export default HomePage