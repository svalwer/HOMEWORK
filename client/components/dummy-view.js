import React from 'react'

import { Switch, Route } from 'react-router-dom'

import Head from './head'

import Main from './main'
import RepoList from './repo-list'
import RepoRead from './repo-read'

const Dummy = () => {
  return (
    <div>
      <Head title="Hello" />
      <div className="flex items-center justify-center h-screen">
        <div className="bg-indigo-800 text-white font-bold rounded-lg border shadow-lg p-10">
        <Switch>
          <Route exact path="/main" component={() => <Main />} />
          <Route exact path="/main/:userName" component={() => <RepoList />} />
          <Route exact path="/main/:userName/:repositoryName" component={() => <RepoRead />} />
        </Switch>
        </div>
      </div>
    </div>
  )
}

Dummy.propTypes = {}

export default React.memo(Dummy)
