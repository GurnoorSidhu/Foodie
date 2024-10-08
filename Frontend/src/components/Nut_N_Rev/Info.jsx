import React from 'react'
import Nutrients from './Nutrients'
import Comments from './Comments'



function Info({item}) {
  // console.log(item)
  return (
    <div className='my-4'>
      <Nutrients item={item}/>
      <Comments item = {item}/>
    </div>
  )
}

export default Info
