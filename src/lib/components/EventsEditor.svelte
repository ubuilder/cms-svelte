<script lang='ts'>

import { Accordion, AccordionBody, AccordionHeader, Accordions, Button, Card, El, FormField, FormInput, FormSelect, Icon } from "yesvelte"
  export let value: string = ''
  let localValue = value
 
  let events: any[] = []

  function parse(value = '') {

    const parts = value.split(' x-on:').filter(x => !!x)
    events = []

    console.log('parts: ', parts, value)

    for(let part of parts) {
        const eventName = part.split('=')[0]
        const eventValue = part.split('=').slice(1).join('=')
        // x-on:click=""

        console.log('eventName', eventName)
        console.log('eventValue', eventValue)

        events.push({name: eventName, value: eventValue.slice(1, eventValue.length - 1)})
    }

    console.log('parse: ', events)

  }

  $: parse(localValue)
  
  function stringify(values: any[]) {
    const eventsObj = values.reduce((prev, curr) => ({...prev, [curr.name]: curr}), {})

    value = ''
    for(let key in eventsObj) {
        if(eventsObj[key]) {
            value += ' x-on:' + key + '=\"' + eventsObj[key].value + '\"'
            // value += ' x-on:' + key + '=' + "\"" + eventsObj[key] + "\""
        }
    }
    console.log('stringify done', value)
  }

  const eventTypes = [
    {text: "Click", key: 'click'},
    {text: "Double click", key: 'dblclick'},
    {text: "Mouse enter", key: 'mouseenter'},
    {text: "Mouse leave", key: 'mouseleave'},
  ]

    $: stringify(events)
</script>
<El class="events">
    <FormField label="Event Listeners">

        <Accordions>

        {#each events ?? [] as event}
        
        <Card  mt=2>

        <Accordion border=0>
            <AccordionHeader p=0>
                <El py=2 px=3>{eventTypes.find(x => x.key === event.name)?.text ?? '---'}</El>
            </AccordionHeader>
            <AccordionBody p=0>
                <El p=2 row>
                    <FormSelect placeholder="Choose event trigger" items={eventTypes} bind:value={event.name} key="key" let:item>
                        {item.text}
                    </FormSelect>
                    <FormInput bind:value={event.value}/>
                    <Button ms="auto" color="danger" on:click={() => events = events.filter(x => x !== event)}>Remove</Button>
                </El>
            </AccordionBody>
        </Accordion>
    </Card>

        {/each}
    </Accordions>

        <Button mt=3 color="primary" on:click={() => events = [...events, {name: undefined, value: undefined}]}>
            <Icon name="plus"/>
            Add
        </Button>
    </FormField>
</El>