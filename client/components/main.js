import React, {useState} from 'react'
import Head from './head'
import { history } from '../redux'

const Main = (props) => {

const [name, setName] = useState('')

const onChange = (e) => {
  return setName(e.target.value)
}

console.log(name)

  return (
    <div className="bg-yellow-600">
      <Head title="Hello" />
      <div className="flex items-center justify-center h-screen">
        <div className="bg-black font-bold rounded-lg p-8">         
          <div className="text-balck mt-5">
            <input type="text" id="input-field" name={name} onChange={onChange}/>
          </div>
          <div className="text-yellow-600 mt-5 ">
            <button type="button" id="search-button" onClick={ () => {
              history.push(`/${name}`)
              return props.set(name)
              } }>SEND</button>
          </div>
        </div>
      </div>
    </div>
  )
}

Main.propTypes = {}

export default React.memo(Main)
