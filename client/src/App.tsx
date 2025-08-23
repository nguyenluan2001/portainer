import { useEffect, useState } from 'react'
import { Terminal } from "@xterm/xterm"
import "@xterm/xterm/css/xterm.css"
import { ATTACH_CONTAINER_EVENT } from './constant/socket'
// import ContainerPage from './pages/ContainerPage'

function App() {

  useEffect(() => {
    // onInitTerminal()
    // onInitSocket()
  }, [])

  const onInitTerminal = () => {
    if (window.TERMINAL) return
    const terminalEl = document.getElementById('terminal')
    if (!terminalEl) return
    var term = new Terminal({
      cursorBlink: true
    });
    term.open(terminalEl);
    term.onData(data => {
      // Send the data to the server via the WebSocket
      console.log("onData", data)
      // term.write(data)
      if (!window.SOCKET) return
      window.SOCKET.send(data)
    });
    window.TERMINAL = term
  }

  const onInitSocket = async () => {
    if (window.SOCKET) return
    console.log(111111)
    const socket = new WebSocket(`${window.API_URL}/api/ws/attach`);
    window.SOCKET = socket
    // // Connection opened
    socket.addEventListener("open", () => {
      socket.send("START");
    });

    onListen()

  }

  const onListen = () => {
    if (!window.SOCKET) return
    window.SOCKET.addEventListener("message", (event) => {
      // const payload = JSON.parse(event.data);
      console.log("Message from server ", event.data);
      window.TERMINAL.write(event.data)
      // switch (payload.event) {
      //   case "output": {
      //     console.log("output", payload)
      //     window.TERMINAL.write(payload.buffers)

      //   }
      // }
    });
  }

  // return (
  //   <div className='w-screen h-screen' id="terminal">
  //   </div>
  // )

  return (
    <>
      {/* <ContainerPage /> */}
    </>
  )

}

export default App
