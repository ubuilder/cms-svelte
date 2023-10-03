<script lang="ts">
    import { goto } from "$app/navigation";
    import ButtonList from "$lib/components/core/ButtonList.svelte";
    import PageHeader from "$lib/components/core/PageHeader.svelte";
    import FieldInput from "$lib/components/data/FieldInput.svelte";
    import { Button, Card, CardBody, El, Icon } from "yesvelte";
  
    export let data;
  
    async function onSubmit() {
      await fetch('/admin/data/' + data.table.slug + '?/update', {method: 'POST', body: JSON.stringify(value)}).then(res => res.json())
      await goto('/admin/data/' + data.table.slug);
    }
  
    let value: any = data.value;
  </script>
  
  
  <El container="lg">
    <PageHeader title="Update {data.table.name} ({data.value.id})">
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
  