import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Head from './head'

const RepoRead = () => {

  const { repositoryName, userName } = useParams()

  const [repoContent, setRepoContent] = useState([])

  useEffect(() => {
    return axios(`https://api.github.com/repos/${userName}/${repositoryName}/contents/README.md`)
    .then(result => result.data.download_url)
    .then(readMe => {
      return axios(readMe).then(readMeUrl => setRepoContent(readMeUrl.data))
    })
  }, [userName, repositoryName])

  return (
    <div className="bg-yellow-600 ">
      <Head title="Hello" />
      <div className="bg-black p-10 text-yellow-600 text-2xl display: flex justify-between">
        <div if="repository-name"> {userName} </div>
        <div id="go-repository-list"><Link to={`/main/${userName}`}> go-repository-list </Link></div> 
        <div id="go-back"> <Link to="/">go-back</Link></div>
      </div>
      <div className="flex items-center justify-center h-screen">
        <div className="bg-black hover:text-red-500 text-yellow-600 font-bold p-10">
          {JSON.stringify(repoContent, null, 2)}
        </div>
      </div>
    </div>
  )
}

RepoRead.propTypes = {}

export default React.memo(RepoRead)
