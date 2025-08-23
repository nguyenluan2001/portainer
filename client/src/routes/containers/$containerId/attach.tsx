import { createFileRoute } from '@tanstack/react-router'
import { Terminal } from '@xterm/xterm'
import { useEffect, useRef } from 'react'

export const Route = createFileRoute('/containers/$containerId/attach')({
    component: RouteComponent,
})

function RouteComponent() {
    const { containerId } = Route.useParams()

    const socketRef = useRef<WebSocket>(null)
    const terminalRef = useRef<Terminal>(null)

    useEffect(() => {
        onInitTerminal()
        onInitSocket()
    }, [])

    const onInitTerminal = () => {
        if (terminalRef.current) return
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
            if (!socketRef.current) return
            socketRef.current.send(data)
        });
        terminalRef.current = term
    }

    const onInitSocket = async () => {
        if (socketRef.current) return
        console.log(111111)
        const socket = new WebSocket(`${window.API_URL}/api/ws/attach?containerId=${containerId}`);
        socketRef.current = socket
        // // Connection opened
        socket.addEventListener("open", () => {
            socket.send("START_ATTACH");
        });

        onListen()

    }

    const onListen = () => {
        if (!socketRef.current) return
        socketRef.current.addEventListener("message", (event) => {
            if (!terminalRef.current) return
            console.log("Message from server ", event.data);
            terminalRef.current.write(event.data)
        });
    }

    return (
        <div className='w-screen h-screen' id="terminal">
        </div>
    )
}
