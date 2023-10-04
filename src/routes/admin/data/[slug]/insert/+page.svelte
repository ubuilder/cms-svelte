<script lang="ts">
  import { goto } from "$app/navigation";
  import ButtonList from "$lib/components/core/ButtonList.svelte";
  import PageHeader from "$lib/components/core/PageHeader.svelte";
  import FieldInput from "$lib/components/data/FieldInput.svelte";
  import { Button, Card, CardBody, El, Icon } from "yesvelte";

  export let data;

  async function onSubmit() {
    const value2: any = {}

    for(let field of data.table.fields) {
      console.log(value[field.name], value);
        if(field.type === 'relation' && typeof value[field.name] === 'object') {
          
          value2[field.name] = value[field.name]

          // if(field.multiple) {
            // value2[field.name] = value[field.name].map(x => x.id)
          // } else {
            // value2[field.name] = value[field.name].id
          // }
        } else {
          value2[field.name] = value[field.name]
        }        
      }

    await fetch('/admin/data/' + data.table.slug + '?/insert', {method: 'POST', body: JSON.stringify(value2)}).then(res => res.json())
    await goto('/admin/data/' + data.table.slug);
  }

  let value: any = {};
</script>


<El container="lg">
  <PageHeader title="Insert {data.table.name}">
    <Button href="/admin/data/{data.table.slug}">
      <Icon name="chevron-left" />
      Back
    </Button>
  </PageHeader>
  
  <Card mt="4" tag="form" on:submit={onSubmit}>
    <CardBody row>

    {#each data.table.fields as field}
      <FieldInput {field} bind:data={value} />
    {/each}

    {JSON.stringify(value)}
    <El col d="flex" mt="3">
      <ButtonList ms="auto">
        <Button>Cancel</Button>

        <Button type="submit" color="primary">
          <Icon name="plus" />
          Insert
        </Button>
      </ButtonList>
    </El>
  </CardBody>

  </Card>
</El>
