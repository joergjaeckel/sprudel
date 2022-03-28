import {Suspense} from 'react'
import {HashRouter as Router, Link, Route, Routes, useMatch} from 'react-router-dom'
import logo from './logo.png'
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
            <a href="https://github.com/joergjaeckel/sprudel" style={{position: 'absolute', bottom: '40px', right: '35px'}}>
                <img src={logo} alt="" style={{width: '200px'}}/>
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
                    <div className={`spot ${name === routeName && 'selected'}`} />
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
