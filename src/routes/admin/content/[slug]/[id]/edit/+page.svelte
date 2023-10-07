<script lang="ts">
    import { goto } from "$app/navigation";
    import ButtonList from "$lib/components/core/ButtonList.svelte";
    import PageHeader from "$lib/components/core/PageHeader.svelte";
    import FieldInput from "$lib/components/content/FieldInput.svelte";
    import { Button, Card, CardBody, El, Icon } from "yesvelte";
  
    export let data;
  
    console.log('ssssss', data)
    async function onSubmit() {
      const value2: any = {}

      for(let field of data.table.fields) {
      console.log(value[field.name], value);

        if(field.type === 'relation' && typeof value[field.name] === 'object' && !Array.isArray(value[field.name])) {

          if(field.multiple) {
            value2[field.name] = value[field.name].map(x => x.id)
          } else {
            value2[field.name] = value[field.name].id
          }
        } else {
          value2[field.name] = value[field.name]
        }        
      }

      value2['id'] = value.id
      
      await fetch('../../' + '?/update', {method: 'POST', body: JSON.stringify(value2)}).then(res => res.json())
      await goto('../..');
    }
  
    let value: any = data.value;
  </script>
  
  
  <El container="lg">
    <PageHeader title="Update {data.table.name} ({data.value.id})">
      <Button href="../../{data.table.slug}">
        <Icon name="chevron-left" />
        Back
      </Button>
    </PageHeader>
    
    <Card mt="4" tag="form" on:submit={onSubmit}>
      <CardBody row>
  
      {#each data.table.fields as field}
        <FieldInput {field} bind:data={value} />
      {/each}
  
      <El col d="flex" mt="3">
        <ButtonList ms="auto">
          <Button>Cancel</Button>
  
          <Button type="submit" color="primary">
            Update
          </Button>
        </ButtonList>
      </El>
    </CardBody>
  
    </Card>
  </El>
  