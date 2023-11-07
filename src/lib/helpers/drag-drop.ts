interface Options {
    draggable: string,
    dropzone: string
}
export function DragDrop(container: HTMLElement, options: Options) {
	const draggables = container.querySelectorAll(options.draggable)
	const dropzones = container.querySelectorAll(options.dropzone)
	let listeners: Record<string, any[]> = {
		return: [],
		drop: [],
		start: [],
		move: [],
	}

	let isDown = false
	let clientX: number, clientY: number
	let current: HTMLElement

    container.style.position = 'relative'

	let timer: any
	function onMouseDown(event: MouseEvent, el: HTMLElement) {
		if(timer) clearTimeout(timer)
        timer = setTimeout(() => {
            event.stopPropagation()

		current = el
		listeners['start'].forEach((cb) => cb({ source: current }))

		clientX = event.clientX
		clientY = event.clientY

		isDown = true
    }, 100)

	}

	function onMouseMove(event: MouseEvent) {
		if (isDown) {
			listeners['move'].forEach((cb) => cb({ source: current, event }))

		}
	}

	function onDocumentMouseUp(event: MouseEvent) {
		if(timer) clearTimeout(timer)
		if (isDown) {
			isDown = false
			
			listeners['return'].forEach((cb) => cb({ return: true }))
		}
	}

	function onDropzoneMouseUp(event: MouseEvent) {
		if(timer) clearTimeout(timer)
		if (isDown) {
			

			listeners['drop'].forEach((cb) => cb({ source: current, target: event.target }))

			isDown = false
		}
	}

    document.addEventListener('mouseup', onDocumentMouseUp)

	draggables.forEach((el) => {
		(el as HTMLElement).addEventListener('mousedown', (event) => onMouseDown(event, el as HTMLElement))
		container.addEventListener('mousemove', onMouseMove)
	})

	dropzones.forEach((el) => {
		(el as HTMLElement).addEventListener('mouseup', onDropzoneMouseUp)
	})



    function destroy() {
		listeners = {
			return: [],
			drop: [],
			start: [],
			move: [],
		}
        document.removeEventListener('mouseup', onDocumentMouseUp)

        draggables.forEach((el) => {
            (el as HTMLElement).removeEventListener('mousedown', (ev) => onMouseDown(ev, el)) // TODO different listener...
            container.removeEventListener('mousemove', onMouseMove)
        })
    
        dropzones.forEach((el) => {
            (el as HTMLElement).removeEventListener('mouseup', onDropzoneMouseUp)
        })
    
    }


	function on(event: 'start' | 'move' | 'return' | 'drop', callback: (event: any) => void) {
		listeners[event] ??= []
		listeners[event].push(callback)
	}

	return {
		on,
        destroy
	}
}
