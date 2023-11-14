<script lang="ts">
  import { Accordion, AccordionBody, AccordionHeader, Card, El } from "yesvelte"

  export let title: string | undefined = undefined;

</script>

<Card my="1">
<Accordion border="0">
    <AccordionHeader p=0><El w=100 style="background-color: #ffffff80; border-top-right-radius: 4px; border-top-left-radius: 4px" px=3 py=2><slot name="title">{title}</slot></El></AccordionHeader>
    <AccordionBody p=0>
      <El borderTop style="background-color: var(--y-bg-surface)" p=2>
        <slot />
      </El>
    </AccordionBody>
  </Accordion>
</Card>
