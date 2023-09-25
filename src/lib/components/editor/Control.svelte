<script lang="ts">
	import { onMount } from "svelte";
    import interact from "interactjs";

    let dropZone: Element
    let controls:Element
    let rect: any
    let gTarget: Element

    interface IUpdateControl{
        controls:any;
        target:any;
        observer:any;
        disconnect():void;
        connect(target: any): any;
    }

    class UpdateControls implements IUpdateControl{
        controls: any;
        target: any;
        observer: any;

        constructor(controls: any){
            this.controls = controls
        }

        createObserver(){
            return  new ResizeObserver(mutations=>{
                const range = document.createRange();
                range.selectNode(mutations[0].target);
                rect = range.getBoundingClientRect();
                this.controls.style.width = rect.width + 'px'
                this.controls.style.height = rect.height + 'px'
                this.controls.style.top = rect.top + 'px'
                this.controls.style.left = rect.left + 'px' 
                this.controls.style.display = 'block'
                range.detach()
            })
        }

        connect(target: Element){
            gTarget = target
            this.target = target
            this.observer = this.createObserver()
            this.observer.observe(this.target)
            this.controls.style.display = 'block'
            console.log('connected')
        }

        disconnect(){
            this.observer?.disconnect()
            console.log('resize observer disconnected')
            // this.controls.style.display = 'none'
        }
        makeRsizeable(){
            interact(this.controls)
            .resizable({
                edges: { top: '.top', left: '.left', bottom: '.bottom', right: '.right' },
                listeners:{
                    move: function (event) {
                        console.log('event', event)
                        let { x, y } = event.target.dataset;
    
                        x = (parseFloat(x) || 0) + event.deltaRect.left;
                        y = (parseFloat(y) || 0) + event.deltaRect.top;
    
                        console.log('y: ', y, "x: ", x)
                        
                        if(gTarget){
                            Object.assign(gTarget.style, {
                                width: `${event.rect.width}px`,
                                height: `${event.rect.height}px`,
                                transform: `translate(${x}px, ${y}px)`
                            });
                        }
                        // Object.assign(event.target.style, {
                        //     width: `${event.rect.width}px`,
                        //     height: `${event.rect.height}px`,
                        //     transform: `translate(${x}px, ${y/15}px)`
                        // });
                        Object.assign(event.target.dataset, { x, y });
                    }
                }
            })
            .on('down', (event) => {
                if (event.target.classList.contains('resize-point')) {
                    event.preventDefault();
                }
            })
            .on('resizeend', (event) => {
                Object.assign(event.target.style, {
                            transform: `translate(${0}px, ${0}px)`
                        });
            });
        }
    }

    let observer: any;
    onMount(()=>{

        observer = new UpdateControls(controls)
        dropZone= document.querySelector('.drop-zone')
        observer.makeRsizeable()

        dropZone?.addEventListener('click',(event)=>{
            console.log('click', event)
            if(!event.target?.classList?.contains('u-component'))return ;
            observer.connect(event.target as Element)
        })

        dropZone?.addEventListener('click', (event)=>{
            if(!event.target?.classList?.contains('u-component')) {
                console.log('disconnentcd')
                observer.disconnect()
            }
        })
    })

</script>

<div
 bind:this={controls}
 class=" wrapper " 
 style="position: absolute;height: 10px;z-index: 1; width: 100px; border: 2px solid red; pointer-events: none"
>
    <div class = 'resize-point left'></div>
    <div class = 'resize-point right'></div>
    <div class = 'resize-point top'></div>
    <div class = 'resize-point bottom'></div>
    <div class = 'resize-point top left top-left'></div>
    <div class = 'resize-point top right top-right'></div>
    <div class = 'resize-point bottom left bottom-left'></div>
    <div class = 'resize-point bottom right bottom-right '></div>
    <div class="control">
        <div class = 'holder'></div>
        <div class = 'close'></div>
    </div>
</div>
