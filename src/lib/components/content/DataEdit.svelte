<script lang="ts">
    import { enhance } from '$app/forms'
    import { goto, invalidateAll } from '$app/navigation'
    import FieldInput from '$lib/components/content/FieldInput.svelte'
    import { api } from '$lib/helpers/api'
    import type { SubmitFunction } from '@sveltejs/kit'
    import { Button, ButtonList, PageHeader, Card, CardBody, El, Icon, Page, alert } from '@ulibs/yesvelte'
    import { createEventDispatcher } from 'svelte'
  
    export let table
    export let form
  
    let value: any  = table.selectedItem
    async function insert() {
      const res = await api(`/content/${table.id}`, { data: value, params: {id:value.id} }).then(res =>res)
      alert.success(res.message)		
      goBack()
    }
    
    const dispatch = createEventDispatcher()
    function goBack() {
      dispatch('goBack')
    }
  </script>
  
  <Page>
    <PageHeader title="Edit Data {value.name}">
      <Button on:click={goBack}>Cancel</Button>
      <Button on:click={insert} color="primary" bgColor="blue">Edit</Button>
    </PageHeader>
  
    <El container="lg">
     
      <Card mt="4">
        <CardBody row>
          {#each table.fields as field}
            {@const errorMessage = form?.field === field.name ? form.message : undefined}
            <FieldInput {errorMessage} {field} bind:data = {value} />
          {/each}
        </CardBody>
      </Card>
    </El>
  </Page>
  