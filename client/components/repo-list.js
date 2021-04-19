import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { useParams, Link } from "react-router-dom"
import Head from './head'

const RepoList = () => {

  const { userName } = useParams()

  const [repos, setRepos] = useState([])

  useEffect(() => {
     axios(`https://api.github.com/users/${userName}/repos`)
    .then(({data}) => data)
    .then((item) => item.map(it => it.name))
    .then(fullRepos => setRepos(fullRepos))
    .catch(() => {
      return []
    })
  }, [userName])


  return (
    <div className="bg-yellow-600 ">
      <Head title="Hello" />
      <div className="bg-black p-10 text-yellow-600 text-2xl display: flex justify-between">
        <div if="repository-name"> {userName} </div> 
        <div id="go-back"> <Link to="/">go-back</Link> </div>
      </div>
      <div className="flex items-center justify-center  h-screen">
        <div className="bg-black text-yellow-600 font-bold rounded-lg p-10 mb-60">
          { repos.map(it => {
            return <div key={it}>          
              <Link to={`/main/${userName}/${it}`}>{it}</Link>
            </div>})}
        </div>
      </div>
    </div>
  )
}

RepoList.propTypes = {}
export default React.memo(RepoList)
