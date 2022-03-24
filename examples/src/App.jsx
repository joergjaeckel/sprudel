import {Suspense} from 'react'
import {HashRouter as Router, Link, Route, Routes, useMatch} from 'react-router-dom'

import * as demos from './demos'

const defaultName = 'Simple'

const visibleComponents = Object.entries(demos).reduce((acc, [name, component]) => ({...acc, [name]: component}), {})

const DefaultComponent = visibleComponents[defaultName].Component

const RoutedComponent = () => {
    const {
        params: {name},
    } = useMatch('/demo/:name') || {params: {name: defaultName}}
    const Component = visibleComponents[name || defaultName].Component
    return <Component/>
}

function Intro() {
    return (
        <div className={'page'}>
            <Suspense fallback={null}>
                <Routes>
                    <Route path="/*" element={<DefaultComponent />}/>
                    <Route path="/demo/:name" element={<RoutedComponent />} />
                </Routes>
            </Suspense>
            <Demos/>
            <a href="https://github.com/joergjaeckel/sprudel" style={{color: 'white'}}>
                Github
            </a>
        </div>
    )
}

function Demos() {
    const {
        params: {name: routeName},
    } = useMatch('/demo/:name') || {params: {name: defaultName}}
    return (
        <div className={'demo-panel'}>
            {Object.entries(visibleComponents).map(([name], key) => (
                <Link key={key} to={`/demo/${name}`} title={name}>
                    <div className={'spot'} style={{backgroundColor: name === routeName ? 'salmon' : 'white'}}/>
                </Link>
            ))}
        </div>
    )
}

export default function App() {
    return (
        <Router>
            <Intro/>
        </Router>
    )
}
