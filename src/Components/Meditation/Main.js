import React, { useState, useEffect } from 'react'
import './Main.css'
import Navbar from './Navbar/Navbar'
import Timer from './Timer/Timer'
import Meditation from './Meditation/Meditation'
import SettingsMenu from './SettingsMenu/SettingsMenu'
import Footer from './Footer/Footer'

function Main() {
  const [showSettings, setShowSettings] = useState(false)
  const [showMeditation, setShowMeditation] = useState(false)
  const [reset, setReset] = useState(false)
  const [skip, setSkip] = useState()
  const [intervalCount, setIntervalCount] = useState(0)
  const [sessionCount, setSessionCount] = useState(1)

  const triggerReset = () => setReset(reset => !reset)

  const triggerSkip = () => {
    setSkip(true)
  }

  const openMeditation = () => {
    let timer = document.querySelector('#timer')

    timer.style.position = timer.style.position === 'absolute'
      ? 'relative'
      : 'absolute'

    setShowMeditation(!showMeditation)
  }

  useEffect(() => {
    if (intervalCount >= 5) {
      setIntervalCount(1)
      setSessionCount(sessionCount + 1)
    }
  }, [intervalCount]) // eslint-disable-line

  return (
    <div className='meditation-app-container'>
      <div id="meditation-app">
        <Navbar
          openSettings={() => setShowSettings(!showSettings)}
          openMeditation={openMeditation}
          hideIcons={showSettings}
          isMeditation={showMeditation}
          triggerReset={triggerReset}
          intervalCount={intervalCount}
          sessionCount={sessionCount}
        />
        {showSettings
          ? <SettingsMenu />
          : null
        }
        {showMeditation
          ? <Meditation />
          : null
        }
        <Timer
          hidden={showSettings || showMeditation}
          reset={reset}
          setIntervalCount={setIntervalCount}
          intervalCount={intervalCount}
          skip={skip}
          setSkip={setSkip}
          openMeditation={openMeditation}
        />
        <Footer hidden={showSettings || showMeditation} triggerSkip={triggerSkip} />
      </div>
    </div>
  )
}

export default Main